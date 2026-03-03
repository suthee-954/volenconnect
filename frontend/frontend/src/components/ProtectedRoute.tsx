import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { adminUID } = useAdmin();

  return adminUID ? children : <Navigate to="/admin-login" replace />;
}
