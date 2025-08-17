Sanjeevani - AI-Powered Healthcare Assistant
Sanjeevani is an intelligent, full-stack MERN healthcare platform designed to bridge the communication gap in healthcare, especially in diverse linguistic regions. It provides users with an AI-powered assistant for initial triage, a seamless doctor booking system, and advanced tools to understand their medical documents.

Live Demo
sanjeevani-health-app.netlify.app

The Problem Sanjeevani Solves
In many regions, especially rural areas, access to immediate and understandable medical guidance is a significant challenge. Key problems include:

The Accessibility Barrier: Digital and health literacy can prevent people from seeking help.

The Language Gap: A majority of health apps are English-based, excluding a large portion of the population.

Post-Consultation Confusion: Patients often struggle to understand complex prescriptions and lab reports, leading to poor medication adherence and anxiety.

Sanjeevani tackles these issues head-on by providing an accessible, intuitive, and empowering healthcare companion.

Key Features
Conversational AI Medical Assistant:

Engages in natural, multi-turn conversations to understand user symptoms.

Provides safe, preliminary guidance for minor issues or recommends seeing a doctor for serious conditions.

Features conversational memory to ask relevant follow-up questions.

Multi-Lingual Voice Support :

Users can interact with the AI assistant using voice commands in multiple Indian languages (Hindi, Bengali, Tamil, etc.).

The AI responds in the user's chosen language, both in text and with a spoken voice, making it highly accessible.

AI-Powered Document Analyzer:

Users can upload an image of a prescription or lab report.

The backend uses Google's Gemini Vision model to perform OCR and extract text.

The AI provides a simplified, easy-to-understand explanation of the medical document.

End-to-End Doctor Booking System:

Patients can search for doctors and filter them by specialty, location, and language.

Seamless appointment booking with an integrated Razorpay payment gateway for consultation fees.

Real-time Communication:

After booking, patients and doctors can communicate via a private, real-time chat room powered by Socket.io.

A secure Jitsi Meet video call link is generated for each appointment.

Role-Based Authentication & Dashboards:

Secure JWT-based authentication for Patients, Doctors, and Admins.

Patient Dashboard: View upcoming and past appointments.

Doctor Dashboard: View schedule, manage profile, and communicate with patients.

Admin Panel: A secure dashboard for the admin to view all registered doctors and verify their profiles, making them visible to the public.

Tech Stack
This project is a full-stack MERN application built with a modern and scalable architecture.

Category

Technology

Frontend

React.js, Vite, Tailwind CSS, React Router

Backend

Node.js, Express.js

Database

MongoDB (with Mongoose)

Authentication

JSON Web Tokens (JWT), bcrypt

Real-time

Socket.io

AI / Machine Learning

Google Gemini API (Vision & Language Models)

Payments

Razorpay API

Deployment

Backend on Render, Frontend on Netlify

Local Setup & Installation
To run this project on your local machine, follow these steps:

Prerequisites:

Node.js installed

MongoDB Atlas account (or local MongoDB instance)

Postman or a similar API testing tool (for creating the admin account)

1. Clone the repository:

git clone https://github.com/your-username/sanjeevani-mern-project.git
cd sanjeevani-mern-project

2. Backend Setup:

cd sanjeevani-server
npm install

Create a .env file in the sanjeevani-server root and add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
ADMIN_REGISTRATION_SECRET=your_admin_secret_key

Run the server:

npm start

3. Frontend Setup:

cd sanjeevani-client
npm install

Create a .env file in the sanjeevani-client root and add the following variable:

VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id

Run the client:

npm run dev

Your application should now be running locally, with the frontend on http://localhost:5173 and the backend on http://localhost:5000.
