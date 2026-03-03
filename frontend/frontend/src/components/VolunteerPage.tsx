// src/components/VolunteerPage.tsx
import React from 'react';
import EventCard from './EventCard';
import { Event } from '../types.ts'; // Double-check this path

interface VolunteerPageProps {
  events: Event[];
  onApplyEvent: (eventId: number) => void;
}

const VolunteerPage: React.FC<VolunteerPageProps> = ({ events, onApplyEvent }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Volunteer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onApply={onApplyEvent}
            onEdit={undefined}
            onDelete={undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default VolunteerPage;