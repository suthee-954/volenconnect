import React from "react";
import { LayoutDashboard, Users, Calendar, Bell, UserCircle, LogOut } from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Coordinators", icon: Users },
    { name: "Events", icon: Calendar },
    { name: "Notifications", icon: Bell },
    { name: "Profile", icon: UserCircle }, // Profile Page
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 border-r flex flex-col text-white"> {/* Changed to dark gray background */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-purple-400">Volunconnect</h1> {/* Purple accent for branding */}
        <p className="text-sm text-gray-300">Admin Portal</p> {/* Lighter gray for subtitle */}
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActivePage(item.name)}
            className={`flex items-center w-full px-4 py-2 hover:bg-gray-800 hover:text-purple-400 rounded-lg transition-colors ${
              activePage === item.name ? "bg-purple-900 text-purple-400" : ""
            }`}
          >
            <item.icon className="h-5 w-5 mr-3 text-gray-400" /> {/* Icon color adjusted */}
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="mt-4 flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-colors">
          <LogOut className="h-5 w-5 mr-3 text-gray-400" /> {/* Icon color adjusted */}
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;