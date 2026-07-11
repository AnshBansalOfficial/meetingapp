import os
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("NEON_DATABASE_URL") or "sqlite:///./fireflies.db"

if DATABASE_URL.startswith("postgresql://"):
    normalized_database_url = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
elif DATABASE_URL.startswith("postgres://"):
    normalized_database_url = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
else:
    normalized_database_url = DATABASE_URL

if normalized_database_url.startswith("postgres"):
    engine = create_engine(normalized_database_url, pool_pre_ping=True)
else:
    engine = create_engine(normalized_database_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
