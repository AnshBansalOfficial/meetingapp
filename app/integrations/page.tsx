'use client';

import { Header } from '@/components/header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const integrations = [
  {
    name: 'Zoom',
    description: 'Direct recording integration with Zoom meetings',
    status: 'coming-soon',
  },
  {
    name: 'Google Meet',
    description: 'Automatic meeting capture from Google Meet',
    status: 'coming-soon',
  },
  {
    name: 'Microsoft Teams',
    description: 'Seamless integration with Teams meetings',
    status: 'coming-soon',
  },
  {
    name: 'Slack',
    description: 'Share transcripts and summaries in Slack',
    status: 'coming-soon',
  },
  {
    name: 'Google Calendar',
    description: 'Sync meetings from your calendar',
    status: 'coming-soon',
  },
  {
    name: 'Salesforce',
    description: 'Log calls and meetings in Salesforce',
    status: 'coming-soon',
  },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Meetings
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Integrations</h1>
          <p className="text-muted-foreground">
            Connect Fireflies with your favorite tools and platforms
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-100">
            More integrations coming soon! We're actively building connectors for all major
            meeting and productivity platforms.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="bg-card border border-border rounded-lg p-6 hover:border-border/80 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {integration.name}
                  </h3>
                </div>
                <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 text-xs font-medium rounded">
                  Coming Soon
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {integration.description}
              </p>

              <button
                disabled
                className="w-full px-4 py-2 bg-background border border-border text-muted-foreground rounded font-medium cursor-not-allowed opacity-50"
              >
                Connect
              </button>
            </div>
          ))}
        </div>

        {/* Custom Integration CTA */}
        <div className="mt-12 bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Need a custom integration?
          </h3>
          <p className="text-muted-foreground mb-4">
            Contact our team to discuss your specific integration requirements.
          </p>
          <button className="px-6 py-2 bg-accent text-accent-foreground rounded font-medium hover:bg-accent/90 transition-colors">
            Contact Sales
          </button>
        </div>
      </main>
    </div>
  );
}
