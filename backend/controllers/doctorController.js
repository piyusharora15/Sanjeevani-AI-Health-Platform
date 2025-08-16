const Doctor = require("../models/Doctor");
const User = require("../models/User");

// @desc    Create or update a doctor's profile
// @route   POST /api/doctors/profile
// @access  Private (Doctors only)
const createOrUpdateDoctorProfile = async (req, res) => {
  // The user's info (including their ID and role) is attached to the request by our `protect` middleware
  const loggedInUser = req.user;

  // 1. Check if the logged-in user is a doctor
  if (loggedInUser.role !== "doctor") {
    return res
      .status(403)
      .json({
        message:
          "Forbidden: Only users with the doctor role can create a profile.",
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
    !qualifications ||
    !experience ||
    !consultationFee ||
    !location ||
    !languages
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required profile fields." });
  }

  try {
    // 3. Check if a profile already exists for this user
    let doctorProfile = await Doctor.findOne({ user: loggedInUser._id });

    if (doctorProfile) {
      // If profile exists, update it
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
      // If profile does not exist, create a new one
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
      });

      const newProfile = await doctorProfile.save();
      return res.status(201).json(newProfile);
    }
  } catch (error) {
    console.error("Error in createOrUpdateDoctorProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// --- NEW: Get all doctor profiles ---
// @desc    Get all doctor profiles
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    // 1. Get the query parameters from the request URL (e.g., /api/doctors?location=Kolkata)
    const { search, location, language } = req.query;

    // 2. Build a dynamic query object
    const query = {};

    if (location) {
      // Use $regex for a case-insensitive partial match (e.g., "kol" matches "Kolkata")
      query.location = { $regex: location, $options: "i" };
    }
    if (language) {
      // Search for the language within the 'languages' array
      query.languages = { $regex: language, $options: "i" };
    }
    query.isVerified = true;
    // 3. Find doctors based on the constructed query
    let doctors = await Doctor.find(query).populate("user", ["name", "email"]);

    // 4. If a search term is provided, filter the results further
    // We do this after populating because 'name' and 'specialty' are in different collections
    if (search) {
      doctors = doctors.filter((doctor) => {
        // First, check if doctor.user exists. If it doesn't, this part of the condition will be false, preventing a crash.
        const nameMatch =
          doctor.user &&
          doctor.user.name.toLowerCase().includes(search.toLowerCase());
        const specialtyMatch = doctor.specialty
          .toLowerCase()
          .includes(search.toLowerCase());
        return nameMatch || specialtyMatch;
      });
    }
    res.json(doctors);
  } catch (error) {
    console.error("Error in getAllDoctors:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- Get the profile for the currently logged-in doctor ---
// @desc    Get current doctor's profile
// @route   GET /api/doctors/profile/me
// @access  Private (Doctors only)
const getMyDoctorProfile = async (req, res) => {
  try {
    // Find the doctor profile that is linked to the logged-in user's ID
    const profile = await Doctor.findOne({ user: req.user._id }).populate(
      "user",
      ["name", "email"]
    );

    if (!profile) {
      // This is not an error, it's expected for new doctors.
      // We send a 404 so the frontend knows the profile doesn't exist.
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
