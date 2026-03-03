import React, { useState, useEffect } from "react";
import { db, getCurrentUser } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ProfilePage() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        console.log("🔍 Fetching current admin user...");
        const currentUser = await getCurrentUser();
    
        if (!currentUser || !currentUser.email) {
          console.error("🚨 No logged-in admin found in Firebase Auth!");
          setAdmin(null);
          return;
        }
    
        console.log("✅ Logged-in Admin Email:", currentUser.email);
    
        // 🔍 Firestore Query Debugging
        console.log("📂 Checking Firestore for 'admins' collection...");
        const adminQuery = query(collection(db, "admins"), where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(adminQuery);
    
        console.log("📊 Query Snapshot Size:", querySnapshot.size);
    
        if (querySnapshot.empty) {
          console.warn("⚠️ Firestore returned NO MATCHING admin document for:", currentUser.email);
          console.warn("📌 Possible Issues:");
          console.warn("1️⃣ The admin document does not exist.");
          console.warn("2️⃣ Firestore security rules are blocking access.");
          console.warn("3️⃣ The email field in Firestore does not match exactly (case-sensitive).");
          setAdmin(null);
          return;
        }
    
        querySnapshot.forEach((doc) => console.log("📄 Found Admin Document:", doc.data()));
    
        const adminData = querySnapshot.docs[0].data();
        setAdmin(adminData);
        console.log("✅ Admin Profile Data Loaded:", adminData);
      } catch (error) {
        console.error("🔥 Error fetching admin data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    

    fetchAdminData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!admin) return <div className="text-red-500">⚠️ Admin data not found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold">{admin.adminName || "Admin"}</h1>
        <p className="text-gray-600">{admin.organization || "Organization not found"}</p>
        <p className="text-gray-500">{admin.email}</p>
        <p className="text-gray-500">{admin.phone}</p>
      </div>
    </div>
  );
}
