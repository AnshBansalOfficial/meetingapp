'use client';

import { Header } from '@/components/header';
import { ArrowLeft, Bell, Shield, Palette, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    meetingReminders: true,
    weeklyDigest: false,
    darkMode: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Meetings
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and account</p>
        </div>

        {/* Profile Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
              <Users className="w-8 h-8 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Demo User</h2>
              <p className="text-sm text-muted-foreground">demo@fireflies.ai</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-accent text-accent-foreground rounded font-medium hover:bg-accent/90 transition-colors">
              Edit Profile
            </button>
            <button className="w-full px-4 py-2 border border-border text-foreground rounded font-medium hover:bg-card transition-colors">
              Change Password
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'emailNotifications',
                label: 'Email Notifications',
                description: 'Receive emails about meeting transcripts',
              },
              {
                key: 'meetingReminders',
                label: 'Meeting Reminders',
                description: 'Get reminded before upcoming meetings',
              },
              {
                key: 'weeklyDigest',
                label: 'Weekly Digest',
                description: 'Receive a summary of your meetings each week',
              },
            ].map((setting) => (
              <div
                key={setting.key}
                className="flex items-start justify-between p-3 bg-background rounded border border-border"
              >
                <div>
                  <p className="font-medium text-foreground">{setting.label}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <button
                  onClick={() =>
                    handleToggle(setting.key as keyof typeof settings)
                  }
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    settings[setting.key as keyof typeof settings]
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-background border border-border text-foreground'
                  }`}
                >
                  {settings[setting.key as keyof typeof settings]
                    ? 'On'
                    : 'Off'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
          </div>

          <div className="space-y-3">
            <button className="w-full px-4 py-2 border border-border text-foreground rounded font-medium hover:bg-card transition-colors text-left">
              Two-Factor Authentication
            </button>
            <button className="w-full px-4 py-2 border border-border text-foreground rounded font-medium hover:bg-card transition-colors text-left">
              Active Sessions
            </button>
            <button className="w-full px-4 py-2 border border-border text-foreground rounded font-medium hover:bg-card transition-colors text-left">
              Download Your Data
            </button>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          </div>

          <div className="flex items-start justify-between p-3 bg-background rounded border border-border">
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Currently enabled</p>
            </div>
            <span className="px-4 py-2 bg-accent text-accent-foreground rounded font-medium">
              On
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
