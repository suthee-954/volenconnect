// src/components/EventCard.tsx
import React from "react";
import { Event } from "../types"; // Correct path for the type import

interface EventCardProps {
  event: Event;
  onApply?: (eventId: number) => void;
  onEdit?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onApply, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 ease-in-out">
      {/* Event Image */}
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-32 object-cover rounded-md mb-4"
      />

      {/* Event Title */}
      <h3 className="font-medium text-lg text-emerald-600">{event.title}</h3>

      {/* Event Description */}
      <p className="text-sm text-gray-700">{event.description}</p>

      {/* Event Date & Participants */}
      <p className="text-sm text-gray-500">
        {event.date} • {event.participants} / {event.participantsNeeded} participants
      </p>

      {/* Buttons Section (Apply/Edit/Delete) */}
      <div className="flex gap-2 mt-4">
        {/* Apply Button */}
        {onApply && !event.isApproved && event.participants < event.participantsNeeded && (
          <button
            onClick={() => onApply(event.id)}
            className="bg-emerald-600 text-white rounded-md px-4 py-2 hover:bg-emerald-700"
          >
            Apply
          </button>
        )}

        {/* Edit Button */}
        {onEdit && (
          <button
            onClick={() => onEdit(event.id)}
            className="text-emerald-600 hover:text-emerald-700"
          >
            Edit
          </button>
        )}

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={() => onDelete(event.id)}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
