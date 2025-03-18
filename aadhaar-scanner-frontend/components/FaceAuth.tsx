"use client";
import { useState, useEffect } from "react";
import faceIO from "@faceio/fiojs";

const FaceAuth = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [faceioInstance, setFaceioInstance] = useState<faceIO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const faceio = new faceIO(process.env.NEXT_PUBLIC_FACEIO_APP_ID!);
      setFaceioInstance(faceio);
    }
  }, []);

  // 🔹 Enroll a User (Register a Face)
  const handleEnroll = async () => {
    if (!faceioInstance) {
      setError("FACEIO is not initialized.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await faceioInstance.enroll({
        locale: "auto",
        payload: {
          userId: "12345",
          name: "John Doe",
          email: "john.doe@example.com"
        },
        enrollmentOptions: {
          maxRetries: 3, // Allow retries if face not detected
          playIntro: true, // Show FACEIO's built-in instructions
        }
      });

      console.log("Face enrolled successfully:", response);
      alert("Face successfully registered!");
    } catch (error: any) {
      console.error("Face enrollment failed:", error);
      setError(getErrorMessage(error));
    }

    setLoading(false);
  };

  // 🔹 Authenticate a User (Face Login)
  const handleAuthenticate = async () => {
    if (!faceioInstance) {
      setError("FACEIO is not initialized.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await faceioInstance.authenticate({ locale: "auto" });

      console.log("User authenticated:", response);
      alert(`Face recognized! Welcome, ${response.payload.name}`);
      onAuthenticated(); // Redirect to dashboard
    } catch (error: any) {
      console.error("Face authentication failed:", error);
      setError(getErrorMessage(error));
    }

    setLoading(false);
  };

  // 🔹 Handle FACEIO Errors
  const getErrorMessage = (errorCode: number): string => {
    switch (errorCode) {
      case 10: return "Authentication canceled. Please try again.";
      case 11: return "No face detected. Ensure proper lighting.";
      case 12: return "Multiple faces detected. Show only one face.";
      case 14: return "Face not recognized. Try again or re-register.";
      case 15: return "Too many failed attempts. Try again later.";
      case 20: return "Camera access denied. Allow camera permissions.";
      default: return "Face authentication failed. Please check your camera.";
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Face Authentication</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button
        onClick={handleEnroll}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-3 hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Enrolling..." : "Register Face"}
      </button>

      <button
        onClick={handleAuthenticate}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        disabled={loading}
      >
        {loading ? "Authenticating..." : "Login with Face"}
      </button>
    </div>
  );
};

export default FaceAuth;
