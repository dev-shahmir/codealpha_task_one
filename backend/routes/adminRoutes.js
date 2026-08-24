const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

// Every route here requires an authenticated admin — no one else can reach these.
router.use(protect, restrictTo('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);

module.exports = router;
