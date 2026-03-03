import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, serverTimestamp } from 'firebase/firestore';

interface Message { id: string; content: string; senderEmail: string; senderName: string; timestamp: any; }
interface Event { id: string; title: string; date: string; location: string; organizerEmail: string; approved?: boolean; }

export default function MessagesPage() {
  const [events, setEvents] = useState<Event[]>([]), [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [messages, setMessages] = useState<Message[]>([]), [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true), [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<any>(null), [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => { setUser(firebaseUser); setAuthLoading(false); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.email) { if (!authLoading) setLoading(false); return; }
    (async () => {
      try {
        setError(null); setLoading(true);
        const volunteerRef = doc(db, 'volunteers', user.uid);
        const volunteerDoc = await getDoc(volunteerRef);
        if (!volunteerDoc.exists()) return setLoading(false);
        const enrolledIds: string[] = volunteerDoc.data().enrolledEvents || [], approvedEvents: Event[] = [];
        for (const id of enrolledIds) {
          const eventRef = doc(db, 'events', id), eventDoc = await getDoc(eventRef);
          if (eventDoc.exists()) {
            const enrollRef = doc(db, `events/${id}/enrollments`, user.email);
            const enrollDoc = await getDoc(enrollRef);
            if (enrollDoc.exists() && enrollDoc.data().approved) approvedEvents.push({ id: eventDoc.id, ...eventDoc.data() } as Event);
          }
        }
        setEvents(approvedEvents); setLoading(false);
      } catch (err) {
        console.error('Error fetching approved events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    })();
  }, [user, authLoading]);

  useEffect(() => {
    if (!selectedEvent || !user?.email) return;
    (async () => {
      try {
        setError(null);
        const expectedId = `${selectedEvent.id}_${selectedEvent.organizerEmail}`;
        const chatRef = doc(db, 'chats', expectedId), chatSnap = await getDoc(chatRef);
        if (!chatSnap.exists()) return setMessages([]), setChatId(null);
        setChatId(expectedId);
        const messagesRef = collection(db, `chats/${expectedId}/messages`);
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (snap) => {
          const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[];
          setMessages(msgs);
        }, (err) => { console.error('Snapshot error:', err); setError('Failed to load messages.'); });
        return unsubscribe;
      } catch (err) {
        console.error('Chat error:', err);
        setError('Failed to load chat. Please try again.');
      }
    })();
  }, [selectedEvent, user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedEvent || !user || !chatId) return;
    try {
      setError(null);
      const ref = collection(db, `chats/${chatId}/messages`);
      await addDoc(ref, { content: message, senderEmail: user.email, senderName: user.displayName || 'Volunteer', timestamp: serverTimestamp() });
      setMessage('');
    } catch (err) {
      console.error('Send error:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  if (loading) return <div className="text-center p-4">Loading events...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 p-4 border-r bg-white overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Approved Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No approved events found.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((e) => (
              <li key={e.id} className={`p-3 border rounded-lg hover:bg-gray-50 ${selectedEvent?.id === e.id ? 'bg-gray-200' : ''}`} onClick={() => setSelectedEvent(e)}>
                <h3 className="font-medium">{e.title}</h3>
                <p className="text-sm text-gray-500">{e.date} • {e.location}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        {selectedEvent ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="text-xl font-bold">Chat: {selectedEvent.title}</h2>
              <p className="text-sm text-gray-500">{selectedEvent.date} • {selectedEvent.location}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderEmail === user.email ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${msg.senderEmail === user.email ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{msg.senderEmail === user.email ? 'You' : msg.senderName}</span>
                        <span className="text-xs opacity-75">{msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString() : 'Just now'}</span>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"><Send className="w-5 h-5" /></button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No chat selected</h3>
              <p className="text-gray-500">Select an event from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
