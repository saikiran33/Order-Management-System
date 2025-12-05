const Payment = require('../models/Payment');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/responseHandler');
const { PAYMENT_STATUS } = require('../config/constants');
const crypto = require('crypto');

// Mock payment gateway
const mockPaymentGateway = {
  processPayment: async (amount, method) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 90% success rate
    const success = Math.random() > 0.1;
    
    return {
      success,
      transactionId: `TXN-\${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
      message: success ? 'Payment processed successfully' : 'Payment failed',
      gatewayResponse: {
        timestamp: new Date().toISOString(),
        method,
        amount
      }
    };
  },
  
  processRefund: async (transactionId, amount) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      refundTransactionId: `RFD-\${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
      message: 'Refund processed successfully'
    };
  }
};

exports.processPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new ApiError('NOT_FOUND', 'Order not found', 404);
    }
    
    // Check authorization
    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      throw new ApiError('FORBIDDEN', 'Not authorized', 403);
    }
    
    // Check if already paid
    const existingPayment = await Payment.findOne({
      order: orderId,
      status: PAYMENT_STATUS.COMPLETED
    });
    
    if (existingPayment) {
      throw new ApiError('ALREADY_PAID', 'Order is already paid', 400);
    }
    
    // Process payment through gateway
    const paymentResult = await mockPaymentGateway.processPayment(
      order.total,
      paymentMethod || order.paymentMethod
    );
    
    if (!paymentResult.success) {
      // Create failed payment record
      await Payment.create({
        order: orderId,
        transactionId: paymentResult.transactionId,
        amount: order.total,
        method: paymentMethod || order.paymentMethod,
        status: PAYMENT_STATUS.FAILED,
        gatewayResponse: paymentResult.gatewayResponse
      });
      
      throw new ApiError('PAYMENT_FAILED', paymentResult.message, 400);
    }
    
    // Create payment record
    const payment = await Payment.create({
      order: orderId,
      transactionId: paymentResult.transactionId,
      amount: order.total,
      method: paymentMethod || order.paymentMethod,
      status: PAYMENT_STATUS.COMPLETED,
      gatewayResponse: paymentResult.gatewayResponse
    });
    
    // Update order payment status
    order.paymentStatus = 'completed';
    if (order.status === 'pending') {
      order.status = 'confirmed';
    }
    await order.save();
    
    successResponse(res, {
      payment,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.refundPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new ApiError('NOT_FOUND', 'Order not found', 404);
    }
    
    const payment = await Payment.findOne({
      order: orderId,
      status: PAYMENT_STATUS.COMPLETED
    });
    
    if (!payment) {
      throw new ApiError('NO_PAYMENT', 'No completed payment found for this order', 404);
    }
    
    if (payment.status === PAYMENT_STATUS.REFUNDED) {
      throw new ApiError('ALREADY_REFUNDED', 'Payment already refunded', 400);
    }
    
    // Process refund
    const refundResult = await mockPaymentGateway.processRefund(
      payment.transactionId,
      payment.amount
    );
    
    if (!refundResult.success) {
      throw new ApiError('REFUND_FAILED', refundResult.message, 400);
    }
    
    // Update payment
    payment.status = PAYMENT_STATUS.REFUNDED;
    payment.refundAmount = payment.amount;
    payment.refundTransactionId = refundResult.refundTransactionId;
    payment.refundedAt = new Date();
    await payment.save();
    
    // Update order
    order.paymentStatus = 'refunded';
    await order.save();
    
    successResponse(res, {
      payment,
      message: 'Refund processed successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ order: orderId })
      .sort({ createdAt: -1 })
      .populate('order', 'orderNumber total');
    
    if (!payment) {
      throw new ApiError('NOT_FOUND', 'No payment found for this order', 404);
    }
    
    successResponse(res, { payment });
  } catch (error) {
    next(error);
  }
};