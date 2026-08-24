const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// @desc    Get current user's wishlist (populated with product data)
// @route   GET /api/users/wishlist
exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'wishlist',
    match: { isActive: true },
  });
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

// @desc    Toggle a product in/out of the wishlist
// @route   POST /api/users/wishlist/:productId
exports.toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { productId } = req.params;

  const index = user.wishlist.findIndex((id) => id.toString() === productId);
  let added;
  if (index > -1) {
    user.wishlist.splice(index, 1);
    added = false;
  } else {
    user.wishlist.push(productId);
    added = true;
  }
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, added, wishlist: user.wishlist });
});

// @desc    Get current user's saved addresses
// @route   GET /api/users/addresses
exports.getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Add a new address
// @route   POST /api/users/addresses
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { fullName, phone, line1, line2, city, state, postalCode, country, isDefault } = req.body;

  if (!fullName || !phone || !line1 || !city || !postalCode || !country) {
    return next(new AppError('Please provide all required address fields.', 400));
  }

  if (isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  user.addresses.push({
    fullName, phone, line1, line2, city, state, postalCode, country,
    isDefault: isDefault || user.addresses.length === 0,
  });

  await user.save({ validateBeforeSave: false });
  res.status(201).json({ success: true, addresses: user.addresses });
});

// @desc    Update an address
// @route   PATCH /api/users/addresses/:addressId
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) return next(new AppError('Address not found.', 404));

  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  Object.assign(address, req.body);
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:addressId
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) return next(new AppError('Address not found.', 404));

  address.deleteOne();
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, addresses: user.addresses });
});
