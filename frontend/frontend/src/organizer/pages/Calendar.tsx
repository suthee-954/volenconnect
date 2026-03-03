import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const localizer = momentLocalizer(moment);

export function Calendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [event, setEvent] = useState<any | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, "events"), where("organizerEmail", "==", user.email));
      const docs = await getDocs(q);
      setEvents(docs.docs.map((d) => {
        const e = d.data();
        return {
          id: d.id,
          title: e.title,
          start: new Date(e.date),
          end: new Date(e.date),
          location: e.location,
          volunteersNeeded: e.volunteersNeeded,
          volunteersEnrolled: e.volunteersEnrolled?.length || 0,
        };
      }));
    };
    fetch();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Event Calendar</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gray-100 p-3 rounded shadow">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={{ month: true, agenda: true }}
            style={{ height: 450 }}
            onSelectEvent={setEvent}
            eventPropGetter={() => ({
              style: { background: "#4F46E5", color: "white", borderRadius: 4, padding: 3 },
            })}
          />
        </div>
        <div className="bg-gray-100 p-3 rounded shadow h-[450px] overflow-auto">
          <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
          {events.length ? events.map((e) => (
            <div
              key={e.id}
              onClick={() => setEvent(e)}
              className="mb-2 p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
            >
              <p className="font-bold">{e.title}</p>
              <p className="text-sm">{moment(e.start).format("MMM Do, h:mm A")}</p>
            </div>
          )) : <p className="text-gray-600">No events.</p>}
        </div>
      </div>

      {event && (
        <Modal
          isOpen={!!event}
          onRequestClose={() => setEvent(null)}
          className="p-6 bg-white rounded shadow max-w-md mx-auto mt-20"
        >
          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
          <p><b>Date:</b> {moment(event.start).format("MMMM Do YYYY, h:mm A")}</p>
          <p><b>Location:</b> {event.location}</p>
          <p><b>Volunteers Needed:</b> {event.volunteersNeeded}</p>
          <p><b>Volunteers Enrolled:</b> {event.volunteersEnrolled}</p>
          <button
            onClick={() => setEvent(null)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}
