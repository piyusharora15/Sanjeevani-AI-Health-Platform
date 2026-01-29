const mongoose = require('mongoose');

/**
 * Asynchronous function to establish a connection to MongoDB.
 * Uses the MONGO_URI from the environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Logs the host name to confirm a successful connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Logs the specific error and terminates the process on failure
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;