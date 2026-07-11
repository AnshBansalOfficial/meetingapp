'use client';

import { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { getMeetings } from './actions/meetings';
import { CreateMeetingModal } from '@/components/create-meeting-modal';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { Search, Plus, Clock, Users } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  duration: number | null;
  participants: string[] | null;
  description: string | null;
}

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'title' | 'participant' | 'date'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadMeetings = async () => {
    try {
      setIsLoading(true);
      const data = await getMeetings();
      setMeetings(data as Meeting[]);
    } catch (error) {
      console.error('Failed to load meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const filteredMeetings = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = meetings.filter((meeting) => {
      if (!normalizedQuery) return true;

      const participantText = (meeting.participants || []).join(' ').toLowerCase();
      const meetingDate = format(new Date(meeting.startTime), 'MMM d, yyyy').toLowerCase();
      const haystack = [
        meeting.title,
        meeting.description || '',
        participantText,
        meetingDate,
      ]
        .join(' ')
        .toLowerCase();

      if (filterBy === 'title') {
        return meeting.title.toLowerCase().includes(normalizedQuery);
      }

      if (filterBy === 'participant') {
        return participantText.includes(normalizedQuery);
      }

      if (filterBy === 'date') {
        return meetingDate.includes(normalizedQuery);
      }

      return haystack.includes(normalizedQuery);
    });

    return filtered.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [meetings, searchQuery, filterBy, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full px-6 py-12">
        {/* Header Section - Centered */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-3">Meetings</h1>
          <p className="text-lg text-muted-foreground">Access your meeting recordings and transcripts</p>
        </div>

        {/* Search and Filter Section - Centered */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title, participant, date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as 'all' | 'title' | 'participant' | 'date')}
              className="px-3 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All fields</option>
              <option value="title">Title</option>
              <option value="participant">Participant</option>
              <option value="date">Date</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              New Meeting
            </button>
          </div>
        </div>

        {/* Meetings Grid - Centered Container */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading meetings...</p>
                </div>
              </div>
            ) : filteredMeetings.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">No meetings found</p>
                  <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Your First Meeting
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetings.map((meeting) => (
              <Link key={meeting.id} href={`/meeting/${meeting.id}`}>
                <div className="group h-full p-6 bg-card border border-border rounded-lg hover:border-accent/50 hover:bg-card/80 transition-all cursor-pointer">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                      {meeting.title}
                    </h3>
                  </div>

                  {meeting.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {meeting.description}
                    </p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {format(new Date(meeting.startTime), 'MMM d, yyyy • h:mm a')}
                      </span>
                    </div>
                    
                    {meeting.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{meeting.duration} minutes</span>
                      </div>
                    )}

                    {meeting.participants && meeting.participants.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{meeting.participants.length} participants</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(meeting.startTime), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadMeetings}
      />
    </div>
  );
}
