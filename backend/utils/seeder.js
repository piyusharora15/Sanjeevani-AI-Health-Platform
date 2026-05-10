import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs'; 
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Load models
const User = import('../models/User');
const Doctor = import('../models/Doctor');

// Load JSON data
const doctorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'doctors.json'), 'utf-8')
);

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Import data into DB
const importData = async () => {
  try {
    console.log('Starting data import...');

    // Clear existing data first to avoid duplicates
    await User.deleteMany({ role: 'doctor' });
    await Doctor.deleteMany();
    console.log('Cleared existing doctor data.');

    for (const docData of doctorsData) {
      // 1. Create the User document for the doctor
      const doctorUser = await User.create({
        name: docData.name,
        email: docData.email,
        password: docData.password, // Password will be hashed by the pre-save hook
        role: 'doctor',
      });

      // 2. Create the Doctor profile document, linking it to the new User ID
      await Doctor.create({
        user: doctorUser._id,
        specialty: docData.specialty,
        qualifications: docData.qualifications,
        experience: docData.experience,
        consultationFee: docData.consultationFee,
        location: docData.location,
        languages: docData.languages,
        bio: docData.bio,
        isVerified: docData.isVerified,
      });

      console.log(`Imported: ${docData.name}`);
    }

    console.log('Data Import Complete!');
    process.exit();
  } catch (error) {
    console.error('Error during data import:', error);
    process.exit(1);
  }
};

// Run the seeder
importData();