const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    // --- FIELDS FOR PASSWORD RESET ---
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// --- Pre-save hook for password hashing ---
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Method for password matching ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- Method: Generate and hash password reset token ---
userSchema.methods.getResetPasswordToken = function () {
  // 1. Generate a random plain-text token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // 2. Hash the token to save in DB (Security measure)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3. Set expiry (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // 4. Return the UN-HASHED token to send via email
  return resetToken;
};

// --- Export the Model ---
module.exports = mongoose.model("User", userSchema);