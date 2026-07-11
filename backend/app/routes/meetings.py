import json
from typing import List, Optional
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import ActionItem, Meeting, Summary, TranscriptLine

router = APIRouter(tags=['meetings'])

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    startTime: datetime
    endTime: Optional[datetime] = None
    participants: Optional[List[str]] = None
    primarySpeaker: Optional[str] = None

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    participants: Optional[List[str]] = None
    primarySpeaker: Optional[str] = None

class TranscriptLinePayload(BaseModel):
    speakerId: str
    speakerName: str
    text: str
    startTime: float
    endTime: float

class TranscriptPayload(BaseModel):
    lines: List[TranscriptLinePayload]

class SummaryPayload(BaseModel):
    title: str
    summary: str
    keyTopics: Optional[List[str]] = None

class ActionItemPayload(BaseModel):
    title: str
    description: Optional[str] = None
    assignedTo: Optional[str] = None
    dueDate: Optional[datetime] = None

class ActionItemUpdatePayload(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assignedTo: Optional[str] = None
    dueDate: Optional[datetime] = None

class SpeakerPayload(BaseModel):
    name: str
    email: Optional[str] = None
    avatar: Optional[str] = None

def _parse_json_list(value: Optional[object]) -> list:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else []
        except json.JSONDecodeError:
            return []
    return []


def serialize_meeting(meeting: Meeting) -> dict:
    return {
        'id': meeting.id,
        'userId': meeting.userId,
        'title': meeting.title,
        'description': meeting.description,
        'startTime': meeting.startTime.isoformat() if meeting.startTime else None,
        'endTime': meeting.endTime.isoformat() if meeting.endTime else None,
        'duration': meeting.duration,
        'participants': _parse_json_list(meeting.participants),
        'primarySpeaker': meeting.primarySpeaker,
    }


@router.get('/meetings')
def list_meetings(db: Session = Depends(get_db)):
    meetings = db.query(Meeting).order_by(Meeting.startTime.desc()).all()
    return [serialize_meeting(m) for m in meetings]

@router.get('/meetings/{meeting_id}')
def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail='Meeting not found')
    return serialize_meeting(meeting)

