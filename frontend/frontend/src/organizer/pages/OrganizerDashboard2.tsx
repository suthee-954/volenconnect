import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { auth, db } from "../../firebase";
import { doc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";

export function OrganizerDashboard2() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    volunteersNeeded: "",
    status: "open",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Fetch only events where the organizerEmail matches the logged-in user's email
    const q = query(collection(db, "events"), where("organizerEmail", "==", user.email));
    const querySnapshot = await getDocs(q);
    const fetchedEvents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEvents(fetchedEvents);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveEvent = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const eventData = {
      ...formData,
      eventId: editingEvent ? editingEvent.id : crypto.randomUUID(),
      organizerEmail: user.email, // Store email instead of UID
      volunteersEnrolled: [],
    };

    if (editingEvent) {
      await updateDoc(doc(db, "events", editingEvent.id), eventData);
    } else {
      await setDoc(doc(db, "events", eventData.eventId), eventData);
    }

    setEditingEvent(null);
    setFormData({ title: "", description: "", location: "", date: "", volunteersNeeded: "", status: "open" });
    fetchEvents();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Organizer Dashboard</h2>
        <button onClick={() => setEditingEvent(null)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Create Event
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {events.map((event) => (
            <div key={event.eventId} className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-900">{event.title}</h4>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-gray-600">Location: {event.location}</p>
              <p className="text-gray-600">Date: {event.date}</p>
              <p className="text-gray-600">Volunteers Needed: {event.volunteersNeeded}</p>
              <p className="text-gray-600">Organizer: {event.organizerEmail}</p>
              <div className="flex space-x-2 mt-4">
                <button onClick={() => setEditingEvent(event)} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </button>
                <button onClick={() => deleteDoc(doc(db, "events", event.eventId)).then(fetchEvents)} className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center">
                  <Trash className="w-4 h-4 mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">{editingEvent ? "Edit Event" : "Create Event"}</h3>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded mt-2" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded mt-2" />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded mt-2" />
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded mt-2" />
        <input type="number" name="volunteersNeeded" placeholder="Volunteers Needed" value={formData.volunteersNeeded} onChange={handleChange} className="w-full p-2 border rounded mt-2" />
        <button onClick={handleSaveEvent} className="w-full bg-indigo-600 text-white py-2 rounded mt-4">
          {editingEvent ? "Update Event" : "Save Event"}
        </button>
      </div>
    </div>
  );
}
