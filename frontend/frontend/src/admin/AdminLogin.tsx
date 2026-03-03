import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";

// ✅ Validation Schema
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Handle Login
  const handleLoginSubmit = async (data: { email: unknown; password: string; }) => {
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      console.log("🔍 Checking Firestore for Admin:", data.email);
      
      // ✅ Step 1: Check if Admin Exists in Firestore
      const adminQuery = query(collection(db, "admins"), where("email", "==", data.email));
      const querySnapshot = await getDocs(adminQuery);

      if (querySnapshot.empty) {
        throw new Error("Admin account not found in Firestore.");
      }

      // ✅ Step 2: Authenticate with Firebase Auth
      console.log("🔐 Attempting Firebase Authentication...");
      await signInWithEmailAndPassword(auth, data.email as string, data.password);

      console.log("✅ Login Successful!");
      alert("Login Successful!");
      navigate("/admin-dashboard");
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Login Failed:", error.message);
      } else {
        console.error("❌ Login Failed:", error);
      }
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="bg-gray-800 p-8 rounded-t-lg">
            <h1 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Admin Login
            </h1>

            {errorMessage && <p className="text-red-400 text-sm text-center mb-4">{errorMessage}</p>}

            <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
              <InputField label="Email ID" register={register} name="email" error={errors.email} />
              <InputField label="Password" register={register} name="password" type="password" error={errors.password} />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium text-white transition-all duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:from-purple-600 hover:to-pink-600"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Updated InputField Component
import { UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  label: string;
  register: UseFormRegister<{ email: string; password: string }>;
  name: "email" | "password";
  type?: string;
  error?: { message?: string };
}

const InputField: React.FC<InputFieldProps> = ({ label, register, name, type = "text", error }) => (
  <div>
    <label htmlFor={name} className="sr-only">{label}</label>
    <input
      id={name}
      type={type}
      {...register(name)}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      placeholder={label}
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-400">
        {error.message}
      </p>
    )}
  </div>
);