import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Create a Context for storing the admin UID and data
const AdminContext = createContext<any>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminUID, setAdminUID] = useState<string | null>(null);
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAdminUID(user.uid);

        // Fetch admin data
        const adminRef = doc(db, "Admins", user.uid);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
          setAdminData(adminSnap.data());
        }
      } else {
        setAdminUID(null);
        setAdminData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ adminUID, adminData }}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook to use admin data in any component
export const useAdmin = () => useContext(AdminContext);
