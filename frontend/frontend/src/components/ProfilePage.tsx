import React, { useEffect, useState } from 'react';
import { Award, Calendar, MapPin, Star, User, Book, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Certificate {
  id: string;
  event: string;
  date: string;
  issuer: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'completed' | 'upcoming';
  rating?: number;
}

interface VolunteerData {
  name: string;
  email: string;
  age: number;
  location: string;
  profession: string;
  year?: string;
  college?: string;
  firm?: string;
  joinDate?: string;
}

export default function ProfilePage() {
  const [volunteer, setVolunteer] = useState<VolunteerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch volunteer data
          const volunteerDoc = await getDoc(doc(db, 'volunteers', user.uid));
          if (volunteerDoc.exists()) {
            setVolunteer(volunteerDoc.data() as VolunteerData);
          }

          // Fetch certificates for this user
          const certificatesQuery = query(
            collection(db, 'certificates'),
            where('userId', '==', user.uid)
          );
          const certificatesSnapshot = await getDocs(certificatesQuery);
          const userCertificates = certificatesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Certificate[];
          setCertificates(userCertificates);

          // Fetch events for this user
          const eventsQuery = query(
            collection(db, 'events'),
            where('userId', '==', user.uid)
          );
          const eventsSnapshot = await getDocs(eventsQuery);
          const userEvents = eventsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Event[];
          setEvents(userEvents);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const overallRating =
    events.length > 0
      ? events
          .filter((event) => event.status === 'completed' && event.rating !== undefined)
          .reduce((sum, event) => sum + (event.rating || 0), 0) /
        events.filter((event) => event.status === 'completed' && event.rating !== undefined).length
      : 0;

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center">
        <p>No volunteer data found. Please complete your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-6">
          <img
            src="https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{volunteer.name}</h1>
            <p className="text-gray-600">
              Volunteer since {volunteer.joinDate || new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </p>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{volunteer.location}</span>
            </div>
            {volunteer.profession && (
              <div className="mt-2 flex items-center gap-2 text-gray-600">
                {volunteer.profession === 'Student' ? (
                  <>
                    <Book className="w-4 h-4" />
                    <span>
                      {volunteer.year && `${volunteer.year} year`} 
                      {volunteer.college && ` at ${volunteer.college}`}
                    </span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>{volunteer.firm && `Works at ${volunteer.firm}`}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Overall Rating */}
        {events.some(event => event.status === 'completed' && event.rating !== undefined) && (
          <div className="mt-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold">
              Overall Rating: {overallRating.toFixed(1)}
            </h2>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Certificates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            Certificates
          </h2>
          {certificates.length > 0 ? (
            <div className="space-y-4">
              {certificates.map((cert) => (
                <Link
                  key={cert.id}
                  to={`/certificate/${cert.id}`}
                  state={{ cert }}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium">{cert.event}</h3>
                  <p className="text-sm text-gray-600 mt-1">Issued by {cert.issuer}</p>
                  <p className="text-sm text-gray-500 mt-1">{cert.date}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No certificates yet</p>
          )}
        </div>

        {/* Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Events
          </h2>
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{event.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        event.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                  <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                  {event.status === 'completed' && event.rating !== undefined && (
                    <div className="flex items-center gap-1 mt-2 text-yellow-500">
                      <Star className="w-4 h-4" />
                      <span>{event.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No events yet</p>
          )}
        </div>
      </div>
    </div>
  );
}