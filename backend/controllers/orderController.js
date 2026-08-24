const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
const {
  orderConfirmationEmail,
  orderCompletionEmail,
  orderStatusUpdateEmail,
} = require('../templates/emailTemplates');

const generateOrderNumber = () => {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `UT-${Date.now().toString().slice(-6)}-${random}`;
};

// Fake payment gateway - always "succeeds" for demo purposes.
// This clearly never touches any real payment processor.
const mockProcessPayment = async ({ amount }) => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // simulate network latency
  return {
    success: true,
    id: `MOCK-TXN-${crypto.randomBytes(6).toString('hex')}`,
    status: 'succeeded',
    updateTime: new Date().toISOString(),
    amountCharged: amount, // fake — no money moves
  };
};

// @desc    Create new order (mock checkout)
// @route   POST /api/orders
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError('No order items provided.', 400));
  }

  // Validate stock & compute prices server-side (never trust client price)
  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) return next(new AppError(`Product not found: ${item.productId}`, 404));

    const variant = product.variants.find(
      (v) => v.size === item.size && v.color === item.color
    );
    if (!variant || variant.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${product.name} (${item.size}/${item.color}).`, 400));
    }

    itemsPrice += product.price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      size: item.size,
      color: item.color,
      price: product.price,
      quantity: item.quantity,
    });

    variant.stock -= item.quantity;
    product.totalSold += item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  let shippingPrice = itemsPrice > 100 ? 0 : 9.99;
  let discountAmount = 0;

  if (couponCode) {
    const codeUpper = couponCode.trim().toUpperCase();
    if (codeUpper === 'URBAN15') {
      discountAmount = Number((itemsPrice * 0.15).toFixed(2));
    } else if (codeUpper === 'WELCOME10') {
      discountAmount = Number((itemsPrice * 0.10).toFixed(2));
    } else if (codeUpper === 'FREESHIP') {
      shippingPrice = 0;
    }
  }

  const netItemsPrice = Math.max(0, itemsPrice - discountAmount);
  const taxPrice = Number((netItemsPrice * 0.08).toFixed(2));
  const totalPrice = Number((netItemsPrice + shippingPrice + taxPrice).toFixed(2));

  // ---- MOCK PAYMENT ----
  const paymentResult = await mockProcessPayment({ amount: totalPrice });

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod: paymentMethod || 'mock_card',
    paymentResult: {
      id: paymentResult.id,
      status: paymentResult.status,
      updateTime: paymentResult.updateTime,
    },
    isPaid: true,
    paidAt: Date.now(),
    status: 'confirmed',
    statusHistory: [{ status: 'confirmed' }],
  });

  // Send order confirmation email
  try {
    await sendEmail({
      to: req.user.email,
      subject: `Order Confirmed #${order.orderNumber} — UrbanThread (Demo)`,
      html: orderConfirmationEmail({ name: req.user.name, order }),
    });
  } catch (err) {
    console.error('Failed to send order confirmation email:', err.message);
  }

  // ---- LIVE ACTIVITY FEED: broadcast a fake "recent purchase" event ----
  const io = req.app.get('io');
  if (io) {
    io.emit('activity:purchase', {
      productName: orderItems[0]?.name,
      city: shippingAddress?.city || 'Unknown',
      country: shippingAddress?.country || '',
      timestamp: new Date().toISOString(),
    });
  }

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json({ success: true, orders });
});

// @desc    Get single order (owner or admin)
// @route   GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return next(new AppError('Order not found.', 404));

  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this order.', 403));
  }

  res.status(200).json({ success: true, order });
});

// @desc    Get all orders (ADMIN ONLY)
// @route   GET /api/orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, total, orders });
});

// @desc    Update order status (ADMIN ONLY)
// @route   PATCH /api/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status value.', 400));
  }

  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return next(new AppError('Order not found.', 404));

  order.status = status;
  order.statusHistory.push({ status });
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  await order.save();

  try {
    const emailHtml =
      status === 'delivered'
        ? orderCompletionEmail({ name: order.user.name, order })
        : orderStatusUpdateEmail({ name: order.user.name, order });

    await sendEmail({
      to: order.user.email,
      subject:
        status === 'delivered'
          ? `Order Delivered #${order.orderNumber} — UrbanThread (Demo)`
          : `Order Update #${order.orderNumber} — UrbanThread (Demo)`,
      html: emailHtml,
    });
  } catch (err) {
    console.error('Failed to send order status email:', err.message);
  }

  res.status(200).json({ success: true, order });
});

// @desc    Validate coupon code
// @route   POST /api/orders/validate-coupon
exports.validateCoupon = asyncHandler(async (req, res, next) => {
  const { couponCode, itemsPrice = 0 } = req.body;
  if (!couponCode) return next(new AppError('Please enter a coupon code.', 400));

  const codeUpper = couponCode.trim().toUpperCase();
  let discountPercentage = 0;
  let freeShipping = false;
  let description = '';

  if (codeUpper === 'URBAN15') {
    discountPercentage = 15;
    description = '15% discount applied';
  } else if (codeUpper === 'WELCOME10') {
    discountPercentage = 10;
    description = '10% welcome discount applied';
  } else if (codeUpper === 'FREESHIP') {
    freeShipping = true;
    description = 'Free shipping applied';
  } else {
    return next(new AppError('Invalid or expired promo code.', 404));
  }

  const discountAmount = Number(((itemsPrice * discountPercentage) / 100).toFixed(2));

  res.status(200).json({
    success: true,
    code: codeUpper,
    discountPercentage,
    discountAmount,
    freeShipping,
    description,
  });
});

