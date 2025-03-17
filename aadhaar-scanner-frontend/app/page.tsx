"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Mic, MessageSquare, Shield, UserCheck, Clock, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [activeTab, setActiveTab] = useState('login');
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#e0e5ec] p-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vyom Vision
            </h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="neo-button">About</Button>
            <Button variant="outline" className="neo-button">Contact</Button>
            <Button 
              variant="outline" className="neo-button"
              onClick={() => router.push('auth/login')}
            >
              Login
            </Button>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl text-black font-bold mb-6 leading-tight">
              Next-Gen Banking Authentication & Support System
            </h2>
            <p className="text-gray-600 mb-8">
              Experience secure banking with advanced facial recognition, intelligent query handling, and personalized support - all in one place.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline" className="neo-button"
                onClick={() => router.push('/auth/login')}
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="neo-button">
                Learn More
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="neo-card p-6">
              <UserCheck className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-black font-semibold mb-2">Facial Recognition</h3>
              <p className="text-sm text-gray-600">Secure authentication with advanced facial recognition technology</p>
            </Card>
            <Card className="neo-card p-6">
              <Mic className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-black font-semibold mb-2">Voice Queries</h3>
              <p className="text-sm text-gray-600">Submit queries through voice recording for convenience</p>
            </Card>
            <Card className="neo-card p-6">
              <MessageSquare className="text-black h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-black font-semibold mb-2">Smart Ticketing</h3>
              <p className="text-sm text-gray-600">Automated ticket generation and routing system</p>
            </Card>
            <Card className="neo-card p-6">
              <Clock className="h-8 w-8 text-orange-600 mb-4" />
              <h3 className="text-black font-semibold mb-2">Priority Handling</h3>
              <p className="text-sm text-gray-600">Intelligent priority-based query resolution</p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}