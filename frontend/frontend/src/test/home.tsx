import React, { useRef } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { addDoc, collection } from '@firebase/firestore';

export default function Home() {
    const messageRef = useRef(); // Correct usage
    const messagesRef = collection(db, "messages"); // Use db instead of firebase

    const handleSave = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        const data = messageRef.current.value.trim(); // Trim input to remove extra spaces
        if (!data) {
            console.log("Message cannot be empty!");
            return; // Prevent empty submissions
        }

        try {
            await addDoc(messagesRef, { message: data }); // Firestore requires an object
            console.log("Message saved successfully!");
            messageRef.current.value = ""; // Clear input after saving
        } catch (error) {
            console.error("Error saving message:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSave}>
                <label>Enter Message: </label>
                <input type="text" ref={messageRef} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
