const jwt = require('jsonwebtoken');
const config = require('../config');

exports.generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
