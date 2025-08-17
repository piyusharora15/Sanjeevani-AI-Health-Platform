import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Stethoscope, ShieldCheck, MessageSquare, Phone, HeartPulse, Star } from 'lucide-react';
import heroImage from '../assets/images/hero_img.png';
import useScrollAnimation from '../hooks/useScrollAnimation';

// Dummy avatar images
const avatar1 = 'https://placehold.co/40x40/E2E8F0/4A5568?text=P';
const avatar2 = 'https://placehold.co/40x40/CBD5E0/4A5568?text=S';
const avatar3 = 'https://placehold.co/40x40/A0AEC0/4A5568?text=R';

const HomePage = () => {
  // Use the custom hook for each section
  const featuresSection = useScrollAnimation('animate-slideInUp');
  const howItWorksSection = useScrollAnimation('animate-slideInUp');
  const testimonialsSection = useScrollAnimation('animate-slideInUp');
  const ctaSection = useScrollAnimation('animate-zoomIn');

  return (
    <div className="bg-slate-50 text-gray-800">
      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative bg-gradient-to-br from-white to-slate-100 overflow-hidden">
         <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse animation-delay-2000"></div>
        <div className="relative z-10 container mx-auto px-6 py-20 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0 animate-slideInLeft [animation-delay:0.2s]">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-4">Your Health, <br /><span className="text-blue-600">Our Priority.</span></h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">Get instant medical guidance, book doctor appointments based on your location and language preference, and get analysis of medical documents, all in one place.</p>
              <div className="flex flex-col items-center md:items-start">
                <Link to="/assistant" className="bg-blue-500 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-600 transition duration-300 inline-block shadow-lg transform hover:scale-105 mb-6">Talk to Medical Assistant</Link>
                <div className="flex items-center"><div className="flex -space-x-2"><img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={avatar1} alt="User 1" /><img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={avatar2} alt="User 2" /><img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={avatar3} alt="User 3" /></div><p className="ml-3 text-sm text-gray-500 font-medium">Trusted by <span className="font-bold text-gray-700">10,000+</span> users</p></div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end animate-slideInUp"><img src={heroImage} alt="Doctor attending to a child patient" className="rounded-xl shadow-2xl w-full max-w-md" /></div>
          </div>
          <div className="mt-20 md:mt-24 flex flex-col md:flex-row justify-around items-center text-center gap-8 animate-slideInUp [animation-delay:0.4s]">
            <div className="flex items-center gap-3"><Bot className="w-8 h-8 text-blue-500" /><span className="font-semibold text-gray-700">24/7 AI Support</span></div>
            <div className="flex items-center gap-3"><Stethoscope className="w-8 h-8 text-blue-500" /><span className="font-semibold text-gray-700">Verified Doctors</span></div>
            <div className="flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-blue-500" /><span className="font-semibold text-gray-700">Secure & Private</span></div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className={`py-20 bg-white ${featuresSection.className}`} ref={featuresSection.ref}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">A Better Way to Manage Your Health</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Sanjeevani isn't just an app; it's your personal health command center.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6"><MessageSquare size={32} /></div>
              <h3 className="text-xl font-bold mb-3">AI Medical Assistant</h3>
              <p className="text-gray-600">Analyze symptoms and get instant, safe guidance in your own language, 24/7.</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6"><Stethoscope size={32} /></div>
              <h3 className="text-xl font-bold mb-3">Expert Doctor Booking</h3>
              <p className="text-gray-600">Find and book appointments with verified specialists near you, hassle-free.</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6"><Phone size={32} /></div>
              <h3 className="text-xl font-bold mb-3">Document Analysis</h3>
              <p className="text-gray-600">Upload medical documents for quick analysis and insights.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" className={`py-20 bg-slate-50 ${howItWorksSection.className}`} ref={howItWorksSection.ref}>
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Get Started in 3 Simple Steps</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Your journey to better health is just a few clicks away.</p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200"></div>
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center bg-white p-8 rounded-xl shadow-md z-10">
                  <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4 ring-8 ring-slate-50">1</div>
                  <h3 className="text-xl font-bold mb-2">Describe Symptoms</h3>
                  <p className="text-gray-600">Use our AI assistant to explain your health concerns via text or voice.</p>
                </div>
                <div className="text-center bg-white p-8 rounded-xl shadow-md z-10">
                  <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4 ring-8 ring-slate-50">2</div>
                  <h3 className="text-xl font-bold mb-2">Get Instant Advice</h3>
                  <p className="text-gray-600">Receive immediate suggestions for home care or guidance to see a specialist.</p>
                </div>
                <div className="text-center bg-white p-8 rounded-xl shadow-md z-10">
                  <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4 ring-8 ring-slate-50">3</div>
                  <h3 className="text-xl font-bold mb-2">Book Appointment</h3>
                  <p className="text-gray-600">Seamlessly book a consultation with a verified doctor at your convenience.</p>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* --- NEW TESTIMONIALS SECTION (FIXED) --- */}
      <section id="testimonials" className={`py-20 bg-white ${testimonialsSection.className}`} ref={testimonialsSection.ref}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Loved by Patients Everywhere</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Don't just take our word for it. Here's what people are saying about Sanjeevani.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
              <div className="flex items-center mb-4"><div className="flex text-yellow-500"><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /></div></div>
              <p className="text-gray-700 mb-6">"The AI assistant is a lifesaver! I got quick advice for my son's fever in the middle of the night. So reassuring!"</p>
              <div className="flex items-center"><img className="h-12 w-12 rounded-full" src="https://placehold.co/100x100/E2E8F0/4A5568?text=A" alt="Anjali K." /><div className="ml-4"><p className="font-bold">Anjali K.</p><p className="text-sm text-gray-500">Patient</p></div></div>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
              <div className="flex items-center mb-4"><div className="flex text-yellow-500"><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /></div></div>
              <p className="text-gray-700 mb-6">"Booking an appointment was so easy. I found a cardiologist near me who speaks my language. Highly recommended."</p>
              <div className="flex items-center"><img className="h-12 w-12 rounded-full" src="https://placehold.co/100x100/CBD5E0/4A5568?text=R" alt="Ravi S." /><div className="ml-4"><p className="font-bold">Ravi S.</p><p className="text-sm text-gray-500">Patient</p></div></div>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
              <div className="flex items-center mb-4"><div className="flex text-yellow-500"><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /></div></div>
              <p className="text-gray-700 mb-6">"As a doctor, this platform helps me manage my schedule efficiently. The interface is clean and very professional."</p>
              <div className="flex items-center"><img className="h-12 w-12 rounded-full" src="https://placehold.co/100x100/A0AEC0/4A5568?text=D" alt="Dr. Mehra" /><div className="ml-4"><p className="font-bold">Dr. Mehra</p><p className="text-sm text-gray-500">Cardiologist</p></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW CALL TO ACTION SECTION (FIXED) --- */}
      <section className={`py-20 bg-slate-50 ${ctaSection.className}`} ref={ctaSection.ref}>
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 text-white rounded-2xl shadow-xl p-12 text-center">
            <HeartPulse size={48} className="mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
            <p className="max-w-xl mx-auto mb-8">Join thousands of users who trust Sanjeevani for quick, reliable, and accessible healthcare.</p>
            <Link to="/signup" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-slate-100 transition duration-300 inline-block text-lg transform hover:scale-105">
              Sign Up for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;