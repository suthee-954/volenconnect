import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./firstpage";
import LoginSelection from "./Login";
import AdminLogin from "./admin/AdminLogin";
import LoginPage from "./components/LoginPage";
import VolunteerDashboard from "./components/VolunteerDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import OrganizerLogin from "./organizer/OrganizerLogin";
import OrganizerDashboard from "./organizer/OrganizerDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-selection" element={<LoginSelection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/volunteer-dashboard/*" element={<VolunteerDashboard />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="/organizer-login" element={<OrganizerLogin />} />
        <Route path="/organizer-dashboard/*" element={<OrganizerDashboard />} />
      </Routes>
    </Router>
  );
}
