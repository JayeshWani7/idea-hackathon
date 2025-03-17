"use client";

import { useRouter } from "next/navigation";
import { auth, provider, signInWithPopup } from "@/lib/firebase";
import { useState } from "react";

const GoogleLoginButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      router.push("/auth/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Google Login Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-gray-700 font-semibold transition-all duration-300 neumorphic-btn ${
        loading ? "cursor-not-allowed opacity-70" : "hover:scale-105"
      }`}
      disabled={loading}
    >
      <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
      {loading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

export default GoogleLoginButton;
