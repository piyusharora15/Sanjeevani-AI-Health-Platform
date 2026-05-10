/**
 * @desc    Generic middleware to authorize specific roles
 * @param   {...string} roles - The roles allowed to access the route
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // 1. Check if user exists (should be attached by 'protect' middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    // 2. Check if user's role is included in the allowed roles
    if (roles.includes(req.user.role)) {
      next(); // User has the right role, proceed
    } else {
      res.status(403).json({ 
        message: `Role (${req.user.role}) is not authorized to access this resource` 
      });
    }
  };
};

/**
 * @desc    Specific middleware for Admin only (Convenience wrapper)
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};