import React, { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

interface Event {
  id: string; title: string; description: string; location: string;
  date: string; image: string; participants: number;
  participantsNeeded: number; organizerEmail: string;
}

const InputWithIcon = ({
  icon: Icon, placeholder, value, onChange,
}: {
  icon: React.ElementType; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative">
    <Icon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
    <input
      type="text" placeholder={placeholder} value={value} onChange={onChange}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState(""), [location, setLocation] = useState(""), [searchResults, setSearchResults] = useState<Event[]>([]);
  useEffect(() => { (async () => {
    try {
      const snap = await getDocs(collection(db, "events"));
      const events = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Event[];
      setSearchResults(events);
    } catch (err) { console.error("Error fetching events:", err); }
  })(); }, []);

  const handleSearch = () => {
    setSearchResults((prev) =>
      prev.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          e.location.toLowerCase().includes(location.toLowerCase())
      )
    );
  };

  const handleEnroll = async (eventId: string) => {
    const user = auth.currentUser;
    if (!user?.email) return alert("Please log in to enroll.");
    const { email, uid } = user;
    const enrollmentRef = doc(db, `events/${eventId}/enrollments`, email);
    const volunteerRef = doc(db, "volunteers", uid);
    try {
      const enrollment = await getDoc(enrollmentRef);
      if (enrollment.exists()) return alert("Already enrolled.");
      await setDoc(enrollmentRef, { userEmail: email, approved: false, timestamp: new Date() });
      const volunteer = await getDoc(volunteerRef);
      const data = volunteer.data() || { enrolledEvents: [], approvedEvents: [], email };
      if (!data.enrolledEvents.includes(eventId)) {
        data.enrolledEvents.push(eventId);
        await setDoc(volunteerRef, data, { merge: true });
      }
      alert("Enrollment request sent!");
    } catch (err) {
      console.error("Enroll error:", err);
      alert("Failed to enroll. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <InputWithIcon icon={Search} placeholder="Search for volunteer opportunities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex-1">
            <InputWithIcon icon={MapPin} placeholder="Enter location..." value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
        <button onClick={handleSearch} className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition">Search</button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {searchResults.length ? searchResults.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <p className="text-gray-500 mb-4">{event.location} - {event.date}</p>
            <p className="text-gray-600">{event.participants} / {event.participantsNeeded} volunteers</p>
            <button onClick={() => handleEnroll(event.id)} className="mt-6 w-full py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Enroll Now</button>
          </div>
        )) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">No results found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
