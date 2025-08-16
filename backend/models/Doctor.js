const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  // Link this doctor profile to a user account
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This creates a reference to the User model
    unique: true, // Each user can only have one doctor profile
  },
  specialty: {
    type: String,
    required: [true, 'Please provide your medical specialty'],
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false, // All new doctors are unverified by default
  },
  qualifications: [
    {
      degree: { type: String, required: true },
      university: { type: String, required: true },
      year: { type: Number, required: true },
    },
  ],
  experience: {
    type: Number, // Years of experience
    required: [true, 'Please provide your years of experience'],
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please provide your consultation fee'],
  },
  location: {
    type: String,
    required: [true, 'Please provide your clinic location or city'],
  },
  languages: [
    {
      type: String,
      required: true,
    },
  ],
  bio: {
    type: String,
    maxlength: 500,
    default: 'A dedicated healthcare professional.',
  },
  // We can add more complex fields later, like availability slots
  // availability: { ... } 
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;