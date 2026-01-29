import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Load environment variables from .env file
dotenv.config();

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
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// --- Socket.io Setup ---
const io = new Server(server, { cors: corsOptions });
app.use(cors(corsOptions));

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (appointmentId) => {
    socket.join(appointmentId);
    console.log(`User ${socket.id} joined room: ${appointmentId}`);
  });

  socket.on("send_message", (data) => {
    // Send the message to everyone in that specific appointment room
    // Instead of socket.to(), we use io.to().
    // This sends the message to ALL clients in the room, including the sender.
    // This is a more reliable way to ensure everyone receives the message.
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) to allow our frontend to communicate with this backend
app.use(cors(corsOptions));
// Enable the express app to parse JSON formatted request bodies
app.use(express.json());

// --- Database Connection ---
// We will call the connectDB function to establish a connection to MongoDB
// (The function itself will be defined in another file)
connectDB();

// --- API Routes ---
// This is a simple test route to check if the server is running
app.get("/", (req, res) => {
  res.send("Sanjeevani API is running...");
});
app.use("/api/auth", (await import("./routes/authRoutes.js")).default);
app.use("/api/users", (await import("./routes/userRoutes.js")).default);
app.use(
  "/api/assistant",
  (await import("./routes/assistantRoutes.js")).default,
);
app.use("/api/doctors", (await import("./routes/doctorRoutes.js")).default);
app.use(
  "/api/appointments",
  (await import("./routes/appointmentRoutes.js")).default,
);
app.use("/api/payment", (await import("./routes/paymentRoutes.js")).default);
app.use("/api/analysis", (await import("./routes/analysisRoutes.js")).default);
app.use("/api/admin", (await import("./routes/adminRoutes.js")).default);

// --- Deployment Configuration ---

app.get("/", (req, res) => res.send("Sanjeevani API is running..."));

// --- Server Initialization ---
// Define the port the server will run on.
// It will use the port from the .env file, or default to 5000
const PORT = process.env.PORT || 5000;

// We explicitly tell the server to listen on host '0.0.0.0'.
// This makes it accessible from outside the Render container.
server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});