import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "./Sidebar";
import CoordinatorManagement from "./CoordinatorManagement";
import ProfilePage from "./ProfilePage";
import EventsPage from "./EventsPage"; 

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminUID, setAdminUID] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("Dashboard");

  // ✅ Check Firebase Authentication (No localStorage)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminUID(user.uid);
      } else {
        alert("Unauthorized access! Please log in.");
        navigate("/admin-login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!adminUID) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="text-blue-300 text-xl font-semibold" style={{ textShadow: "0 0 10px rgba(96, 165, 250, 0.6)" }}>
        Loading...
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-300" style={{ textShadow: "0 0 10px rgba(96, 165, 250, 0.6)" }}>
            {activePage === "Dashboard" && "Admin Dashboard"}
            {activePage === "Coordinators" && "Coordinator Management"}
            {activePage === "Profile" && "Your Profile"}
            {activePage === "Events" && <EventsPage />}
          </h1>
        </div>
        
        {activePage === "Dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg border border-blue-800"
                 style={{ boxShadow: "0 0 15px 2px rgba(30, 64, 175, 0.3)" }}>
              <h2 className="text-xl font-semibold text-blue-300 mb-4" style={{ textShadow: "0 0 8px rgba(96, 165, 250, 0.5)" }}>
                Quick Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-900 bg-opacity-40 p-4 rounded-lg">
                  <p className="text-blue-300 text-sm">Active Organizers</p>
                  <p className="text-2xl font-bold text-white">2</p>
                </div>
                <div className="bg-blue-900 bg-opacity-40 p-4 rounded-lg">
                  <p className="text-blue-300 text-sm">Pending Approvals</p>
                  <p className="text-2xl font-bold text-white">1</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg border border-blue-800"
                 style={{ boxShadow: "0 0 15px 2px rgba(30, 64, 175, 0.3)" }}>
              <h2 className="text-xl font-semibold text-blue-300 mb-4" style={{ textShadow: "0 0 8px rgba(96, 165, 250, 0.5)" }}>
                Recent Activity
              </h2>
              <div className="space-y-2">
                <div className="border-b border-blue-800 pb-2">
                  <p className="text-blue-200">New organizer request from scholl@gmail.com</p>
                  <p className="text-xs text-blue-400">1 hour ago</p>
                </div>
                <div className="border-b border-blue-800 pb-2">
                  <p className="text-blue-200">Approved rahul12@gmail.com</p>
                  <p className="text-xs text-blue-400">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activePage === "Coordinators" && <CoordinatorManagement />}
        {activePage === "Profile" && <ProfilePage />}
      </div>
    </div>
  );
}