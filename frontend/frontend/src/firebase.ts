import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; 
import { getStorage } from "firebase/storage";

// 🔹 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4iQvIRoI4n4kBEC9KRRqwlQfI-jhbQXE",
  authDomain: "volunconnect-687b2.firebaseapp.com",
  projectId: "volunconnect-687b2",
  storageBucket: "volunconnect-687b2.appspot.com",
  messagingSenderId: "590265829812",
  appId: "1:590265829812:web:217e82a865c4820e340ae1",
  measurementId: "G-1BWKPGS3YT"
};

// 🔹 Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// 🔹 Variable to Store Current User
let currentUser: User | null = null;

// ✅ Track Authentication State
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  console.log("🔥 Logged-in User Email:", user?.email); // ✅ Log Email
});

// ✅ Function to Get Admin Data by Email
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ Firebase Auth - User Found:", {
          email: user.email,
          uid: user.uid,
          provider: user.providerData,
        });
        resolve(user);
      } else {
        console.warn("🚨 No Firebase Auth User Found!");
        resolve(null);
      }
      unsubscribe();
    }, reject);
  });
};


export { app, db, auth, storage };
