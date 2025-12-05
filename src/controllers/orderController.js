const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const {
  generateOrderNumber,
  calculateTotal,
  validateShippingAddress,
  paginateResults
} = require('../utils/helpers');
const { ORDER_STATUS } = require('../config/constants');

exports.createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { items, shippingAddress, paymentMethod, discountPercent = 0 } = req.body;
    
    // Validate shipping address
    if (!validateShippingAddress(shippingAddress)) {
      throw new ApiError('INVALID_ADDRESS', 'Invalid shipping address', 400);
    }
    
    // Fetch products and check stock
    const orderItems = [];
    let insufficientStock = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product || !product.isActive) {
        throw new ApiError('PRODUCT_NOT_FOUND', `Product ${item.productId} not found`, 404);
      }
      
      if (product.stock < item.quantity) {
        insufficientStock.push({
          product: product.name,
          available: product.stock,
          requested: item.quantity
        });
      }
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }
    
    if (insufficientStock.length > 0) {
      throw new ApiError(
        'INSUFFICIENT_STOCK',
        `Insufficient stock for: ${insufficientStock.map(i => 
          `${i.product} (available: ${i.available}, requested: ${i.requested})`
        ).join(', ')}`,
        400
      );
    }
    
    // Calculate totals
    const { subtotal, tax, total } = calculateTotal(orderItems);
    const discount = (total * discountPercent) / 100;
    const finalTotal = total - discount;
    
    // Create order
    const order = await Order.create([{
      orderNumber: generateOrderNumber(),
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      discount,
      total: finalTotal,
      status: ORDER_STATUS.PENDING
    }], { session });
    
    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }
    
    await session.commitTransaction();
    
    successResponse(res, { order: order[0] }, null, 201);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      order = 'desc',
      startDate,
      endDate
    } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Pagination
    const { skip, limit: pageLimit } = paginateResults(page, limit);
    
    // Sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };
    
    const orders = await Order.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageLimit)
      .populate('items.product', 'name images');
    
    const total = await Order.countDocuments(query);
    
    successResponse(
      res,
      { orders },
      {
        page: parseInt(page),
        limit: pageLimit,
        total,
        totalPages: Math.ceil(total / pageLimit)
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images sku');
    
    if (!order) {
      throw new ApiError('NOT_FOUND', 'Order not found', 404);
    }
    
    // Check authorization
    if (
      req.user.role !== 'admin' &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      throw new ApiError('FORBIDDEN', 'Not authorized to view this order', 403);
    }
    
    successResponse(res, { order });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      throw new ApiError('NOT_FOUND', 'Order not found', 404);
    }
    
    // Validate status transition
    const validTransitions = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED],
      [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
      [ORDER_STATUS.DELIVERED]: [],
      [ORDER_STATUS.CANCELLED]: []
    };
    
    if (!validTransitions[order.status].includes(status)) {
      throw new ApiError(
        'INVALID_STATUS_TRANSITION',
        `Cannot change status from ${order.status} to ${status}`,
        400
      );
    }
    
    order.status = status;
    if (note) {
      order.statusHistory[order.statusHistory.length - 1].note = note;
    }
    
    await order.save();
    
    successResponse(res, { order });
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id).session(session);
    
    if (!order) {
      throw new ApiError('NOT_FOUND', 'Order not found', 404);
    }
    
    // Check if order can be cancelled
    if (![ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(order.status)) {
      throw new ApiError(
        'CANNOT_CANCEL',
        `Cannot cancel order with status '${order.status}'. Only pending or confirmed orders can be cancelled.`,
        400
      );
    }
    
    // Check authorization
    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      throw new ApiError('FORBIDDEN', 'Not authorized to cancel this order', 403);
    }
    
    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }
    
    // Update order
    order.status = ORDER_STATUS.CANCELLED;
    order.cancelReason = reason;
    await order.save({ session });
    
    await session.commitTransaction();
    
    successResponse(res, { 
      order,
      message: 'Order cancelled successfully. Stock has been restored.'
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

exports.getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);
    
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    successResponse(res, {
      stats,
      summary: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserOrdersByUserId = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, limit: pageLimit } = paginateResults(page, limit);
    
    const orders = await Order.find({ user: req.params.userId })
      .skip(skip)
      .limit(pageLimit)
      .populate('items.product', 'name');
    
    const total = await Order.countDocuments({ user: req.params.userId });
    
    successResponse(
      res,
      { orders },
      { page: parseInt(page), limit: pageLimit, total }
    );
  } catch (error) {
    next(error);
  }
};

exports.generateInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name sku');
    
    if (!order) {
      throw new ApiError('NOT_FOUND', 'Order not found', 404);
    }
    
    // Check authorization
    if (
      req.user.role !== 'admin' &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      throw new ApiError('FORBIDDEN', 'Not authorized', 403);
    }
    
    const invoice = {
      invoiceNumber: `INV-${order.orderNumber}`,
      invoiceDate: new Date().toISOString(),
      order: {
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        status: order.status
      },
      customer: {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone
      },
      items: order.items.map(item => ({
        name: item.name,
        sku: item.product?.sku,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      shippingAddress: order.shippingAddress,
      summary: {
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total: order.total
      }
    };
    
    successResponse(res, { invoice });
  } catch (error) {
    next(error);
  }
};