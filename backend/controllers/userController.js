const user = require('../models/User');
// @desc    Get current user's profile
// @route   GET /api/users/profile/me
// @access  Private
const getMyUserProfile = async (req, res) => {
  // The `protect` middleware already found the user and attached it to req.user
  // We don't need to find them again. Just send back the data.
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getMyUserProfile };