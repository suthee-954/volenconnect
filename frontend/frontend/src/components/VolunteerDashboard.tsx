import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LandingPage from '../components/LandingPage';
import SearchPage from '../components/SearchPage';
import MessagesPage from '../components/MessagesPage';
import ProfilePage from '../components/ProfilePage';
import TasksPage from '../components/TasksPage';
import CertificatePage from '../components/CertificatePage';
import EnrolledEventsPage from './EnrolledEvents';
import Rating from './Rating';

const VolunteerDashboard: React.FC = () => {
  useEffect(() => {
    console.log("VolunteerDashboard loaded"); // Debugging check
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-800">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 min-h-[calc(100vh-3rem)]">
            <Routes>
              <Route index element={<LandingPage />} /> {/* Default page for /volunteer-dashboard */}
              <Route path="tasks" element={<TasksPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="enrolled-events" element={<EnrolledEventsPage />} />
              <Route path="rating" element={<Rating />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="certificate/:id" element={<CertificatePage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;