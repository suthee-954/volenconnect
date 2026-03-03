export type UserRole = 'admin' | 'volunteer' | 'organizer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  rating: number;
  eventsCompleted: number;
  avatar?: string;
  skills?: string[];
  availability?: string[];
  certificates?: Certificate[];
}

export interface Certificate {
  id: string;
  eventId: string;
  volunteerId: string;
  issueDate: Date;
  title: string;
  description: string;
  hours: number;
  signature: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  organizerId: string;
  maxVolunteers: number;
  currentVolunteers: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  rating: number;
  image: string;
  volunteers: VolunteerApplication[];
  skills: string[];
  requirements: string[];
}

export interface VolunteerApplication {
  volunteerId: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: Date;
  volunteer: User;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  eventId: string;
  content: string;
  timestamp: Date;
  senderName: string;
  senderAvatar?: string;
}