const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  validateCoupon,
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect); // all order routes require login

router.post('/validate-coupon', validateCoupon);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);

// ADMIN ONLY
router.get('/', restrictTo('admin'), getAllOrders);
router.patch('/:id/status', restrictTo('admin'), updateOrderStatus);

module.exports = router;
