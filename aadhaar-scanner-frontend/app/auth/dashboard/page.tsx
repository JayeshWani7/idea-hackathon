"use client";

import { auth, signOut } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) router.push("/auth/login");
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.displayName}!</h1>
          <p className="mb-4">Email: {user.email}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
