const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProduct);

router.post('/:id/reviews', protect, addReview);

// ADMIN ONLY routes
router.post('/', protect, restrictTo('admin'), upload.array('images', 6), createProduct);
router.patch('/:id', protect, restrictTo('admin'), upload.array('images', 6), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;
