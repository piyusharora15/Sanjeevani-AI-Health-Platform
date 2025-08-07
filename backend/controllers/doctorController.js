const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Create or update a doctor's profile
// @route   POST /api/doctors/profile
// @access  Private (Doctors only)
const createOrUpdateDoctorProfile = async (req, res) => {
  // The user's info (including their ID and role) is attached to the request by our `protect` middleware
  const loggedInUser = req.user;

  // 1. Check if the logged-in user is a doctor
  if (loggedInUser.role !== 'doctor') {
    return res.status(403).json({ message: 'Forbidden: Only users with the doctor role can create a profile.' });
  }

  const {
    specialty,
    qualifications,
    experience,
    consultationFee,
    location,
    languages,
    bio,
  } = req.body;

  // 2. Basic validation for required fields
  if (!specialty || !qualifications || !experience || !consultationFee || !location || !languages) {
    return res.status(400).json({ message: 'Please provide all required profile fields.' });
  }

  try {
    // 3. Check if a profile already exists for this user
    let doctorProfile = await Doctor.findOne({ user: loggedInUser._id });

    if (doctorProfile) {
      // If profile exists, update it
      console.log('[Backend] Doctor profile found. Updating...');
      doctorProfile.specialty = specialty;
      doctorProfile.qualifications = qualifications;
      doctorProfile.experience = experience;
      doctorProfile.consultationFee = consultationFee;
      doctorProfile.location = location;
      doctorProfile.languages = languages;
      doctorProfile.bio = bio;
      
      const updatedProfile = await doctorProfile.save();
      return res.json(updatedProfile);
    } else {
      // If profile does not exist, create a new one
      console.log('[Backend] No doctor profile found. Creating new one...');
      doctorProfile = new Doctor({
        user: loggedInUser._id,
        specialty,
        qualifications,
        experience,
        consultationFee,
        location,
        languages,
        bio,
      });

      const newProfile = await doctorProfile.save();
      return res.status(201).json(newProfile);
    }
  } catch (error) {
    console.error('Error in createOrUpdateDoctorProfile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// --- NEW: Get all doctor profiles ---
// @desc    Get all doctor profiles
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    // Find all documents in the Doctor collection
    // .populate('user', ['name', 'email']) will fetch the corresponding user document
    // and include only the 'name' and 'email' fields.
    const doctors = await Doctor.find({}).populate('user', ['name', 'email']);
    
    res.json(doctors);
  } catch (error) {
    console.error('Error in getAllDoctors:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createOrUpdateDoctorProfile,
  getAllDoctors,
};