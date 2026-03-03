import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function Events() {
  const [events, setEvents] = useState([]), [enrollments, setEnrollments] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        getDocs(collection(db, "events")).then((snap) => {
          const filtered = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            .filter((e) => e.organizerEmail === user.email);
          setEvents(filtered);
          filtered.forEach((e) => {
            const ref = collection(db, `events/${e.id}/enrollments`);
            onSnapshot(ref, (s) =>
              setEnrollments((prev) => ({
                ...prev,
                [e.id]: s.docs.map((d) => ({ id: d.id, ...d.data() })),
              }))
            );
          });
        });
      }
    });
    return () => unsub();
  }, []);

  const handle = {
    approve: async (eid, uid) => {
      await updateDoc(doc(db, `events/${eid}/enrollments`, uid), { approved: true });
    },
    reject: async (eid, uid) => {
      await deleteDoc(doc(db, `events/${eid}/enrollments`, uid));
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Events</h2>
      {events.map((e) => {
        const list = enrollments[e.id] || [];
        const approved = list.filter((v) => v.approved);
        const pending = list.filter((v) => !v.approved);

        return (
          <div key={e.id} className="bg-white shadow p-4 mb-4 rounded">
            <h3 className="text-lg font-semibold">{e.title}</h3>
            <p className="text-gray-600">{e.description}</p>

            <h4 className="mt-4 font-medium">Approved Volunteers</h4>
            {approved.length ? (
              <ul className="pl-5 list-disc">
                {approved.map((v) => (
                  <li key={v.id} className="bg-green-100 p-2 mt-1 rounded flex justify-between items-center">
                    {v.userEmail}
                    <button onClick={() => handle.reject(e.id, v.id)} className="text-sm bg-red-500 text-white px-2 py-1 rounded">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No approved volunteers yet.</p>
            )}

            <h4 className="mt-4 font-medium">Pending Enrollments</h4>
            {pending.length ? (
              pending.map((v) => (
                <div key={v.id} className="bg-gray-100 p-2 mt-2 rounded flex justify-between items-center">
                  {v.userEmail}
                  <div className="space-x-2">
                    <button onClick={() => handle.approve(e.id, v.id)} className="bg-green-500 text-white px-3 py-1 rounded">
                      Accept
                    </button>
                    <button onClick={() => handle.reject(e.id, v.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No pending enrollments.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
