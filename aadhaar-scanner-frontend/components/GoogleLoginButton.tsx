"use client";

import { useRouter } from "next/navigation";
import { auth, provider, signInWithPopup } from "@/lib/firebase";
import { useState } from "react";

const GoogleLoginButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔹 Check if user is an admin (Modify logic based on your authentication method)
      if (user.email === "wanijayesh0@gmail.com") {
        router.push("https://heroic-dragon-db1b68.netlify.app/"); // Redirect admin
      } else {
        router.push("https://multi-lingo-helper.lovable.app/dashboard"); // Redirect normal users
      }

    } catch (error) {
      console.error("Login failed:", error);
      setError("Authentication failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-600">{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
};
export default GoogleLoginButton;
