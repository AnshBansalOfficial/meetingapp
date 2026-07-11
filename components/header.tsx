'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Settings, Zap, LogOut } from 'lucide-react';

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold">🔥</span>
          </div>
          <span className="text-xl font-bold text-foreground">Fireflies</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/integrations"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Zap className="w-4 h-4" />
            Integrations
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-card transition-colors text-foreground"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                <span className="text-xs font-bold text-accent-foreground">D</span>
              </div>
              <span className="text-sm font-medium">Demo</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg p-2 z-50">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-background rounded transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-background rounded transition-colors text-left"
                  onClick={() => {
                    setIsProfileOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
