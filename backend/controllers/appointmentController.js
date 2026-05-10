import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';
import { User } from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments
 * @access  Private (Patient)
 */
const bookAppointment = async (req, res) => {
  const patientId = req.user._id;

  const {
    doctorId, // This is the ID of the Doctor Profile
    appointmentDate,
    appointmentTime,
  } = req.body;

  // 1. Validation: Ensure all fields are present
  if (!doctorId || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ message: 'Please provide all required appointment details.' });
  }

  try {
    // 2. Business Logic: Check for double booking
    // This is a critical interview point: Ensuring the doctor isn't already busy
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: 'Cancelled' } // Don't count cancelled appointments
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: 'This doctor is already booked for the selected time slot. Please choose another time.' 
      });
    }

    // 3. Verification: Find the doctor's profile
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // 4. Creation: Create the new appointment
    // Note: In a production app, status would be 'Pending' until payment is verified.
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      consultationFee: doctor.consultationFee,
      status: 'Confirmed', 
      paymentStatus: 'Paid', 
      videoCallRoomId: uuidv4(), // Unique ID for Jitsi/Socket.io rooms
    });

    res.status(201).json(appointment);

  } catch (error) {
    console.error('Error in bookAppointment:', error.message);
    res.status(500).json({ message: 'Failed to book appointment. Please try again later.' });
  }
};

/**
 * @desc    Get all appointments for the logged-in patient
 * @route   GET /api/appointments/mypatient
 * @access  Private (Patient)
 */
const getMyBookingsAsPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({
        path: 'doctor',
        select: 'specialty location consultationFee',
        populate: {
          path: 'user',
          select: 'name email', // Get doctor's name from User model
        },
      })
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error in getMyBookingsAsPatient:', error.message);
    res.status(500).json({ message: 'Server Error: Could not fetch your bookings.' });
  }
};

/**
 * @desc    Get all appointments for the logged-in doctor
 * @route   GET /api/appointments/mydoctor
 * @access  Private (Doctor)
 */
const getMyBookingsAsDoctor = async (req, res) => {
  try {
    // 1. Find the doctor profile associated with the logged-in user account
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found for this account.' });
    }

    // 2. Fetch appointments linked to that profile
    const appointments = await Appointment.find({ doctor: doctorProfile._id })
      .populate('patient', 'name email') // Get patient details
      .sort({ appointmentDate: 1, appointmentTime: 1 }); // Sort chronologically

    res.json(appointments);
  } catch (error) {
    console.error('Error in getMyBookingsAsDoctor:', error.message);
    res.status(500).json({ message: 'Server Error: Could not fetch doctor schedules.' });
  }
};

export {
  bookAppointment,
  getMyBookingsAsPatient,
  getMyBookingsAsDoctor,
};