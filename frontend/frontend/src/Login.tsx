import React from "react";
import { Link } from "react-router-dom";

export default function LoginSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-200">
      <div className="relative bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Your Role</h2>

        <div className="space-y-4">
          <Link to="/admin-Login">
            <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition">
              Admin Login
            </button>
          </Link>

          <Link to="/organizer-login">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Organizer Login
            </button>
          </Link>

          <Link to="/login">
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition">
              Volunteer Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
