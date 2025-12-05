// frontend/src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Stethoscope,
  ShieldCheck,
  MessageSquare,
  Phone,
  HeartPulse,
  Star,
  FileText,
  MessageCircle,
} from "lucide-react";
import heroImage from "../assets/images/hero_img.png";
import useScrollAnimation from "../hooks/useScrollAnimation";

// Dummy avatar images
const avatar1 = "https://placehold.co/40x40/E2E8F0/4A5568?text=P";
const avatar2 = "https://placehold.co/40x40/CBD5E0/4A5568?text=S";
const avatar3 = "https://placehold.co/40x40/A0AEC0/4A5568?text=R";

// Data-driven content for sections
const FEATURES = [
  {
    icon: MessageSquare,
    title: "AI Medical Assistant",
    tech: "Gemini 2.0 + custom safety layer",
    description:
      "Describe your symptoms in text or voice and get instant, safe guidance in your own language, 24/7.",
  },
  {
    icon: Stethoscope,
    title: "Doctor Discovery & Booking",
    tech: "MERN + location & language filters",
    description:
      "Find verified specialists based on location, language and specialty, then book appointments in a few clicks.",
  },
  {
    icon: FileText,
    title: "Medical Document Analyzer",
    tech: "Vision + text models",
    description:
      "Upload prescriptions or lab reports and get a simplified, patient-friendly explanation of the contents.",
  },
  {
    icon: MessageCircle,
    title: "Chat with Your Doctor",
    tech: "Socket.io real-time messaging",
    description:
      "Secure, real-time chat between patient and doctor for follow-ups and clarification before or after a visit.",
  },
  {
    icon: Phone,
    title: "Video Consultations",
    tech: "Jitsi Meet WebRTC",
    description:
      "Join encrypted video calls with doctors directly from your dashboard — optimized for low-bandwidth users.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Privacy-First",
    tech: "JWT auth + role-based access",
    description:
      "Patient data is protected with secure APIs, role-based routes and a clear separation of patient/doctor flows.",
  },
];

const STEPS = [
  {
    step: 1,
    title: "Describe Your Symptoms",
    description:
      "Use the AI assistant to explain what you’re feeling — in English or your preferred Indian language, via text or voice.",
    tech: "Gemini 2.0, Web Speech API",
  },
  {
    step: 2,
    title: "Get Instant Guidance",
    description:
      "Receive preliminary guidance, body-area highlights and triage level so you know how urgent your situation might be.",
    tech: "AI triage engine",
  },
  {
    step: 3,
    title: "Book, Chat & Call",
    description:
      "Book a verified doctor, chat in real-time, and hop on a secure video call — all inside Sanjeevani.",
    tech: "MERN, Socket.io, Jitsi",
  },
];

const TESTIMONIALS = [
  {
    name: "Anjali K.",
    role: "Parent • Patient",
    avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=A",
    context: "Late-night fever • Hindi",
    quote:
      "The AI assistant spoke in Hindi and guided me on what to monitor for my son’s fever till morning. It gave me the confidence to wait and then see our pediatrician.",
  },
  {
    name: "Ravi S.",
    role: "Working Professional",
    avatar: "https://placehold.co/100x100/CBD5E0/4A5568?text=R",
    context: "Cardiology consult • Kolkata",
    quote:
      "Booking a cardiologist who speaks Bengali and practices near my area was super easy. The reminders and chat made the whole experience smooth.",
  },
  {
    name: "Dr. Mehra",
    role: "Cardiologist",
    avatar: "https://placehold.co/100x100/A0AEC0/4A5568?text=D",
    context: "Doctor workflow",
    quote:
      "Sanjeevani helps me manage online appointments, chat and follow-ups in one place. The interface is clean and feels like a modern EMR-lite for Indian patients.",
  },
];

