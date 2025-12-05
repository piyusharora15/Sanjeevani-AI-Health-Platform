// frontend/src/pages/AdminPanelPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllDoctorsForAdmin, verifyDoctor } from "../api/adminApi";
import {
  ShieldCheck,
  ShieldOff,
  MapPin,
  Languages,
  IndianRupee,
} from "lucide-react";

const AdminPanelPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { userInfo } = useAuth();

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getAllDoctorsForAdmin(userInfo.token);
      setDoctors(data || []);
    } catch (err) {
      setError(err.message || "Failed to load doctors.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.token) {
      fetchDoctors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.token]);

  const handleVerify = async (doctorId) => {
    try {
      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === doctorId ? { ...doc, isVerified: true } : doc
        )
      );
      await verifyDoctor(doctorId, userInfo.token);
    } catch (err) {
      setError(err.message || "Failed to verify doctor.");
      fetchDoctors();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading admin panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  const pending = doctors.filter((d) => !d.isVerified);
  const verified = doctors.filter((d) => d.isVerified);

  const renderRow = (doctor) => (
    <tr key={doctor._id} className="hover:bg-slate-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">
          {doctor.user?.name || "Unknown"}
        </div>
        <div className="text-sm text-gray-500">{doctor.user?.email}</div>
        {doctor.user?.createdAt && (
          <div className="text-xs text-gray-400 mt-0.5">
            Joined: {new Date(doctor.user.createdAt).toLocaleDateString()}
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <div className="font-semibold">{doctor.specialty || "—"}</div>
        <div className="text-xs text-gray-500">
          {doctor.experience
            ? `${doctor.experience} yrs experience`
            : "Experience not set"}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <div className="flex items-center gap-1 text-gray-700 mb-1">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span>{doctor.location || "Not provided"}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-700">
          <Languages className="w-4 h-4 text-slate-400" />
          <span className="text-xs">
            {doctor.languages && doctor.languages.length > 0
              ? doctor.languages.join(", ")
              : "No languages set"}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <IndianRupee className="w-4 h-4 text-slate-400" />
          <span>
            {doctor.consultationFee
              ? `${doctor.consultationFee} / consult`
              : "Not set"}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {doctor.isVerified ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ShieldCheck size={14} className="mr-1" /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ShieldOff size={14} className="mr-1" /> Pending
          </span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {!doctor.isVerified && (
          <button
            onClick={() => handleVerify(doctor._id)}
            className="text-blue-600 hover:text-blue-900"
          >
            Verify
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
          Admin Panel
        </h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <div className="p-6 border-b">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Doctor Verification Requests
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Review new doctor profiles with their specialty, location,
              languages and consultation fee, then verify them to make them
              visible to patients.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty & Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location & Languages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {pending.map(renderRow)}
                {verified.map(renderRow)}
                {doctors.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-slate-500 text-sm"
                    >
                      No doctor profiles found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;