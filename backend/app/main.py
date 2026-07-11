import json
from datetime import datetime, timedelta
from uuid import uuid4

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import Base, SessionLocal, engine
from backend.app.models import ActionItem, Meeting, Summary, TranscriptLine
from backend.app.routes import meetings

app = FastAPI(title='Fireflies Backend', version='1.0.0')


def seed_demo_data() -> None:
    with SessionLocal() as db:
        if db.query(Meeting).count() > 0:
            return

        meetings_data = [
            {
                'title': 'Q4 Planning & Strategy',
                'description': 'High-level planning for Q4 product initiatives.',
                'start_time': datetime.utcnow() - timedelta(days=5),
                'end_time': datetime.utcnow() - timedelta(days=5, hours=1),
                'duration': 90,
                'participants': ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
                'primary_speaker': 'Alice Johnson',
                'summary': 'The team aligned on growth experiments, hiring readiness, and a roadmap for the next quarter.',
                'topics': ['Planning', 'Roadmap', 'Hiring'],
                'action_items': ['Draft roadmap', 'Prepare hiring brief'],
                'transcript': [
                    ('Alice Johnson', 'We aligned on the Q4 strategy and agreed to prioritize growth experiments.'),
                    ('Bob Smith', 'The team will draft the roadmap and share it by Friday.'),
                ],
            },
            {
                'title': 'Engineering Weekly Standup',
                'description': 'Team sync on shipping progress and blockers.',
                'start_time': datetime.utcnow() - timedelta(days=1),
                'end_time': datetime.utcnow() - timedelta(days=1, hours=0, minutes=30),
                'duration': 30,
                'participants': ['Alice Johnson', 'David Chen', 'Emma Wilson'],
                'primary_speaker': 'Alice Johnson',
                'summary': 'The team reviewed shipping progress, deployment issues, and testing readiness for the sprint.',
                'topics': ['Shipping', 'Testing', 'Blockers'],
                'action_items': ['Review deployment logs', 'Pair on code review'],
                'transcript': [
                    ('Alice Johnson', 'We wrapped the sprint work and are ready for the release checklist.'),
                    ('David Chen', 'I will review the rollout logs before the noon sync.'),
                ],
            },
        ]

        for item in meetings_data:
            meeting = Meeting(
                id=str(uuid4()),
                userId='demo-user-001',
                title=item['title'],
                description=item['description'],
                startTime=item['start_time'],
                endTime=item['end_time'],
                duration=item['duration'],
                participants=json.dumps(item['participants']),
                primarySpeaker=item['primary_speaker'],
            )
            db.add(meeting)
            db.flush()

            db.add(
                Summary(
                    id=str(uuid4()),
                    meetingId=meeting.id,
                    title='Meeting Summary',
                    summary=item['summary'],
                    keyTopics=json.dumps(item['topics']),
                )
            )

            for action in item['action_items']:
                db.add(
                    ActionItem(
                        id=str(uuid4()),
                        meetingId=meeting.id,
                        title=action,
                        description='Generated from seeded demo data',
                        assignedTo='Demo Team',
                        status='pending',
                    )
                )

            for index, (speaker_name, text) in enumerate(item['transcript']):
                db.add(
                    TranscriptLine(
                        id=str(uuid4()),
                        meetingId=meeting.id,
                        speakerId=f'speaker-{index + 1}',
                        speakerName=speaker_name,
                        text=text,
                        startTime=str(index * 15),
                        endTime=str(index * 15 + 12),
                        lineOrder=index,
                    )
                )

        db.commit()


Base.metadata.create_all(bind=engine)
seed_demo_data()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(meetings.router, prefix='/api')

@app.get('/health')
def health_check():
    return {'status': 'ok'}
