const ApiError = require('../utils/ApiError');

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error for debugging
  console.error(err);
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new ApiError('INVALID_ID', `Resource not found`, 404);
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = new ApiError(
      'DUPLICATE_FIELD',
      `${field} already exists`,
      400
    );
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new ApiError('VALIDATION_ERROR', messages.join(', '), 400);
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || 'SERVER_ERROR',
      message: error.message || 'Server Error',
      statusCode: error.statusCode || 500,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};