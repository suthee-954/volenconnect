import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Events } from "./pages/Events";
import { Chat } from "./pages/Chat";
import { Calendar } from "./pages/Calendar";
import { Leaderboard } from "./pages/Leaderboard";
import { OrganizerDashboard2 } from "./pages/OrganizerDashboard2";
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage
import Rating from "./pages/Rating";

const OrganizerDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-4">
        <Routes>
          <Route index element={<OrganizerDashboard2 />} />
          <Route path="events" element={<Events />} />
          <Route path="chat" element={<Chat />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="rating" element={<Rating />} /> {/* Add Rating Route */}
          <Route path="events/:id" element={<Events />} /> {/* Add Event Details Route */}
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<ProfilePage />} /> {/* Add ProfilePage Route */}
        </Routes>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
