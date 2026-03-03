import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, setDoc,
  where, getDocs, serverTimestamp
} from 'firebase/firestore';

export function Chat() {
  const [events, setEvents] = useState([]), [selectedEvent, setSelectedEvent] = useState(null);
  const [messages, setMessages] = useState([]), [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true), [user, setUser] = useState(null);

  useEffect(() => onAuthStateChanged(auth, u => (setUser(u), setLoading(false))), []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'events'), where('organizerEmail', '==', user.email));
    return onSnapshot(q, snap => setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() }))), console.error);
  }, [user]);

  useEffect(() => {
    if (!selectedEvent || !user) return;
    const chatId = `${selectedEvent.id}_${user.email}`;
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp', 'asc'));
    return onSnapshot(q, snap => setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))), console.error);
  }, [selectedEvent, user]);

  const createChatRoom = async (e) => {
    if (!user) return;
    const chatId = `${e.id}_${user.email}`, chatRef = doc(db, 'chats', chatId);
    const exists = (await getDoc(chatRef)).exists();
    if (!exists) {
      await setDoc(chatRef, { eventId: e.id, eventTitle: e.title, organizerEmail: user.email, createdAt: serverTimestamp() });
      const membersRef = collection(db, `chats/${chatId}/members`);
      await addDoc(membersRef, { email: user.email, name: user.displayName || 'Organizer', timestamp: serverTimestamp() });
      const volSnap = await getDocs(query(collection(db, 'volunteers'), where('approvedEvents', 'array-contains', e.id)));
      await Promise.all(volSnap.docs.map(v => addDoc(membersRef, { email: v.data().email, name: v.data().name, timestamp: serverTimestamp() })));
    }
    setSelectedEvent(e);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedEvent || !user) return;
    const chatId = `${selectedEvent.id}_${user.email}`;
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      content: message, senderEmail: user.email, senderName: user.displayName || 'Organizer', timestamp: serverTimestamp()
    });
    setMessage('');
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!user) return <div className="p-4 text-center text-red-500">Please log in</div>;

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 border-r bg-white overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Your Events</h2>
        {events.length ? events.map(e => (
          <div key={e.id} className="p-3 border rounded-lg mb-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{e.title}</h3>
                <p className="text-sm text-gray-500">{e.date || 'Unknown'} • {e.location || 'Unknown'}</p>
              </div>
              <button onClick={() => createChatRoom(e)}
                className={`px-3 py-1 text-sm rounded ${selectedEvent?.id === e.id ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                {selectedEvent?.id === e.id ? 'Open' : 'Start'} Chat
              </button>
            </div>
          </div>
        )) : <p className="text-gray-500">No events</p>}
      </div>
      <div className="flex-1 flex flex-col">
        {selectedEvent ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="text-xl font-bold">Chat: {selectedEvent.title}</h2>
              <p className="text-sm text-gray-500">{selectedEvent.date} • {selectedEvent.location}</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {messages.length ? messages.map(m => (
                <div key={m.id} className={`flex ${m.senderEmail === user.email ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${m.senderEmail === user.email ? 'bg-blue-600 text-white' : 'bg-white border text-gray-800'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{m.senderEmail === user.email ? 'You' : m.senderName}</span>
                      <span className="text-xs opacity-75">{m.timestamp?.toDate ? new Date(m.timestamp.toDate()).toLocaleTimeString() : 'Now'}</span>
                    </div>
                    <p>{m.content}</p>
                  </div>
                </div>
              )) : <p className="text-center text-gray-500">No messages yet</p>}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input value={message} onChange={e => setMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..." />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : <div className="flex-1 flex items-center justify-center text-gray-500">Select an event to chat</div>}
      </div>
    </div>
  );
}
