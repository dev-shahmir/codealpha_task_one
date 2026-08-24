const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
  sendContactInquiry,
  subscribeStockAlert,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.post('/contact', sendContactInquiry);
router.post('/notify-stock', subscribeStockAlert);

router.get('/me', protect, getMe);
router.patch('/update-password', protect, updatePassword);

module.exports = router;
