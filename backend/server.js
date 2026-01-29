const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// We define a list of allowed origins (websites).
const allowedOrigins = [
  "http://localhost:5173", // My local frontend
  "https://sanjeevani-health-app.netlify.app", // Live frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// --- Socket.io Setup ---
const io = new Server(server, { cors: corsOptions });

// Apply Middleware
app.use(cors(corsOptions));
app.use(express.json());

// --- Socket Logic ---
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (appointmentId) => {
    socket.join(appointmentId);
    console.log(`User ${socket.id} joined room: ${appointmentId}`);
  });

  socket.on("send_message", (data) => {
    // Send to everyone in the room including sender for sync
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// --- API Routes ---
app.get("/", (req, res) => {
  res.send("Sanjeevani API is running...");
});

// Use standard require for routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/assistant", require("./routes/assistantRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/analysis", require("./routes/analysisRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});