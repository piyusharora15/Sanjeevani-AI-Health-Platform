const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    // Link to the patient who booked the appointment
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Link to the doctor the appointment is with
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
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
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    // Unique ID used to generate the private Jitsi Meet and Socket.io room
    videoCallRoomId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);