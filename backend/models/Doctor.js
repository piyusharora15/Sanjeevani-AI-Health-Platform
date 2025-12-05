// backend/models/Doctor.js
const mongoose = require("mongoose");

const qualificationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  university: { type: String, required: true },
  year: { type: Number, required: true },
});

const doctorSchema = new mongoose.Schema(
  {
    // Link this doctor profile to a user account
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true, // Each user can only have one doctor profile
    },

    specialty: {
      type: String,
      required: [true, "Please provide your medical specialty"],
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false, // All new doctors are unverified by default
    },

    qualifications: [qualificationSchema],

    experience: {
      type: Number, // Years of experience
      required: [true, "Please provide your years of experience"],
    },

    consultationFee: {
      type: Number,
      required: [true, "Please provide your consultation fee"],
    },

    location: {
      type: String,
      required: [true, "Please provide your clinic location or city"],
      trim: true,
    },

    languages: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    bio: {
      type: String,
      maxlength: 500,
      default: "A dedicated healthcare professional.",
    },

    // For future: average rating etc.
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for search
doctorSchema.index({ isVerified: 1, location: 1, specialty: 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;