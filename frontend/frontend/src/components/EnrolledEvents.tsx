import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  image: string;
  participants: number;
  participantsNeeded: number;
  organizerEmail: string;
  approved?: boolean;
}

export default function EnrolledEventsPage() {
  const [enrolledEvents, setEnrolledEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEnrolledEvents(); }, []);

  const fetchEnrolledEvents = async () => {
    if (!auth.currentUser) {
      alert("Please log in to view enrolled events.");
      return;
    }
    const userId = auth.currentUser.uid;
    const volunteerRef = doc(db, "volunteers", userId);
    try {
      const volunteerDoc = await getDoc(volunteerRef);
      if (volunteerDoc.exists()) {
        const enrolledEventIds: string[] = volunteerDoc.data().enrolledEvents || [];
        const enrolledEventsData: Event[] = [];
        for (const eventId of enrolledEventIds) {
          const eventRef = doc(db, "events", eventId);
          const eventDoc = await getDoc(eventRef);
          if (eventDoc.exists() && auth.currentUser.email) {
            const enrollmentRef = doc(db, `events/${eventId}/enrollments`, auth.currentUser.email);
            const enrollmentDoc = await getDoc(enrollmentRef);
            const approved = enrollmentDoc.exists() ? enrollmentDoc.data().approved : false;
            enrolledEventsData.push({ id: eventDoc.id, ...eventDoc.data(), approved } as Event);
          }
        }
        setEnrolledEvents(enrolledEventsData);
      }
    } catch (error) {
      console.error("Error fetching enrolled events:", error);
      alert("Failed to load enrolled events.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">My Enrolled Events</h1>
        {loading ? (
          <p>Loading enrolled events...</p>
        ) : enrolledEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {enrolledEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden p-6">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <p className="text-gray-500 mb-4">{event.location} - {event.date}</p>
                <div className="flex items-center text-gray-600">
                  <span>{event.participants} / {event.participantsNeeded} volunteers</span>
                </div>
                <p className={`mt-4 text-sm font-semibold ${event.approved ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {event.approved ? "Approved" : "Pending / Rejected"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have not enrolled in any events yet.</p>
        )}
      </div>
    </div>
  );
}
