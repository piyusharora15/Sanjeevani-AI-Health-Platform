import { Doctor } from "../models/Doctor.js";
import { User } from "../models/User.js";

/**
 * @desc    Get all doctor profiles for admin view
 * @route   GET /api/admin/doctors
 * @access  Private (Admin only)
 */
export const getAllDoctorsForAdmin = async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .populate("user", ["name", "email", "createdAt"])
      .sort({ isVerified: 1, createdAt: -1 }); // pending first
    
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error in getAllDoctorsForAdmin:", error);
    res.status(500).json({ message: "Server Error: Could not fetch doctor list." });
  }
};

/**
 * @desc    Verify a doctor's profile
 * @route   PUT /api/admin/doctors/:id/verify
 * @access  Private (Admin only)
 */
export const verifyDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    doctor.isVerified = true;
    const updatedDoctor = await doctor.save();
    
    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error("Error in verifyDoctor:", error);
    res.status(500).json({ message: "Server Error: Verification failed." });
  }
};