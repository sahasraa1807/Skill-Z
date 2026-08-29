const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const { success } = require('../utils/apiResponse');

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors; // caught by errorMiddleware
    }
    const result = await authService.registerUser(req.body);
    return success(res, result, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors;
    }
    const result = await authService.loginUser(req.body);
    return success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.userId);
    return success(res, user, 'Current user retrieved');
  } catch (err) {
    next(err);
  }
};
