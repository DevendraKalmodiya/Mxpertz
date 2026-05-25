import os
from sqlalchemy import create_engine, Column, Integer, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from dotenv import load_dotenv

load_dotenv()

# Get the Connection String from Supabase (URI mode)
DATABASE_URL = os.getenv("DATABASE_URL")

# pool_pre_ping ensures the connection is still alive before sending queries
engine = create_engine(
    DATABASE_URL, 
    pool_pre_ping=True,
    connect_args={"sslmode": "require"} # Supabase requires SSL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(Text)
    content = Column(Text)
    # Note: The 'embedding' column is managed via raw SQL or pgvector-python 
    # For a machine test, we handle the vector math in the Gemini/FastAPI layer
    created_at = Column(DateTime(timezone=True), server_default=func.now())

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()