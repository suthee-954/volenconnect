import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { db } from "../../firebase";
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query,
  where, getDocs, Timestamp, orderBy,
} from "firebase/firestore";
import { getCurrentUser } from "../../firebase";

export default function OrganizerRating() {
  const [events, setEvents] = useState([]), [selectedEvent, setSelectedEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]), [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true), [newRatings, setNewRatings] = useState({});
  const [comments, setComments] = useState({}), [submitting, setSubmitting] = useState({});

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) return setLoading(false);
      try {
        const eventsSnap = await getDocs(query(collection(db, "events"), where("organizerEmail", "==", user.email)));
        const eventsData = eventsSnap.docs.map(d => ({ id: d.id, ...d.data(), approvedVolunteers: d.data().approvedVolunteers || [] }));
        setEvents(eventsData);

        const ratingsSnap = await getDocs(query(collection(db, "ratings"), where("ratedUser", "==", user.email), orderBy("timestamp", "desc")));
        const ratingsData = await Promise.all(ratingsSnap.docs.map(async d => {
          const r = { id: d.id, ...d.data() };
          const v = await getDoc(doc(db, "volunteers", r.ratedBy));
          const e = await getDoc(doc(db, "events", r.eventId));
          return { ...r, volunteerName: v.exists() ? v.data().name : "Unknown Volunteer", eventTitle: e.exists() ? e.data().title : "Unknown Event" };
        }));
        setRatings(ratingsData);
      } catch (e) {
        console.error("Fetch error:", e);
      }
      setLoading(false);
    })();
  }, []);

  const fetchVolunteers = async (event) => {
    setLoading(true); setSelectedEvent(event);
    const v = await Promise.all((event.approvedVolunteers || []).map(async id => {
      const docSnap = await getDoc(doc(db, "volunteers", id));
      return docSnap.exists() ? { id, ...docSnap.data() } : null;
    }));
    setVolunteers(v.filter(Boolean)); setLoading(false);
  };

  const submitRating = async (vid, email) => {
    const user = await getCurrentUser();
    if (!user || !selectedEvent || !newRatings[vid]) return alert("Select a rating first.");
    setSubmitting(p => ({ ...p, [vid]: true }));
    try {
      const id = `${user.email}_${selectedEvent.id}_${vid}`;
      const ref = doc(db, "ratings", id), time = Timestamp.now();
      const data = { eventId: selectedEvent.id, ratedBy: user.email, ratedUser: email, rating: newRatings[vid], comment: comments[vid] || "", timestamp: time, eventTitle: selectedEvent.title };
      await setDoc(ref, data);
      await updateDoc(doc(db, "volunteers", vid), {
        ratings: arrayUnion({ rating: data.rating, comment: data.comment, eventId: selectedEvent.id, ratedBy: user.email, timestamp: time })
      });
      alert("Rating submitted!");
      setNewRatings(p => ({ ...p, [vid]: 0 }));
      setComments(p => ({ ...p, [vid]: "" }));
    } catch (e) {
      console.error("Submit error:", e); alert("Failed to submit.");
    } finally {
      setSubmitting(p => ({ ...p, [vid]: false }));
    }
  };

  if (loading) return <div className="min-h-screen p-6 flex justify-center items-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Organizer Rating Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-4">Your Events</h2>
            {events.length ? (
              <ul className="space-y-2">
                {events.map(e => (
                  <li key={e.id} className={`p-3 rounded cursor-pointer hover:bg-gray-50 ${selectedEvent?.id === e.id ? "bg-blue-50 border border-blue-200" : ""}`} onClick={() => fetchVolunteers(e)}>
                    <h3 className="font-medium">{e.title}</h3>
                    <p className="text-sm text-gray-500">{e.approvedVolunteers.length} approved volunteers</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No events found</p>}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedEvent && (
              <div className="bg-white rounded shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Rate Volunteers for: {selectedEvent.title}</h2>
                {volunteers.length ? volunteers.map(v => (
                  <div key={v.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <div><h3 className="font-medium">{v.name}</h3><p className="text-sm text-gray-500">{v.email}</p></div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={`cursor-pointer text-xl ${newRatings[v.id] >= star ? "text-yellow-500" : "text-gray-300"}`} onClick={() => setNewRatings(p => ({ ...p, [v.id]: star }))}>★</span>
                        ))}
                      </div>
                      <textarea className="w-full p-2 border rounded text-sm" rows={2} placeholder="Add comments (optional)" value={comments[v.id] || ""} onChange={e => setComments(p => ({ ...p, [v.id]: e.target.value }))} />
                      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm" onClick={() => submitRating(v.id, v.email)} disabled={submitting[v.id]}>
                        {submitting[v.id] ? "Submitting..." : "Submit Rating"}
                      </button>
                    </div>
                  </div>
                )) : <p className="text-gray-500">No approved volunteers</p>}
              </div>
            )}

            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Ratings You've Received</h2>
              {ratings.length ? ratings.map(r => (
                <div key={r.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between">
                    <div><h3 className="font-medium">{r.volunteerName}</h3><p className="text-sm text-gray-500">{r.eventTitle}</p></div>
                    <div className="flex">{[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-500" />)}</div>
                  </div>
                  {r.comment && <p className="mt-2 text-gray-600">{r.comment}</p>}
                  <p className="mt-1 text-xs text-gray-400">{r.timestamp.toDate().toLocaleDateString()}</p>
                </div>
              )) : <p className="text-gray-500">No ratings received</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
