const getUserProfile = async (req, res) => {
  // Because our `protect` middleware ran first, the user object is already attached to the request (req.user)
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getUserProfile };