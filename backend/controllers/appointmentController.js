const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patients only)
const bookAppointment = async (req, res) => {
  const patientId = req.user._id; // Get the logged-in patient's ID from the protect middleware

  const {
    doctorId, // This will be the ID of the Doctor's PROFILE, not the user ID
    appointmentDate,
    appointmentTime,
  } = req.body;

  // 1. Basic validation
  if (!doctorId || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ message: 'Please provide all required appointment details.' });
  }

  try {
    // 2. Find the doctor's profile to get their details, like consultation fee
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // 3. Create the new appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      consultationFee: doctor.consultationFee, // Get fee from the doctor's profile
      status: 'Confirmed', // Default status
      paymentStatus: 'Paid', // Default status
      videoCallRoomId: uuidv4(), // Generate a unique ID for the video call room  
    });

    // 4. Send back the created appointment details
    res.status(201).json(appointment);

  } catch (error) {
    console.error('Error in bookAppointment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all appointments for a patient
// @route   GET /api/appointments/mypatient
// @access  Private (Patients)
const getMyBookingsAsPatient = async (req, res) => {
  try {
    // Find all appointments where the 'patient' field matches the logged-in user's ID
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({
        path: 'doctor', // Populate the doctor field
        select: 'specialty location', // Select specific fields from the Doctor model
        populate: {
          path: 'user', // Nested populate to get the doctor's name from the User model
          select: 'name',
        },
      })
      .sort({ appointmentDate: -1 }); // Sort by most recent date

    res.json(appointments);
  } catch (error) {
    console.error('Error in getMyBookingsAsPatient:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all appointments for a doctor
// @route   GET /api/appointments/mydoctor
// @access  Private (Doctors)
const getMyBookingsAsDoctor = async (req, res) => {
  try {
    // 1. Find the doctor profile linked to the logged-in user
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found for this user.' });
    }

    // 2. Find all appointments where the 'doctor' field matches this doctor's profile ID
    const appointments = await Appointment.find({ doctor: doctorProfile._id })
      .populate('patient', ['name', 'email']) // Populate the patient's name and email
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error in getMyBookingsAsDoctor:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  bookAppointment,
  getMyBookingsAsPatient,
  getMyBookingsAsDoctor,
};

// This code defines the bookAppointment function which handles booking a new appointment. It performs the following steps:
// 1. Validates the input data to ensure all required fields are provided.
// 2. Retrieves the doctor's profile to get the consultation fee.
// 3. Creates a new appointment with the provided details, linking it to the patient and doctor.
// 4. Returns the created appointment details in the response.
// This function is exported for use in the appointment routes.
// The DoctorCard component is designed to display a doctor's information and allow users to book an appointment.