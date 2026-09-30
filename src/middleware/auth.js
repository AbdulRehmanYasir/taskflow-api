const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Protects routes: expects "Authorization: Bearer <token>"
exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Not authorized: token missing', 401);
  }

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // errors handled in error middleware

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('Not authorized: user no longer exists', 401);

  req.user = user;
  next();
});