@router.post('/meetings', status_code=201)
def create_meeting(payload: MeetingCreate, db: Session = Depends(get_db)):
    meeting = Meeting(
        id=str(uuid4()),
        userId='demo-user-001',
        title=payload.title,
        description=payload.description,
        startTime=payload.startTime,
        endTime=payload.endTime,
        duration=int((payload.endTime - payload.startTime).total_seconds() // 60) if payload.endTime else None,
        participants=json.dumps(payload.participants or []),
        primarySpeaker=payload.primarySpeaker,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return serialize_meeting(meeting)

@router.put('/meetings/{meeting_id}')
def update_meeting(meeting_id: str, payload: MeetingUpdate, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail='Meeting not found')

    if payload.title is not None:
        meeting.title = payload.title
    if payload.description is not None:
        meeting.description = payload.description
    if payload.participants is not None:
        meeting.participants = json.dumps(payload.participants)
    if payload.primarySpeaker is not None:
        meeting.primarySpeaker = payload.primarySpeaker

    db.commit()
    db.refresh(meeting)
    return serialize_meeting(meeting)

@router.delete('/meetings/{meeting_id}', status_code=204)
def delete_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting:
        db.delete(meeting)
        db.commit()
    return None

@router.get('/meetings/{meeting_id}/transcript')
def get_transcript(meeting_id: str, db: Session = Depends(get_db)):
    lines = db.query(TranscriptLine).filter(TranscriptLine.meetingId == meeting_id).order_by(TranscriptLine.lineOrder).all()
    return [
        {
            'id': line.id,
            'speakerName': line.speakerName,
            'text': line.text,
            'startTime': line.startTime,
            'endTime': line.endTime,
            'lineOrder': line.lineOrder,
        }
        for line in lines
    ]

@router.post('/meetings/{meeting_id}/transcript')
def add_transcript(meeting_id: str, payload: TranscriptPayload, db: Session = Depends(get_db)):
    for index, line in enumerate(payload.lines):
        db.add(
            TranscriptLine(
                id=str(uuid4()),
                meetingId=meeting_id,
                speakerId=line.speakerId,
                speakerName=line.speakerName,
                text=line.text,
                startTime=str(line.startTime),
                endTime=str(line.endTime),
                lineOrder=index,
            )
        )
    db.commit()
    return {'meetingId': meeting_id, 'lines': payload.lines}

@router.get('/meetings/{meeting_id}/summary')
def get_summary(meeting_id: str, db: Session = Depends(get_db)):
    summary = db.query(Summary).filter(Summary.meetingId == meeting_id).first()
    if not summary:
        return None
    return {
        'id': summary.id,
        'title': summary.title,
        'summary': summary.summary,
        'keyTopics': json.loads(summary.keyTopics or '[]'),
    }

@router.post('/meetings/{meeting_id}/summary')
def create_summary(meeting_id: str, payload: SummaryPayload, db: Session = Depends(get_db)):
    summary = Summary(
        id=str(uuid4()),
        meetingId=meeting_id,
        title=payload.title,
        summary=payload.summary,
        keyTopics=json.dumps(payload.keyTopics or []),
    )
    db.add(summary)
    db.commit()
    db.refresh(summary)
    return {
        'id': summary.id,
        'meetingId': meeting_id,
        **payload.model_dump(),
    }

@router.get('/meetings/{meeting_id}/action-items')
def list_action_items(meeting_id: str, db: Session = Depends(get_db)):
    items = db.query(ActionItem).filter(ActionItem.meetingId == meeting_id).all()
    return [
        {
            'id': item.id,
            'meetingId': item.meetingId,
            'title': item.title,
            'description': item.description,
            'assignedTo': item.assignedTo,
            'status': item.status,
            'dueDate': item.dueDate.isoformat() if item.dueDate else None,
        }
        for item in items
    ]

@router.post('/meetings/{meeting_id}/action-items')
def create_action_item(meeting_id: str, payload: ActionItemPayload, db: Session = Depends(get_db)):
    item = ActionItem(
        id=str(uuid4()),
        meetingId=meeting_id,
        title=payload.title,
        description=payload.description,
        assignedTo=payload.assignedTo,
        dueDate=payload.dueDate,
        status='pending',
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {
        'id': item.id,
        'meetingId': meeting_id,
        **payload.model_dump(),
        'status': 'pending',
    }

@router.put('/action-items/{action_item_id}')
def update_action_item(action_item_id: str, payload: ActionItemUpdatePayload, db: Session = Depends(get_db)):
    item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail='Action item not found')

    if payload.title is not None:
        item.title = payload.title
    if payload.description is not None:
        item.description = payload.description
    if payload.status is not None:
        item.status = payload.status
    if payload.assignedTo is not None:
        item.assignedTo = payload.assignedTo
    if payload.dueDate is not None:
        item.dueDate = payload.dueDate

    db.commit()
    db.refresh(item)
    return {'id': item.id, **payload.model_dump(exclude_none=True)}

@router.delete('/action-items/{action_item_id}', status_code=204)
def delete_action_item(action_item_id: str, db: Session = Depends(get_db)):
    item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return None

@router.get('/meetings/{meeting_id}/speakers')
def list_speakers(meeting_id: str):
    return [
        {'id': 'speaker-1', 'meetingId': meeting_id, 'name': 'Alice Johnson', 'email': 'alice@company.com', 'avatar': None},
        {'id': 'speaker-2', 'meetingId': meeting_id, 'name': 'Bob Smith', 'email': 'bob@company.com', 'avatar': None},
    ]

@router.post('/meetings/{meeting_id}/speakers')
def create_speaker(meeting_id: str, payload: SpeakerPayload):
    return {'id': 'speaker-created', 'meetingId': meeting_id, **payload.model_dump()}
