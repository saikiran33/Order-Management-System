const Product = require('../models/Product');
const { successResponse } = require('../utils/responseHandler');
const { paginateResults } = require('../utils/helpers');

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user._id
    });
    
    successResponse(res, { product }, null, 201);
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      category,
      minPrice,
      maxPrice,
      search
    } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }
    
    // Pagination
    const { skip, limit: pageLimit } = paginateResults(page, limit);
    
    // Sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };
    
    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageLimit)
      .populate('seller', 'name email');
    
    const total = await Product.countDocuments(query);
    
    successResponse(
      res,
      { products },
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

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    
    if (!product) {
      throw new ApiError('NOT_FOUND', 'Product not found', 404);
    }
    
    successResponse(res, { product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      throw new ApiError('NOT_FOUND', 'Product not found', 404);
    }
    
    // Check if user is admin or the seller
    if (req.user.role !== 'admin' && product.seller.toString() !== req.user._id.toString()) {
      throw new ApiError('FORBIDDEN', 'Not authorized to update this product', 403);
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    successResponse(res, { product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      throw new ApiError('NOT_FOUND', 'Product not found', 404);
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && product.seller.toString() !== req.user._id.toString()) {
      throw new ApiError('FORBIDDEN', 'Not authorized to delete this product', 403);
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    successResponse(res, { message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { quantity, operation = 'set' } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      throw new ApiError('NOT_FOUND', 'Product not found', 404);
    }
    
    if (operation === 'set') {
      product.stock = quantity;
    } else if (operation === 'add') {
      product.stock += quantity;
    } else if (operation === 'subtract') {
      if (product.stock < quantity) {
        throw new ApiError('INSUFFICIENT_STOCK', 'Not enough stock to subtract', 400);
      }
      product.stock -= quantity;
    }
    
    await product.save();
    
    successResponse(res, { product });
  } catch (error) {
    next(error);
  }
};