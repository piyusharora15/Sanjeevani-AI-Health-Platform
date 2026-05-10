import { User } from '../models/User.js';

/**
 * @desc    Get current user's profile
 * @route   GET /api/users/profile/me
 * @access  Private
 */
const getMyUserProfile = async (req, res) => {
  // The `protect` middleware already verified the JWT, fetched the user 
  // from the database, and attached it to the `req.user` object.
  
  if (req.user) {
    // We send back a structured object, ensuring sensitive fields 
    // like the hashed password are never exposed to the frontend.
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    });
  } else {
    // This case is unlikely if the 'protect' middleware is working correctly,
    // but serves as a defensive programming fallback.
    res.status(404).json({ message: 'User profile not found.' });
  }
};

export { getMyUserProfile };