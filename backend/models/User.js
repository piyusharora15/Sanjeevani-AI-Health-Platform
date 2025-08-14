const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Import crypto for token generation

const userSchema = new mongoose.Schema({
  // ... existing fields (name, email, password, role)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },

  // --- NEW FIELDS FOR PASSWORD RESET ---
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

// --- Existing pre-save hook for password hashing ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Existing method for password matching ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- NEW METHOD: Generate and hash password reset token ---
userSchema.methods.getResetPasswordToken = function () {
  // 1. Generate a random token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Hash the token and set it to the resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Set the expiry time (e.g., 10 minutes from now)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

  // 4. Return the un-hashed token (this is what we send in the email/link)
  return resetToken;
};


const User = mongoose.model('User', userSchema);
module.exports = User;