const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('UNAUTHORIZED', 'No token provided', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      throw new ApiError('UNAUTHORIZED', 'User not found or inactive', 401);
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError('UNAUTHORIZED', 'Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError('UNAUTHORIZED', 'Token expired', 401));
    }
    next(error);
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          'FORBIDDEN',
          `Role '${req.user.role}' is not authorized to access this resource`,
          403
        )
      );
    }
    next();
  };
};