const HomePage = () => {
  const featuresSection = useScrollAnimation("animate-slideInUp");
  const howItWorksSection = useScrollAnimation("animate-slideInUp");
  const testimonialsSection = useScrollAnimation("animate-slideInUp");
  const ctaSection = useScrollAnimation("animate-zoomIn");

  return (
    <main className="bg-slate-50 text-gray-800">
      {/* --- HERO SECTION --- */}
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="relative bg-gradient-to-br from-white to-slate-100 overflow-hidden"
      >
        {/* background blobs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" />
        <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse animation-delay-2000" />

        <div className="relative z-10 container mx-auto px-6 py-20 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Left side: copy */}
            <div className="md:w-1/2 text-center md:text-left mb-4 md:mb-0 animate-slideInLeft [animation-delay:0.2s]">
              <p className="text-[11px] uppercase tracking-[0.25em] text-blue-600 font-semibold mb-3">
                AI-powered telemedicine • MERN • Gemini • Socket.io • Jitsi
              </p>

              <h1
                id="hero-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-4"
              >
                Your Health,
                <br />
                <span className="text-blue-600">Our Priority.</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
                Get AI symptom guidance, book language-matched doctors, chat,
                join video calls and analyze medical documents — all in one
                place designed for patients in India.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 items-center md:items-start">
                <Link
                  to="/assistant"
                  className="bg-blue-500 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-600 transition duration-300 inline-flex items-center justify-center shadow-lg transform hover:scale-105"
                >
                  Talk to Medical Assistant
                </Link>

                <Link
                  to="/signup"
                  className="border border-blue-500 text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition duration-300 inline-flex items-center justify-center"
                >
                  Explore as Patient
                </Link>
              </div>

              <div className="flex items-center justify-center md:justify-start mt-6">
                <div className="flex -space-x-2">
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                    src={avatar1}
                    alt="Patient avatar"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                    src={avatar2}
                    alt="Doctor avatar"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                    src={avatar3}
                    alt="Patient avatar"
                  />
                </div>
                <p className="ml-3 text-sm text-gray-500 font-medium">
                  Trusted by{" "}
                  <span className="font-bold text-gray-700">10,000+</span>{" "}
                  users across India
                </p>
              </div>
            </div>

            {/* Right side: hero image */}
            <div className="md:w-1/2 flex justify-center md:justify-end animate-slideInUp">
              <img
                src={heroImage}
                loading="lazy"
                alt="Doctor attending to a patient"
                className="rounded-xl shadow-2xl w-full max-w-md"
              />
            </div>
          </div>

          {/* quick trust badges */}
          <div className="mt-16 md:mt-20 flex flex-col md:flex-row justify-around items-center text-center gap-6 animate-slideInUp [animation-delay:0.4s]">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-500" />
              <span className="font-semibold text-gray-700">
                24/7 AI Symptom Support
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-blue-500" />
              <span className="font-semibold text-gray-700">
                Verified Indian Doctors
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
              <span className="font-semibold text-gray-700">
                Secure & Privacy-First
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className={`py-20 bg-white ${featuresSection.className}`}
        ref={featuresSection.ref}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold text-slate-900"
            >
              A Better Way to Manage Your Health
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Sanjeevani acts as your personal health command center — from AI
              triage to doctor consults and document analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, tech, description }) => (
              <article
                key={title}
                className="bg-slate-50 border border-slate-100 rounded-xl p-7 md:p-8 transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg"
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 mb-5">
                  <Icon size={28} />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-1 text-slate-900">
                  {title}
                </h3>
                <p className="text-[11px] uppercase tracking-wide text-blue-500 mb-2 font-semibold">
                  {tech}
                </p>
                <p className="text-gray-600 text-sm md:text-[15px]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section
        id="how-it-works"
        aria-labelledby="how-heading"
        className={`py-20 bg-slate-50 ${howItWorksSection.className}`}
        ref={howItWorksSection.ref}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              id="how-heading"
              className="text-3xl md:text-4xl font-bold text-slate-900"
            >
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Your journey to better health is just a few clicks away.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200" />
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
              {STEPS.map((step) => (
                <article
                  key={step.step}
                  className="text-center bg-white p-8 rounded-xl shadow-md z-10"
                >
                  <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4 ring-8 ring-slate-50">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {step.description}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400 font-medium">
                    Powered by: {step.tech}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section
        id="testimonials"
        aria-labelledby="testimonials-heading"
        className={`py-20 bg-white ${testimonialsSection.className}`}
        ref={testimonialsSection.ref}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              id="testimonials-heading"
              className="text-3xl md:text-4xl font-bold text-slate-900"
            >
              Loved by Patients and Doctors
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Real stories from people using Sanjeevani for everyday care and
              specialist consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <article
                key={t.name}
                className="bg-slate-50 p-8 rounded-xl border border-slate-100 h-full flex flex-col"
              >
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={18} />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] uppercase tracking-wide text-blue-500 mb-2 font-semibold">
                  {t.context}
                </p>
                <p className="text-gray-700 mb-6 text-sm leading-relaxed flex-1">
                  “{t.quote}”
                </p>
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={t.avatar}
                    alt={t.name}
                  />
                  <div className="ml-4">
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION SECTION --- */}
      <section
        aria-labelledby="cta-heading"
        className={`py-20 bg-slate-50 ${ctaSection.className}`}
        ref={ctaSection.ref}
      >
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 text-white rounded-2xl shadow-xl p-10 md:p-12 text-center">
            <HeartPulse size={48} className="mx-auto mb-4" />
            <h2
              id="cta-heading"
              className="text-3xl md:text-4xl font-bold mb-3"
            >
              Ready to Take Control of Your Health?
            </h2>
            <p className="max-w-xl mx-auto mb-3 text-sm md:text-base">
              Join thousands of users who trust Sanjeevani for quick, reliable
              and accessible healthcare — built specifically for Indian patients
              and doctors.
            </p>
            <p className="max-w-xl mx-auto mb-8 text-[11px] text-blue-100/80">
              Under the hood: MERN stack, Gemini 2.0 for AI, Socket.io for
              real-time chat, and Jitsi Meet for secure video consults.
            </p>
            <Link
              to="/signup"
              className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-slate-100 transition duration-300 inline-block text-lg transform hover:scale-105"
            >
              Sign Up for Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;