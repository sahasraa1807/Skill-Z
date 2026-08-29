const config = require('../config');

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || null;

  // Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Resource already exists';
    code = 'P2002';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Resource not found';
    code = 'P2025';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }

  // express-validator
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    message = err.array().map(e => e.msg).join(', ');
  }

  const response = {
    success: false,
    error: message,
    code
  };

  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
