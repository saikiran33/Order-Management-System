const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimiter');
const { idValidation, validate } = require('../middleware/validator');
const { USER_ROLES } = require('../config/constants');

// Apply authentication to all payment routes
router.use(authenticateToken);
router.use(generalLimiter);

// @route   POST /api/payments/:orderId/process
// @desc    Process payment for order
// @access  Private
router.post(
  '/:orderId/process',
  idValidation,
  validate,
  paymentController.processPayment
);

// @route   POST /api/payments/:orderId/refund
// @desc    Refund payment
// @access  Private/Admin
router.post(
  '/:orderId/refund',
  authorizeRoles(USER_ROLES.ADMIN),
  idValidation,
  validate,
  paymentController.refundPayment
);

// @route   GET /api/payments/:orderId/status
// @desc    Get payment status
// @access  Private
router.get(
  '/:orderId/status',
  idValidation,
  validate,
  paymentController.getPaymentStatus
);

module.exports = router;

