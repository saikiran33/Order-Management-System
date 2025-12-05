const responseHandlerJs = `
exports.successResponse = (res, data, meta = null, statusCode = 200) => {
  const response = {
    success: true,
    data
  };
  
  if (meta) {
    response.meta = meta;
  }
  
  return res.status(statusCode).json(response);
};

exports.errorResponse = (res, code, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      statusCode
    }
  });
};
`;