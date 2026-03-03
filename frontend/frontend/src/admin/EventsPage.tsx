import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { UserCircle, Calendar, Loader2 } from "lucide-react";

export default function EventsPage() {
  const [organizers, setOrganizers] = useState([]), [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return setLoading(false);
      try {
        const orgSnap = await getDocs(query(collection(db, "organizers"), where("adminEmail", "==", user.email)));
        const data = await Promise.all(orgSnap.docs.map(async (doc) => {
          const org = { id: doc.id, ...doc.data() };
          const evSnap = await getDocs(query(collection(db, "events"), where("organizerEmail", "==", org.email)));
          org.events = evSnap.docs.map(e => ({ id: e.id, ...e.data() }));
          return org;
        }));
        setOrganizers(data);
      } catch (e) {
        console.error("Error fetching:", e);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Your Organizers and Their Events
        </h2>
        {organizers.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-400">
            No organizers or events found under your account.
          </div>
        ) : (
          <div className="space-y-6">
            {organizers.map(({ id, name, email, events }) => (
              <div key={id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-5 border-b border-gray-700 flex items-center">
                  <UserCircle className="h-6 w-6 text-purple-400 mr-3" />
                  <h3 className="text-lg font-semibold">{name || email}</h3>
                </div>
                {events.length === 0 ? (
                  <div className="p-5 text-gray-400 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" /> No events created by this organizer
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-700">
                    {events.map(({ id, title, date, location }) => (
                      <li key={id} className="p-5 hover:bg-gray-750 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-purple-500/10 p-2 rounded-lg mr-4">
                            <Calendar className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-lg mb-1">{title}</h4>
                            <div className="flex gap-2 text-sm text-gray-400 flex-wrap">
                              <span className="bg-gray-700 px-2 py-1 rounded-md">📅 {date}</span>
                              <span className="bg-gray-700 px-2 py-1 rounded-md">📍 {location}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
