// backend/controllers/doctorController.js
const Doctor = require("../models/Doctor");
const User = require("../models/User");

// @desc    Create or update a doctor's profile
// @route   POST /api/doctors/profile
// @access  Private (Doctors only)
const createOrUpdateDoctorProfile = async (req, res) => {
  const loggedInUser = req.user;

  // 1. Check if the logged-in user is a doctor
  if (!loggedInUser || loggedInUser.role !== "doctor") {
    return res.status(403).json({
      message: "Forbidden: Only users with the doctor role can create a profile.",
    });
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
  if (
    !specialty ||
    !Array.isArray(qualifications) ||
    qualifications.length === 0 ||
    experience === undefined ||
    consultationFee === undefined ||
    !location ||
    !Array.isArray(languages) ||
    languages.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required profile fields." });
  }

  try {
    // 3. Check if a profile already exists for this user
    let doctorProfile = await Doctor.findOne({ user: loggedInUser._id });

    if (doctorProfile) {
      // Update existing profile – keep isVerified as is
      console.log("[Backend] Doctor profile found. Updating...");

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
      // Create new profile – start as unverified
      console.log("[Backend] No doctor profile found. Creating new one...");

      doctorProfile = new Doctor({
        user: loggedInUser._id,
        specialty,
        qualifications,
        experience,
        consultationFee,
        location,
        languages,
        bio,
        isVerified: false, // explicit for clarity
      });

      const newProfile = await doctorProfile.save();
      return res.status(201).json(newProfile);
    }
  } catch (error) {
    console.error("Error in createOrUpdateDoctorProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all doctor profiles (public, only verified)
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const { search, location, language } = req.query;

    // Only show verified doctors to patients
    const query = { isVerified: true };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (language) {
      // languages is an array of strings
      query.languages = { $regex: language, $options: "i" };
    }

    // Find doctors with filters, then populate user info
    let doctors = await Doctor.find(query)
      .populate("user", ["name", "email"])
      .sort({ createdAt: -1 });

    // Further in-memory filter on search (name + specialty)
    if (search) {
      const lower = search.toLowerCase();
      doctors = doctors.filter((doctor) => {
        const nameMatch =
          doctor.user &&
          doctor.user.name.toLowerCase().includes(lower);
        const specialtyMatch = doctor.specialty
          .toLowerCase()
          .includes(lower);
        return nameMatch || specialtyMatch;
      });
    }

    res.json(doctors);
  } catch (error) {
    console.error("Error in getAllDoctors:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get current doctor's profile
// @route   GET /api/doctors/profile/me
// @access  Private (Doctors only)
const getMyDoctorProfile = async (req, res) => {
  try {
    const profile = await Doctor.findOne({ user: req.user._id }).populate(
      "user",
      ["name", "email"]
    );

    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found for this doctor." });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error in getMyDoctorProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createOrUpdateDoctorProfile,
  getAllDoctors,
  getMyDoctorProfile,
};