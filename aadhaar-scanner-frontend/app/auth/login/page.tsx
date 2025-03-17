"use client";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-gray-100 p-10 rounded-3xl shadow-lg neumorphism w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">
          Welcome to Vyom Vision
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Secure banking at your fingertips. Sign in to continue.
        </p>
        <GoogleLoginButton />
      </div>
    </div>
  );
};

export default LoginPage;
