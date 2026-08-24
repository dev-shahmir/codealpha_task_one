const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
const { sendTokenResponse } = require('../utils/generateToken');
const {
  welcomeVerifyEmail,
  forgotPasswordEmail,
  passwordResetSuccessEmail,
  contactInquiryEmail,
  backInStockAlertEmail,
} = require('../templates/emailTemplates');

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email and password.', 400));
  }
  if (password.length < 8) {
    return next(new AppError('Password must be at least 8 characters.', 400));
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('An account with this email already exists.', 400));
  }

  const user = await User.create({ name, email, password });

  const verifyToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your email — UrbanThread (Demo Store)',
      html: welcomeVerifyEmail({ name: user.name, verifyUrl }),
    });
  } catch (err) {
    console.error('Failed to send verification email:', err.message);
    // Don't block registration if email fails in dev
  }

  sendTokenResponse(user, 201, res);
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Verification link is invalid or has expired.', 400));
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: 'Email verified successfully.' });
});

// @desc    Login
// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Logout
// @route   POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  // Always respond with success to avoid leaking which emails are registered
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account exists for that email, a reset link has been sent.',
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your password — UrbanThread (Demo Store)',
      html: forgotPasswordEmail({ name: user.name, resetUrl }),
    });
    res.status(200).json({
      success: true,
      message: 'If an account exists for that email, a reset link has been sent.',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Failed to send reset email. Please try again later.', 500));
  }
});

// @desc    Reset password
// @route   PATCH /api/auth/reset-password/:token
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Reset link is invalid or has expired.', 400));
  }

  if (!req.body.password || req.body.password.length < 8) {
    return next(new AppError('Password must be at least 8 characters.', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: 'Your password was changed — UrbanThread (Demo Store)',
      html: passwordResetSuccessEmail({ name: user.name }),
    });
  } catch (err) {
    console.error('Failed to send password-changed email:', err.message);
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Update password while logged in
// @route   PATCH /api/auth/update-password
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Submit client contact inquiry & send email
// @route   POST /api/auth/contact
exports.sendContactInquiry = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, inquiry, message } = req.body;
  if (!email || !message) {
    return next(new AppError('Please provide an email address and message.', 400));
  }

  const name = `${firstName || ''} ${lastName || ''}`.trim() || 'Client';

  try {
    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: 'Inquiry Received — UrbanThread Client Services',
      html: contactInquiryEmail({ name, email, inquiry, message }),
    });

    // Also send alert to store admin if configured
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL !== email) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `[New Inquiry] ${inquiry || 'Client Message'} from ${name}`,
        html: `<p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p><p><strong>Inquiry:</strong> ${inquiry || 'General'}</p><p><strong>Message:</strong></p><blockquote style="background:#f7f6f3;padding:12px;">${message}</blockquote>`,
      });
    }
  } catch (err) {
    console.error('Failed to send contact inquiry email:', err.message);
  }

  res.status(200).json({ success: true, message: 'Inquiry submitted successfully.' });
});

// @desc    Subscribe to back in stock alert & send email confirmation
// @route   POST /api/auth/notify-stock
exports.subscribeStockAlert = asyncHandler(async (req, res, next) => {
  const { email, productName, variantDetails } = req.body;
  if (!email) {
    return next(new AppError('Please provide an email address.', 400));
  }

  try {
    await sendEmail({
      to: email,
      subject: `Stock Alert Confirmed — ${productName || 'UrbanThread'}`,
      html: backInStockAlertEmail({ email, productName, variantDetails }),
    });
  } catch (err) {
    console.error('Failed to send stock alert email:', err.message);
  }

  res.status(200).json({ success: true, message: 'Stock alert subscription saved successfully.' });
});

