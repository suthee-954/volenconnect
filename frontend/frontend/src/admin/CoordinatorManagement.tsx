import React, { useState } from "react";
import CoordinatorCard from "./CoordinatorCard";

const MOCK = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", status: "pending" },
  { id: 2, name: "Michael Chen", email: "michael.c@example.com", status: "active" },
  { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", status: "pending" },
];

export default function CoordinatorManagement() {
  const [coordinators, setCoordinators] = useState(() =>
    Array.from(new Map(MOCK.map(c => [c.id, c])).values())
  );
  const update = (id, status) =>
    setCoordinators(prev =>
      status ? prev.map(c => (c.id === id ? { ...c, status } : c)) : prev.filter(c => c.id !== id)
    );
  return (
    <div>
      {coordinators.map(c => (
        <CoordinatorCard
          key={c.id}
          coordinator={c}
          onAccept={() => update(c.id, "active")}
          onRemove={() => update(c.id)}
        />
      ))}
    </div>
  );
}
