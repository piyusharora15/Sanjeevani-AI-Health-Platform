const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctor profiles for admin view
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
const getAllDoctorsForAdmin = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).populate('user', ['name', 'email', 'createdAt']);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify a doctor's profile
// @route   PUT /api/admin/doctors/:id/verify
// @access  Private (Admin only)
const verifyDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
      doctor.isVerified = true;
      const updatedDoctor = await doctor.save();
      res.json(updatedDoctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllDoctorsForAdmin,
  verifyDoctor,
};