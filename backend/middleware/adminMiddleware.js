// This middleware checks if the logged-in user has the 'admin' role.
// It should be used AFTER the 'protect' middleware.
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // If user is an admin, proceed to the next function
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
  }
};

module.exports = { admin };