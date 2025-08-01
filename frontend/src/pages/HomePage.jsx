import React from "react";
import { Stethoscope, ShieldCheck, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from '../assets/images/hero_img.png';
const avatar1 = 'https://placehold.co/40x40/E2E8F0/4A5568?text=U1';
const avatar2 = 'https://placehold.co/40x40/CBD5E0/4A5568?text=U2';
const avatar3 = 'https://placehold.co/40x40/A0AEC0/4A5568?text=U3';

const HomePage = () => {
  // Now HomePage only contains the main content, not the header or footer.
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="relative bg-gradient-to-br from-white to-blue-50 overflow-hidden">
        {/* Abstract Blob Shapes */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse animation-delay-2000"></div>

        <div className="relative z-10 container mx-auto px-6 py-20 md:py-24">
          <div className="flex flex-col md:flex-row items-center">

            {/* Left Column: Text Content */}
            <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0 animate-slideInLeft [animation-delay:0.2s]">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-4">
                Your Health,
                <br />
                <span className="text-blue-500">Our Priority.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
                Get instant medical guidance, book doctor appointments based on your location and language preference and access emergency contacts, all in one place.
              </p>
              
              {/* CTA Button */}
              <div className="flex flex-col items-center md:items-start">
                <Link to="/assistant" className="bg-blue-500 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-600 transition duration-300 inline-block shadow-lg transform hover:scale-105 mb-6">
                  Talk to Medical Assistant
                </Link>

                {/* Social Proof */}
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={avatar1} alt="User 1" />
                    <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={avatar2} alt="User 2" />
                    <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={avatar3} alt="User 3" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500 font-medium">
                    Trusted by <span className="font-bold text-gray-700">10,000+</span> users
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="md:w-1/2 flex justify-center md:justify-end animate-slideInUp">
              <img 
                src={heroImage} 
                alt="Doctor attending to a child patient" 
                className="rounded-xl shadow-2xl w-full max-w-md" 
              />
            </div>

          </div>
          
          {/* Key Features Bar */}
          <div className="mt-20 md:mt-24 flex flex-col md:flex-row justify-around items-center text-center gap-8 animate-slideInUp [animation-delay:0.4s]">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-500" />
              <span className="font-semibold text-gray-700">24/7 AI Support</span>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-blue-500" />
              <span className="font-semibold text-gray-700">Verified Doctors</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
              <span className="font-semibold text-gray-700">Secure & Private</span>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Your journey to better health is just a few clicks away.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="text-center max-w-xs">
              <div className="bg-blue-400 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Describe Your Symptoms</h3>
              <p className="text-gray-600">
                Use our AI assistant to explain your health concerns in your
                preferred language.
              </p>
            </div>
            <div className="text-center max-w-xs">
              <div className="bg-blue-400 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Get Instant Advice</h3>
              <p className="text-gray-600">
                Receive immediate suggestions for home care or guidance to see a
                specialist.
              </p>
            </div>
            <div className="text-center max-w-xs">
              <div className="bg-blue-400 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Book an Appointment</h3>
              <p className="text-gray-600">
                If needed, seamlessly book a consultation with a verified doctor
                at your convenience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
