const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// --- Utility function to generate a JWT ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

// --- Register a new user ---
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log('[Backend] Request body:', req.body);

    if (!name || !email || !password) {
      console.log('[Backend] Validation failed: Missing fields.');
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('[Backend] User already exists.');
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    console.log('[Backend] Creating new user...');
    const user = await User.create({ name, email, password, role });

    if (user) {
      console.log('[Backend] User created successfully. Sending response.');
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  };

// --- Authenticate a user (Login) ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[Backend] Attempting login for email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('[Backend] User not found.');
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log('[Backend] User found. Checking password...');

    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      console.log('[Backend] Password matched. Sending success response.');
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      console.log('[Backend] Password did not match.');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[Backend] CRITICAL ERROR in loginUser:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- Forgot Password Controller ---
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log('[Backend] Forgot Password: User not found, but sending success response for security.');
      return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    console.log('[Backend] Forgot Password: User found. Generating token.');
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    console.log('--- PASSWORD RESET LINK (FOR TESTING) ---');
    console.log(resetUrl);
    console.log('-----------------------------------------');

    res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('[Backend] CRITICAL ERROR in forgotPassword:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- Reset Password Controller ---
const resetPassword = async (req, res) => {
  console.log(`[Backend] Received request for /reset-password with token: ${req.params.token}`);
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.log('[Backend] Reset Password: Invalid or expired token.');
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    console.log('[Backend] Reset Password: Token is valid. Setting new password.');
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log('[Backend] Reset Password: Password updated successfully.');
    res.status(200).json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('[Backend] CRITICAL ERROR in resetPassword:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- NEW: Secret Admin Registration ---
// @desc    Register a new admin user via a secret route
// @route   POST /api/auth/register-admin
// @access  Private (requires secret key)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    // 1. Check if the provided secret key matches the one in our .env file
    if (secretKey !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(401).json({ message: 'Not authorized to create an admin account.' });
    }

    // 2. Proceed with registration logic (similar to registerUser)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin', // Set the role explicitly to 'admin'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerAdmin:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  registerAdmin,
};