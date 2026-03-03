import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/organizer-dashboard" },
    { name: "Events", path: "/organizer-dashboard/events" },
    { name: "Chat", path: "/organizer-dashboard/chat" },
    { name: "Calendar", path: "/organizer-dashboard/calendar" },
    { name: "Leaderboard", path: "/organizer-dashboard/leaderboard" },
    { name: "Profile", path: "/organizer-dashboard/profile" },
    { name: "Rating", path: "/organizer-dashboard/rating" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 p-6"> {/* Dark gray background */}
      <h2 className="text-2xl font-bold mb-6 text-purple-400">Organizer Panel</h2> {/* Purple accent */}
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block p-3 rounded-lg transition duration-300 ${
                location.pathname === item.path
                  ? "bg-purple-700" // Active state with purple
                  : "hover:bg-purple-800" // Hover state with darker purple
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;