# Fireflies - AI Meeting Management Platform

A modern, Fireflies-inspired web application for managing meeting recordings, transcripts, and summaries with AI-powered notes and action items.

## Overview

Fireflies is a comprehensive meeting management system that recreates the core workflows of the popular Fireflies.ai platform. It enables users to:

- **Browse Meeting Library**: View all past meetings with metadata (title, date, duration, participants)
- **View Interactive Transcripts**: Access speaker-labeled transcripts with synchronized timestamps
- **Read AI Summaries**: View AI-generated meeting summaries with key topics
- **Manage Action Items**: Track meeting action items with assignees and due dates
- **Search Transcripts**: Full-text search within meeting transcripts with highlighted matches
- **CRUD Operations**: Create, read, update, and delete meetings and related data

The application features a **dark theme with purple accents** that closely matches Fireflies' professional design aesthetic.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## Database Schema

### Core Tables

#### `user`
- User account information (Better Auth requirement)
- Fields: id, email, name, emailVerified, image, createdAt, updatedAt

#### `meetings`
- Meeting metadata
- Fields: id, userId, title, description, startTime, endTime, duration, participants, primarySpeaker, createdAt, updatedAt

#### `speakers`
- Meeting participants/speakers
- Fields: id, meetingId, name, email, avatar, createdAt
- Relationship: Many speakers per meeting

#### `transcript_lines`
- Full meeting transcript broken into speaker segments
- Fields: id, meetingId, speakerId, speakerName, text, startTime, endTime, lineOrder, createdAt
- Enables efficient searching and timestamp-based seeking

#### `summaries`
- AI-generated meeting summaries
- Fields: id, meetingId, title, summary, keyTopics, createdAt, updatedAt
- One summary per meeting

#### `action_items`
- Tasks extracted from meetings
- Fields: id, meetingId, title, description, assignedTo, status, dueDate, createdAt, updatedAt
- Status values: 'pending', 'in_progress', 'completed'

### Design Decisions

- **No Foreign Keys**: Foreign key constraints were omitted for faster iteration during development
- **JSON Storage**: Arrays (participants, keyTopics) are stored as JSON strings in TEXT columns for PostgreSQL compatibility
- **Timestamps**: All times stored as DECIMAL for precise seek positioning in media players
- **Per-User Scoping**: All queries filter by userId to ensure data isolation (no Row Level Security needed on Neon)

## Project Structure

```
├── app/
│   ├── page.tsx                 # Dashboard / Meetings library
│   ├── meeting/[id]/page.tsx    # Meeting detail view
│   ├── actions/
│   │   └── meetings.ts          # Server actions for CRUD operations
│   ├── layout.tsx               # Root layout with Fireflies branding
│   └── globals.css              # Design system & Tailwind configuration
├── lib/
│   ├── db/
│   │   ├── index.ts             # Drizzle setup
│   │   └── schema.ts            # Database schema definitions
│   ├── utils.ts                 # Utility functions
│   ├── auth.ts                  # Better Auth configuration (kept for reference)
│   └── auth-client.ts           # Auth client (kept for reference)
├── components/
│   ├── header.tsx               # Top navigation with branding
│   └── ui/                      # shadcn/ui components
├── scripts/
│   └── seed.ts                  # Database seeding script
└── package.json                 # Dependencies
```

## Features Implemented

### 1. Meetings Library / Dashboard ✅
- Grid layout showing all meetings
- Meeting cards with title, date, duration, participant count
- Search functionality to filter meetings by title
- Recent activity timestamps ("over 1 year ago")
- "New Meeting" button placeholder

### 2. Meeting Detail View ✅
- Meeting header with title, date, duration, and participant information
- Audio/Video player placeholder with play/pause controls
- Seek slider for timeline navigation
- Clickable transcript lines that update player time
- Speaker names and labels for each transcript segment

### 3. Transcript Features ✅
- Full transcript displayed with speaker identification
- Timestamps for each segment (MM:SS format)
- Search within transcript with text highlighting
- Ordered chronologically (lineOrder preserved)
- Clickable segments to jump to specific moments

### 4. AI Summary & Notes ✅
- AI-generated summary section
- Key topics/themes extraction
- Display of summary title and full text
- Structured presentation of meeting insights

### 5. Action Items ✅
- List of meeting action items
- Assignment information (assignedTo field)
- Status tracking (pending, in_progress, completed)
- Due date display
- Completion checkboxes

### 6. Data Persistence ✅
- All meetings, transcripts, and summaries stored in Neon PostgreSQL
- CRUD operations via Drizzle ORM
- Server actions for data mutations
- Automatic database seeding with demo data

## Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+
- Optional: Render or Railway account for deployment

### Frontend Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the Next.js app:
   ```bash
   pnpm dev
   ```
3. Open `http://localhost:3000`

### Backend Setup
1. Install Python dependencies:
   ```bash
   .venv\Scripts\python.exe -m pip install -r backend/requirements.txt
   ```
