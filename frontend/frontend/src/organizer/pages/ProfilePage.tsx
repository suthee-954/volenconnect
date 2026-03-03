import React, { useState, useEffect } from "react";
import { db, getCurrentUser } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ProfilePage() {
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizerData = async () => {
      setLoading(true);
      try {
        console.log("🔍 Fetching current organizer user...");
        const currentUser = await getCurrentUser();

        if (!currentUser || !currentUser.email) {
          console.error("🚨 No logged-in organizer found in Firebase Auth!");
          setOrganizer(null);
          return;
        }

        console.log("✅ Logged-in Organizer Email:", currentUser.email);

        // 🔍 Firestore Query Debugging
        console.log("📂 Checking Firestore for 'organizers' collection...");
        const organizerQuery = query(collection(db, "organizers"), where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(organizerQuery);

        console.log("📊 Query Snapshot Size:", querySnapshot.size);

        if (querySnapshot.empty) {
          console.warn("⚠️ Firestore returned NO MATCHING organizer document for:", currentUser.email);
          console.warn("📌 Possible Issues:");
          console.warn("1️⃣ The organizer document does not exist.");
          console.warn("2️⃣ Firestore security rules are blocking access.");
          console.warn("3️⃣ The email field in Firestore does not match exactly (case-sensitive).");
          setOrganizer(null);
          return;
        }

        querySnapshot.forEach((doc) => console.log("📄 Found Organizer Document:", doc.data()));

        const organizerData = querySnapshot.docs[0].data();
        setOrganizer(organizerData);
        console.log("✅ Organizer Profile Data Loaded:", organizerData);
      } catch (error) {
        console.error("🔥 Error fetching organizer data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!organizer) return <div className="text-red-500">⚠️ Organizer data not found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold">{organizer.organizerName || "Organizer"}</h1>
        <p className="text-gray-600">{organizer.organization || "Organization not found"}</p>
        <p className="text-gray-500">{organizer.email}</p>
        <p className="text-gray-500">{organizer.phone}</p>
      </div>
    </div>
  );
}
