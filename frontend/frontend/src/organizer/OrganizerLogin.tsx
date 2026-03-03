import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Smartphone, Mail, Home, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, query, collection, where, getDocs } from "firebase/firestore";

// Validation Schema for both Login & Signup
const authSchema = yup.object().shape({
  isSignup: yup.boolean().default(false),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  organizerName: yup.string().nullable().when("isSignup", {
    is: (isSignup: any) => isSignup,
    then: () => yup.string().required("Organizer name is required"),
    otherwise: () => yup.string().nullable(),
  }),
  phone: yup.string().nullable().when("isSignup", {
    is: true,
    then: () => yup.string().matches(/^\d{10}$/, "Invalid phone number (must be 10 digits)").required("Phone number is required"),
    otherwise: () => yup.string().nullable(),
  }),
  organization: yup.string().nullable().when("isSignup", {
    is: true,
    then: () => yup.string().required("Organization name is required"),
    otherwise: () => yup.string().nullable(),
  }),
  adminEmail: yup.string().nullable().when("isSignup", {
    is: true,
    then: (schema) => schema.email("Invalid admin email").required("Admin email is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});

export default function OrganizerAuth() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { isSignup: false, email: "", password: "", organizerName: "", phone: "", organization: "", adminEmail: "" },
  });

  const onSubmit = async (data: { adminEmail: string; email: string; password: string; organizerName: unknown; phone: any; organization: any; }) => {
    setError("");
    try {
      if (isSignup) {
        // Check if adminEmail exists in 'admins' collection
        const adminQuery = query(collection(db, "admins"), where("email", "==", data.adminEmail.trim().toLowerCase()));
        const adminSnap = await getDocs(adminQuery);

        if (!adminSnap.empty) {
          console.log("Admin Document Found:", adminSnap.docs[0].data());
        } else {
          console.log("Admin Document Not Found for Email:", data.adminEmail);
          setError("The provided admin email does not exist. Please check and try again.");
          return;
        }

        // Create new organizer account in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        // Add organizer to Firestore
        if (user.email) {
          await setDoc(doc(db, "organizers", user.email), {
            organizerName: data.organizerName,
            phone: data.phone,
            organization: data.organization,
            email: user.email,
            adminEmail: data.adminEmail,
          });
        } else {
          throw new Error("User email is null.");
        }

        // Update admin document to include the organizer's name
        const adminDocRef = adminSnap.docs[0].ref;
        await updateDoc(adminDocRef, {
          organizers: arrayUnion(data.organizerName),
        });

        console.log("Organizer Signup Successful:", user.email);
        navigate("/organizer-dashboard");
      } else {
        // Login existing organizer
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        // Check if user exists in 'organizers' collection
        if (!user.email) {
          throw new Error("User email is null.");
        }
        const docRef = doc(db, "organizers", user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Organizer Login Successful:", user.email);
          navigate("/organizer-dashboard");
        } else {
          setError("No organizer account found for this email.");
        }
      }
    } catch (err) {
      if ((err as { code: string }).code === "auth/email-already-in-use") {
        setError("This email is already in use. Try logging in instead.");
      } else {
        setError("Authentication failed. Check your credentials.");
      }
      console.error("Auth Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="bg-gray-800 p-8 rounded-t-lg">
            <h1 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {isSignup ? "Organizer Sign Up" : "Organizer Login"}
            </h1>
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isSignup && (
                <>
                  <div className="relative">
                    <User className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Organizer Name"
                      {...register("organizerName")}
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {errors.organizerName && <p className="mt-1 text-sm text-red-400">{errors.organizerName.message}</p>}
                  </div>

                  <div className="relative">
                    <Smartphone className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      {...register("phone")}
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
                  </div>

                  <div className="relative">
                    <Home className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Organization Name"
                      {...register("organization")}
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {errors.organization && <p className="mt-1 text-sm text-red-400">{errors.organization.message}</p>}
                  </div>

                  <div className="relative">
                    <Mail className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Admin Email"
                      {...register("adminEmail")}
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {errors.adminEmail && <p className="mt-1 text-sm text-red-400">{errors.adminEmail.message}</p>}
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("email")}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <User className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium text-white transition-all duration-200"
              >
                {isSignup ? "Sign Up" : "Login"}
              </button>
            </form>

            <p className="mt-4 text-center text-gray-400">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-purple-400 font-medium hover:text-purple-300 transition-colors"
              >
                {isSignup ? "Login" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}