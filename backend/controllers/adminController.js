const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard summary stats (ADMIN ONLY)
// @route   GET /api/admin/stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalProducts, totalUsers, revenueAgg, recentOrders, lowStock] =
    await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.find().sort('-createdAt').limit(5).populate('user', 'name email'),
      Product.find({ 'variants.stock': { $lte: 5 } }).limit(5).select('name variants'),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: revenueAgg[0]?.total || 0,
      recentOrders,
      lowStockProducts: lowStock,
    },
  });
});

// @desc    Get all users (ADMIN ONLY)
// @route   GET /api/admin/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.status(200).json({ success: true, users });
});
