const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the request headers contain an authorization token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Get token from header (it comes in the format "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user by the ID from the token's payload
      //    We attach the user object to the request, excluding the password
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Move on to the next function (the actual route controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };