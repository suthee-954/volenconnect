// src/context/EventContext.tsx
import React, { createContext, useState, useContext } from "react";

interface Participant {
  id: number;
  name: string;
  role: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  volunteers: number;
  capacity: number;
  description: string;
  participants: Participant[];
}

interface EventContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  archivedEvents: Event[];
  setArchivedEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Beach Cleanup",
      date: "2024-04-15",
      time: "10:00 AM",
      location: "Ocean Park",
      volunteers: 8,
      capacity: 20,
      description: "Join us for a beach cleanup event!",
      participants: [
        { id: 1, name: "Alice Johnson", role: "Volunteer" },
        { id: 2, name: "Bob Smith", role: "Volunteer" },
      ],
    },
    {
      id: 2,
      title: "Food Drive",
      date: "2024-04-20",
      time: "2:00 PM",
      location: "Community Center",
      volunteers: 12,
      capacity: 30,
      description: "Help distribute food to families in need.",
      participants: [
        { id: 3, name: "Charlie Brown", role: "Volunteer" },
        { id: 4, name: "Diana Prince", role: "Organizer" },
      ],
    },
  ]);

  const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);

  return (
    <EventContext.Provider value={{ events, setEvents, archivedEvents, setArchivedEvents }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};