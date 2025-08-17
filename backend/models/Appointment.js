const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Link to the patient who booked the appointment
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // Link to the doctor the appointment is with
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Doctor',
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String, // e.g., "10:30 AM"
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  videoCallRoomId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;