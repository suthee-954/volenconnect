// Participants.tsx
import React from "react";

interface Participant {
  id: number;
  name: string;
  role: string;
}

interface ParticipantsProps {
  participants: Participant[];
}

const Participants: React.FC<ParticipantsProps> = ({ participants }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Participants</h2>
      <div className="space-y-4">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{participant.name}</h3>
                <p className="text-sm text-gray-500">{participant.role}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No participants yet.</p>
        )}
      </div>
    </div>
  );
};

export default Participants;