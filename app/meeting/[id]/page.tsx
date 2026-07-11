'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { ActionItemsPanel } from '@/components/action-items-panel';
import { useToast } from '@/lib/toast-context';
import {
  getMeetingById,
  getMeetingTranscript,
  getMeetingSummary,
  getMeetingActionItems,
  deleteMeeting,
} from '@/app/actions/meetings';
import { format } from 'date-fns';
import { ArrowLeft, Play, Pause, Trash2, Edit2 } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  description: string | null;
  participants: string[] | null;
}

interface TranscriptLine {
  id: string;
  speakerName: string;
  text: string;
  startTime: string;
  endTime: string;
  lineOrder: number;
}

interface Summary {
  id: string;
  title: string;
  summary: string;
  keyTopics: string[] | null;
}

interface ActionItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  assignedTo: string | null;
  dueDate: Date | null;
}

export default function MeetingDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [meetingData, transcriptData, summaryData, actionItemsData] = await Promise.all([
        getMeetingById(meetingId),
        getMeetingTranscript(meetingId),
        getMeetingSummary(meetingId),
        getMeetingActionItems(meetingId),
      ]);

      setMeeting(meetingData as Meeting);
      setTranscript(transcriptData as TranscriptLine[]);
      setSummary(summaryData as Summary);
      setActionItems(actionItemsData as ActionItem[]);
    } catch (error) {
      console.error('Failed to load meeting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [meetingId]);

  const handleDeleteMeeting = async () => {
    try {
      setIsDeleting(true);
      await deleteMeeting(meetingId);
      addToast('Meeting deleted successfully', 'success');
      router.push('/');
    } catch (error) {
      addToast('Failed to delete meeting', 'error');
      console.error('Failed to delete meeting:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const filteredTranscript = searchQuery
    ? transcript.filter((line) =>
        line.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.speakerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transcript;

  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="bg-accent/30 text-foreground">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading meeting...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Meeting not found</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              Back to Meetings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Meetings
        </button>

        {/* Meeting Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{meeting.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>{format(new Date(meeting.startTime), 'MMMM d, yyyy • h:mm a')}</span>
              {meeting.duration && <span>•</span>}
              {meeting.duration && <span>{meeting.duration} minutes</span>}
              {meeting.participants && meeting.participants.length > 0 && (
                <>
                  <span>•</span>
                  <span>{meeting.participants.length} participants</span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-card transition-colors flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 rounded-lg border border-red-800/50 text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Transcript */}
          <div className="lg:col-span-2">
            {/* Media Player */}
            <div className="mb-8 p-6 bg-card border border-border rounded-lg">
              <div className="aspect-video bg-input rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors mx-auto mb-4"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>
                  <p className="text-sm text-muted-foreground">Audio/Video Player</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={meeting.duration ? meeting.duration * 60 : 100}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                  <span>
                    {meeting.duration ? `${meeting.duration}:00` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Transcript Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search transcript..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Transcript */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Transcript</h2>
              {filteredTranscript.length === 0 ? (
                <p className="text-muted-foreground">No transcript entries found.</p>
              ) : (
                filteredTranscript.map((line) => (
                  <div
                    key={line.id}
                    className="p-4 bg-card border border-border rounded-lg hover:border-accent/50 transition-colors cursor-pointer group"
                    onClick={() => setCurrentTime(Number(line.startTime))}
                  >
                    <div className="flex gap-4">
                      <div className="text-sm text-muted-foreground min-w-fit group-hover:text-accent transition-colors">
                        {Math.floor(Number(line.startTime) / 60)}:
                        {String(Math.floor(Number(line.startTime) % 60)).padStart(2, '0')}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-accent mb-1">{line.speakerName}</p>
                        <p className="text-foreground leading-relaxed">
                          {highlightText(line.text)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - Summary & Action Items */}
          <div className="space-y-8">
            {/* Summary */}
            {summary && (
              <div className="p-6 bg-card border border-border rounded-lg">
                <h2 className="text-lg font-semibold text-foreground mb-4">Summary</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {summary.summary}
                </p>

                {summary.keyTopics && summary.keyTopics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Key Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {summary.keyTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Items */}
            <ActionItemsPanel
              meetingId={meetingId}
              actionItems={actionItems}
              onRefresh={loadData}
            />
          </div>
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Meeting"
        message="Are you sure you want to delete this meeting? This action cannot be undone. All transcripts, summaries, and action items will be permanently deleted."
        isLoading={isDeleting}
        onConfirm={handleDeleteMeeting}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
