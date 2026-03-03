import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, User, MapPin, Calendar, Book, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const authSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  name: yup.string().when("isSignup", {
    is: true,
    then: (schema) => schema.required("Full name is required"),
  }),
  age: yup.number().when("isSignup", {
    is: true,
    then: (schema) => schema.positive().integer().required("Age is required"),
  }),
  location: yup.string().when("isSignup", {
    is: true,
    then: (schema) => schema.required("Location is required"),
  }),
  profession: yup.string().when("isSignup", {
    is: true,
    then: (schema) => schema.required("Profession is required"),
  }),
  year: yup.string().when("profession", {
    is: "Student",
    then: (schema) => schema.required("Year is required"),
  }),
  college: yup.string().when("profession", {
    is: "Student",
    then: (schema) => schema.required("College is required"),
  }),
  firm: yup.string().when("profession", {
    is: "Employee",
    then: (schema) => schema.required("Company is required"),
  }),
});

export default function VolunteerAuth() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(authSchema),
    defaultValues: { isSignup: false },
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await setDoc(doc(db, "volunteers", userCredential.user.uid), {
          name: data.name,
          email: data.email,
          age: data.age,
          location: data.location,
          profession: data.profession,
          year: data.profession === "Student" ? data.year : null,
          college: data.profession === "Student" ? data.college : null,
          firm: data.profession === "Employee" ? data.firm : null,
        });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      navigate("/volunteer-dashboard");
    } catch (err) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "Email already in use. Try logging in instead."
          : err.code === "auth/user-not-found" || err.code === "auth/wrong-password"
          ? "Invalid email or password"
          : "Authentication failed. Please try again."
      );
      console.error("Auth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const profession = watch("profession");

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="bg-gray-800 p-8 rounded-t-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {isSignup ? "Volunteer Sign Up" : "Volunteer Login"}
            </h2>

            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isSignup && (
                <>
                  <AuthInput icon={User} type="text" placeholder="Full Name" register={register("name")} error={errors.name} />
                  <div className="grid grid-cols-2 gap-4">
                    <AuthInput icon={Calendar} type="number" placeholder="Age" register={register("age")} error={errors.age} />
                    <AuthInput icon={MapPin} type="text" placeholder="Location" register={register("location")} error={errors.location} />
                  </div>
                  <AuthSelect register={register("profession")} error={errors.profession}>
                    <option value="">Select Profession</option>
                    <option value="Student">Student</option>
                    <option value="Employee">Employee</option>
                  </AuthSelect>

                  {profession === "Student" && (
                    <>
                      <AuthInput icon={Book} type="text" placeholder="Year of Study" register={register("year")} error={errors.year} />
                      <AuthInput icon={Book} type="text" placeholder="College Name" register={register("college")} error={errors.college} />
                    </>
                  )}

                  {profession === "Employee" && <AuthInput icon={Briefcase} type="text" placeholder="Company Name" register={register("firm")} error={errors.firm} />}
                </>
              )}

              <AuthInput icon={Mail} type="email" placeholder="Email Address" register={register("email")} error={errors.email} />
              <AuthInput icon={User} type="password" placeholder="Password" register={register("password")} error={errors.password} />

              <AuthButton loading={loading} text={isSignup ? "Sign Up" : "Login"} />

              <p className="mt-4 text-center text-gray-400">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => setIsSignup(!isSignup)} className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
                  {isSignup ? "Login" : "Sign up"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const AuthInput = ({ icon: Icon, type, placeholder, register, error }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={type}
      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      placeholder={placeholder}
      {...register}
    />
    {error && <p className="mt-1 text-sm text-red-400">{error.message}</p>}
  </div>
);

const AuthSelect = ({ register, error, children }) => (
  <div>
    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" {...register}>
      {children}
    </select>
    {error && <p className="mt-1 text-sm text-red-400">{error.message}</p>}
  </div>
);

const AuthButton = ({ loading, text }) => (
  <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium text-white transition-all duration-200">
    {loading ? "Processing..." : text}
  </button>
);
