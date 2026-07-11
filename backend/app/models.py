from sqlalchemy import Column, DateTime, Integer, String, Text

from backend.app.database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(String, primary_key=True, index=True)
    userId = Column(String, nullable=False, default="demo-user-001")
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    startTime = Column(DateTime, nullable=False)
    endTime = Column(DateTime, nullable=True)
    duration = Column(Integer, nullable=True)
    participants = Column(Text, default="[]")
    primarySpeaker = Column(String, nullable=True)


class TranscriptLine(Base):
    __tablename__ = "transcript_lines"

    id = Column(String, primary_key=True, index=True)
    meetingId = Column(String, nullable=False)
    speakerId = Column(String, nullable=False)
    speakerName = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    startTime = Column(String, nullable=False)
    endTime = Column(String, nullable=False)
    lineOrder = Column(Integer, nullable=False)


class Summary(Base):
    __tablename__ = "summaries"

    id = Column(String, primary_key=True, index=True)
    meetingId = Column(String, nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    keyTopics = Column(Text, default="[]")


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(String, primary_key=True, index=True)
    meetingId = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    assignedTo = Column(String, nullable=True)
    status = Column(String, default="pending")
    dueDate = Column(DateTime, nullable=True)

