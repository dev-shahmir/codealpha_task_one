const asyncHandler = require('express-async-handler');
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const { uploadImageBuffer, deleteImage } = require('../utils/cloudinaryUpload');

// @desc    Get all products (with filtering, search, sort, pagination)
// @route   GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    subCategory,
    minPrice,
    maxPrice,
    size,
    color,
    search,
    sort,
    featured,
    isNewArrival,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isActive: true };

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (featured) filter.featured = featured === 'true';
  if (isNewArrival) filter.isNewArrival = isNewArrival === 'true';
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (size) filter['variants.size'] = size;
  if (color) filter['variants.color'] = color;
  if (search) filter.$text = { $search: search };

  let sortOption = '-createdAt';
  if (sort === 'price_asc') sortOption = 'price';
  if (sort === 'price_desc') sortOption = '-price';
  if (sort === 'rating') sortOption = '-ratingsAverage';
  if (sort === 'popular') sortOption = '-totalSold';

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    products,
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
    'reviews.user',
    'name avatar'
  );

  if (!product) return next(new AppError('Product not found.', 404));

  // Increment view count (used for social proof "X people viewed this" stat)
  product.viewCount += 1;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, product });
});

// @desc    Get featured products for landing page
// @route   GET /api/products/featured
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true, isActive: true }).limit(8);
  res.status(200).json({ success: true, products });
});

// @desc    Create product (ADMIN ONLY)
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res, next) => {
  const body = { ...req.body };

  if (typeof body.variants === 'string') body.variants = JSON.parse(body.variants);
  if (typeof body.tags === 'string') body.tags = JSON.parse(body.tags);
  if (typeof body.seo === 'string') body.seo = JSON.parse(body.seo);

  let baseSlug = slugify(body.name);
  let slug = baseSlug;
  let count = 1;
  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }
  body.slug = slug;

  const images = [];
  if (req.files?.length) {
    for (const file of req.files) {
      const uploaded = await uploadImageBuffer(file.buffer);
      images.push({ url: uploaded.url, publicId: uploaded.publicId, alt: body.name });
    }
  }
  body.images = images;

  const product = await Product.create(body);
  res.status(201).json({ success: true, product });
});

// @desc    Update product (ADMIN ONLY)
// @route   PATCH /api/products/:id
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found.', 404));

  const body = { ...req.body };
  if (typeof body.variants === 'string') body.variants = JSON.parse(body.variants);
  if (typeof body.tags === 'string') body.tags = JSON.parse(body.tags);
  if (typeof body.seo === 'string') body.seo = JSON.parse(body.seo);

  if (req.files?.length) {
    const newImages = [];
    for (const file of req.files) {
      const uploaded = await uploadImageBuffer(file.buffer);
      newImages.push({ url: uploaded.url, publicId: uploaded.publicId, alt: body.name || product.name });
    }
    body.images = [...product.images, ...newImages];
  }

  Object.assign(product, body);
  await product.save();

  res.status(200).json({ success: true, product });
});

// @desc    Delete product (ADMIN ONLY)
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found.', 404));

  for (const img of product.images) {
    await deleteImage(img.publicId);
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted.' });
});

// @desc    Add a review
// @route   POST /api/products/:id/reviews
exports.addReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found.', 404));

  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user.id);
  if (alreadyReviewed) {
    return next(new AppError('You have already reviewed this product.', 400));
  }

  product.reviews.push({ user: req.user.id, name: req.user.name, rating, comment });
  product.ratingsQuantity = product.reviews.length;
  product.ratingsAverage =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Review added.' });
});