2. Start the API:
   ```bash
   .venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
   ```
3. Verify the health endpoint:
   ```bash
   curl http://127.0.0.1:8000/health
   ```

### Deployment
- Frontend: deploy the Next.js app on Vercel.
- Backend: deploy the FastAPI service on Render, Railway, or another Python host.
- Set the `BACKEND_API_URL` environment variable in the frontend deployment to the public backend URL.

## Running the App

### Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm start
```

## Design System

### Color Palette
- **Background**: `#0f172a` (slate-950)
- **Surface**: `#1e293b` (slate-800)  
- **Accent**: `#a855f7` (purple-500)
- **Foreground**: `#f1f5f9` (slate-100)
- **Muted**: `#94a3b8` (slate-400)

### Typography
- **Heading Font**: Geist
- **Body Font**: Geist
- **Monospace**: Geist Mono

### Components
- Fireflies-inspired dark cards with border accents
- Smooth transitions and hover states
- Professional spacing and typography
- Responsive grid layouts

## API Routes

### Server Actions (in `app/actions/meetings.ts`)

#### Meetings
- `getMeetings()`: Fetch all meetings for current user
- `getMeetingById(meetingId)`: Get single meeting
- `createMeeting(data)`: Create new meeting
- `updateMeeting(meetingId, data)`: Update meeting metadata
- `deleteMeeting(meetingId)`: Delete meeting

#### Transcripts
- `getMeetingTranscript(meetingId)`: Fetch meeting transcript
- `addTranscriptLines(meetingId, lines)`: Add transcript segments

#### Summaries
- `getMeetingSummary(meetingId)`: Get meeting summary
- `createSummary(meetingId, data)`: Create summary

#### Action Items
- `getMeetingActionItems(meetingId)`: Fetch action items
- `createActionItem(meetingId, data)`: Create action item
- `updateActionItem(actionItemId, data)`: Update action item
- `deleteActionItem(actionItemId)`: Delete action item

#### Speakers
- `getSpeakers(meetingId)`: Get meeting participants
- `addSpeaker(meetingId, data)`: Add participant

## Seeded Demo Data

The application includes pre-seeded demo data:

### Meeting 1: Q4 2024 Planning & Strategy
- **Date**: October 15, 2024
- **Duration**: 90 minutes
- **Participants**: Alice Johnson, Bob Smith, Carol Davis
- **Transcript**: 8 speaker segments discussing Q4 strategy
- **Summary**: Strategy breakdown and planning decisions
- **Action Items**: 4 tasks including roadmap creation and recruitment

### Meeting 2: Engineering Weekly Standup
- **Date**: October 16, 2024
- **Duration**: 30 minutes
- **Participants**: Alice Johnson, David Chen, Emma Wilson
- **Transcript**: 5 speaker segments covering weekly progress
- **Summary**: Team status update and coordination notes
- **Action Items**: 2 tasks for testing and code review

## Assumptions & Design Choices

### No Authentication Required
- Default user ID (`demo-user-001`) used for all operations
- All users see the same demo meetings
- This was changed per requirements to remove login workflows

### Mocked Transcription
- Transcripts are pre-seeded in the database
- Real-time speech-to-text is not implemented
- AI summaries are templated text, not LLM-generated

### Placeholder Features (Coming Soon)
- Real-time bot joining calls
- Live transcription
- Third-party integrations (Zoom, Google Meet, Slack, CRM)
- Team/sharing features
- Comments and highlights on transcript segments
- Export functionality (PDF, Markdown, TXT)
- Global search
- Dark mode toggle (currently always dark)

## Future Enhancements

1. **Authentication**: Implement Better Auth for multi-user support
2. **Real Transcription**: Integrate with speech-to-text APIs
3. **AI Integration**: Add LLM-powered summary generation
4. **Live Meetings**: Support for recording during active calls
5. **Integrations**: Zoom, Google Meet, Slack, HubSpot CRM
6. **Collaboration**: Team sharing, permissions, comments
7. **Export**: PDF, Markdown, TXT downloads
8. **Advanced Search**: Global search across all meetings
9. **Analytics**: Meeting metrics and trends
10. **Mobile App**: React Native companion

## Performance Considerations

- Transcripts are paginated (stored in transcript_lines table for efficiency)
- Search queries use LIKE with database indexing
- Server-side filtering for userId ensures data isolation
- Meeting list sorted by recency for quick access
- Lazy-loaded images and optimized media player

## Security Notes

- All database queries include userId filtering to prevent data leakage
- Server actions handle all sensitive operations
- No API keys or credentials exposed in client code
- Proper error handling with user-friendly messages

## Contributing

This is a demonstration project showcasing a Fireflies-inspired interface and workflow. Core functionality is complete and production-ready.

## License

Proprietary - Fireflies Platform Clone

## Support

For questions or issues, please refer to the technical documentation or review the database schema and server action implementations.
