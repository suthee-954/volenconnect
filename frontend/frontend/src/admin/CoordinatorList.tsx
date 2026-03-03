import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import OrganizerCard from "./CoordinatorCard";

export default function CoordinatorList() {
  const [organizers, setOrganizers] = useState([]), [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const q = query(collection(db, "organizers"), where("adminEmail", "==", user.email));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrganizers(Array.from(new Map(data.map((o) => [o.email, o])).values()));
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAccept = async (id) => {
    try {
      await updateDoc(doc(db, "organizers", id), { status: "approved" });
      setOrganizers((prev) => prev.map((o) => (o.id === id ? { ...o, status: "approved" } : o)));
    } catch (e) {
      console.error("Accept error:", e);
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, "organizers", id));
      setOrganizers((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      console.error("Remove error:", e);
    }
  };

  if (loading)
    return (
      <p className="text-center text-blue-400" style={{ textShadow: "0 0 5px rgba(59,130,246,0.7)" }}>
        Loading organizers...
      </p>
    );

  return (
    <div className="p-6 bg-blue-100 rounded-lg" style={{ boxShadow: "0 0 15px 5px rgba(96,165,250,0.6)" }}>
      <h2 className="text-2xl font-bold text-blue-600 mb-6" style={{ textShadow: "0 0 8px rgba(59,130,246,0.6)" }}>
        Organizers Under You
      </h2>
      {organizers.length === 0 ? (
        <p className="text-center text-blue-500" style={{ textShadow: "0 0 5px rgba(59,130,246,0.5)" }}>
          No organizers found.
        </p>
      ) : (
        <div className="space-y-4">
          {organizers.map((o) => (
            <OrganizerCard key={o.id} organizer={o} onAccept={handleAccept} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
