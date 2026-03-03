// src/types.ts
export interface Event {
    id: number;
    title: string;
    // Include all fields your EventCard expects
    description?: string;
    date?: string;
    location?: string;
  }