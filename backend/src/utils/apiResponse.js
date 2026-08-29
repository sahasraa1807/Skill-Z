exports.success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

exports.error = (res, message = 'Error', statusCode = 400, code = null) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    code
  });
};
