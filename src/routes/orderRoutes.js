const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimiter');
const {
  orderValidation,
  idValidation,
  validate
} = require('../middleware/validator');
const { USER_ROLES } = require('../config/constants');

// Apply authentication to all order routes
router.use(authenticateToken);
router.use(generalLimiter);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post(
  '/',
  orderValidation,
  validate,
  orderController.createOrder
);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', orderController.getUserOrders);

// @route   GET /api/orders/stats/summary
// @desc    Get order statistics
// @access  Private/Admin
router.get(
  '/stats/summary',
  authorizeRoles(USER_ROLES.ADMIN),
  orderController.getOrderStats
);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get(
  '/:id',
  idValidation,
  validate,
  orderController.getOrderById
);

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin/Seller
router.patch(
  '/:id/status',
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SELLER),
  idValidation,
  validate,
  orderController.updateOrderStatus
);

// @route   POST /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.post(
  '/:id/cancel',
  idValidation,
  validate,
  orderController.cancelOrder
);

// @route   GET /api/orders/:id/invoice
// @desc    Generate order invoice
// @access  Private
router.get(
  '/:id/invoice',
  idValidation,
  validate,
  orderController.generateInvoice
);

// @route   GET /api/users/:userId/orders
// @desc    Get specific user's orders
// @access  Private/Admin
router.get(
  '/users/:userId/orders',
  authorizeRoles(USER_ROLES.ADMIN),
  orderController.getUserOrdersByUserId
);

module.exports = router;

