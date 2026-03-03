import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

export default function Rating() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<any>({});
  const [comments, setComments] = useState<any>({});
  const [submitting, setSubmitting] = useState<any>({});
  const [rated, setRated] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const user = auth.currentUser;
      if (!user) return alert("Please log in.");
      const snap = await getDoc(doc(db, "volunteers", user.uid));
      if (!snap.exists()) return setLoading(false);
      const { enrolledEvents = [], ratedEvents = [] } = snap.data();
      setRated(ratedEvents);
      const data = await Promise.all(enrolledEvents.map(async (id: string) => {
        const e = await getDoc(doc(db, "events", id));
        if (!e.exists()) return null;
        const status = (await getDoc(doc(db, `events/${id}/enrollments`, user.email!))).data()?.approved || false;
        if (ratedEvents.includes(id)) await fetchRating(id);
        return { id, ...e.data(), approved: status };
      }));
      setEvents(data.filter(Boolean));
      setLoading(false);
    };
    fetch();
  }, []);

  const fetchRating = async (id: string) => {
    const snap = await getDoc(doc(db, "ratings", `${auth.currentUser?.uid}_${id}`));
    if (snap.exists()) {
      const { rating, comment } = snap.data();
      setRatings((r: any) => ({ ...r, [id]: rating }));
      setComments((c: any) => ({ ...c, [id]: comment || "" }));
    }
  };

  const submit = async (id: string, org: string) => {
    const user = auth.currentUser;
    if (!user || !ratings[id]) return alert("Login and rate first.");
    setSubmitting((s: any) => ({ ...s, [id]: true }));
    const ratingData = {
      eventId: id,
      ratedBy: user.email,
      ratedUser: org,
      rating: ratings[id],
      comment: comments[id] || "",
      timestamp: Timestamp.now(),
    };
    try {
      await setDoc(doc(db, "ratings", `${user.uid}_${id}`), ratingData);
      await updateDoc(doc(db, "organizers", org), {
        ratings: arrayUnion({ ...ratingData, ratedBy: user.email }),
      });
      await updateDoc(doc(db, "volunteers", user.uid), {
        ratedEvents: arrayUnion(id),
      });
      setRated((r) => [...r, id]);
      alert("Submitted!");
    } catch (e) {
      console.error(e);
      alert("Error.");
    } finally {
      setSubmitting((s: any) => ({ ...s, [id]: false }));
    }
  };

  const Star = ({ eventId, star, isRated }: any) => (
    <span
      className={`text-3xl ${ratings[eventId] >= star ? "text-yellow-400" : "text-gray-500"} ${isRated ? "cursor-default" : "cursor-pointer"}`}
      onClick={() => !isRated && setRatings((r: any) => ({ ...r, [eventId]: star }))}
    >
      ★
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Rate Your Events
        </h1>

        {loading ? (
          <div className="flex justify-center h-32"><p className="text-gray-400">Loading...</p></div>
        ) : events.length ? (
          <div className="space-y-6">
            {events.map((e) => {
              const isRated = rated.includes(e.id);
              return (
                <div key={e.id} className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
                  <h2 className="text-xl font-semibold text-white mb-2">{e.title}</h2>
                  <p className="text-gray-400 mb-4">{e.description}</p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">{e.location}</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">{e.date}</span>
                  </div>
                  <div className="text-gray-400 mb-3">{e.participants} / {e.participantsNeeded} volunteers</div>
                  <div className={`mb-4 px-3 py-1 rounded-full text-sm inline-block ${
                    e.approved ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                  }`}>
                    Status: {e.approved ? "Approved" : "Pending / Rejected"}
                  </div>
                  {e.approved && (
                    <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                      <h3 className="font-semibold text-lg text-white mb-3">
                        {isRated ? "Your Rating" : "Rate the Organizer"}
                      </h3>
                      <div className="flex mb-3">{[1, 2, 3, 4, 5].map((s) => <Star key={s} eventId={e.id} star={s} isRated={isRated} />)}</div>
                      <textarea
                        className="mt-2 p-3 border border-gray-600 rounded-lg w-full bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Comments (optional)"
                        value={comments[e.id] || ""}
                        onChange={(ev) => setComments((c: any) => ({ ...c, [e.id]: ev.target.value }))}
                        disabled={isRated}
                        rows={3}
                      />
                      {!isRated ? (
                        <button
                          className="mt-3 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium text-white w-full"
                          onClick={() => submit(e.id, e.organizerEmail)}
                          disabled={submitting[e.id]}
                        >
                          {submitting[e.id] ? "Submitting..." : "Submit Rating"}
                        </button>
                      ) : (
                        <p className="mt-3 text-sm text-gray-400">You already rated this. Thanks!</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-xl text-center text-gray-400">No enrolled events yet.</div>
        )}
      </div>
    </div>
  );
}
