const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimiter');
const {
  productValidation,
  idValidation,
  validate
} = require('../middleware/validator');
const { USER_ROLES } = require('../config/constants');

// Apply rate limiter to all routes
router.use(generalLimiter);

// @route   GET /api/products
// @desc    Get all products with pagination and filters
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get(
  '/:id',
  idValidation,
  validate,
  productController.getProduct
);

// Protected routes (require authentication)
router.use(authenticateToken);

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin/Seller
router.post(
  '/',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SELLER),
  productValidation,
  validate,
  productController.createProduct
);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin/Seller
router.put(
  '/:id',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SELLER),
  idValidation,
  validate,
  productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin/Seller
router.delete(
  '/:id',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SELLER),
  idValidation,
  validate,
  productController.deleteProduct
);

// @route   PATCH /api/products/:id/stock
// @desc    Update product stock
// @access  Private/Admin/Seller
router.patch(
  '/:id/stock',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SELLER),
  idValidation,
  validate,
  productController.updateStock
);

module.exports = router;

