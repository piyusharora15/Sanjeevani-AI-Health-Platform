const mongoose = require('mongoose');

// This is an asynchronous function to connect to the database
const connectDB = async () => {
  try {
    // We use mongoose.connect() to establish a connection.
    // It takes the MongoDB URI from our environment variables.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, we log a message to the console.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error connecting, we log the error and exit the process.
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

// We export the connectDB function to be used in our main server.js file
module.exports = connectDB;