const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/responseHandler');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError('USER_EXISTS', 'User with this email already exists', 400);
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
      address
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    successResponse(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, null, 201);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }
    
    if (!user.isActive) {
      throw new ApiError('ACCOUNT_INACTIVE', 'Your account is inactive', 403);
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    successResponse(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    successResponse(res, { user });
  } catch (error) {
    next(error);
  }
};