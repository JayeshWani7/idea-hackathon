"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // Firebase Auth Instance
import { onAuthStateChanged, User } from "firebase/auth";
import faceIO from "@faceio/fiojs";

const Login1 = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faceioInstance, setFaceioInstance] = useState<faceIO | null>(null);

  // Step 1: Check Firebase Authentication & Email Verification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
      } else {
        router.push("/auth/login"); // Redirect if not verified
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Step 2: Initialize FACEIO
  useEffect(() => {
    if (user) {
      try {
        const faceio = new faceIO("fioa7c89");
        setFaceioInstance(faceio);
      } catch (err) {
        console.error("FACEIO Initialization Failed:", err);
        setError("Failed to initialize face authentication.");
      }
    }
  }, [user]);

  // Step 3: Handle Face Authentication
  const handleFaceAuth = async () => {
    if (!faceioInstance) {
      setError("Face authentication service is not available.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await faceioInstance.authenticate({ locale: "auto" });
      console.log("User authenticated:", response);
      alert(`Face recognized! Welcome, ${response.payload.name}`);
      router.push("/dashboard"); // Redirect to dashboard on success
    } catch (error: any) {
      console.error("Face authentication failed:", error);

      switch (error) {
        case 10:
          setError("Authentication was canceled. Please try again.");
          break;
        case 11:
          setError("No face detected. Ensure proper lighting and face visibility.");
          break;
        case 12:
          setError("Multiple faces detected. Ensure only one person is visible.");
          break;
        case 14:
          setError("Face not recognized. Try again or re-register your face.");
          break;
        case 15:
          setError("Too many failed attempts. Please wait a few minutes.");
          break;
        case 20:
          setError("Camera access denied. Please allow camera permissions.");
          break;
        default:
          setError("Face authentication failed. Please check your camera and try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {loading ? (
        <p className="text-gray-700">Checking authentication...</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Face Authentication Required</h1>
          {error && <p className="text-red-600">{error}</p>}
          <button
            onClick={handleFaceAuth}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login with Face"}
          </button>
        </>
      )}
    </div>
  );
};

export default Login1;
