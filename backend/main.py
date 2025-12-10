from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from database import Base, engine, SessionLocal
import models
from schemas import ChatRequest, ChatResponse, ReminderCreate, ReminderOut, CaregiverSeniorSummary
from sentiment import simple_sentiment

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SereneCare API")


# --- DB dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Seed a couple of seniors if not exist (for demo) ---
def seed_users():
    db = SessionLocal()
    try:
        if db.query(models.User).count() == 0:
            a = models.User(name="Asha", role="senior")
            r = models.User(name="Ravi", role="senior")
            cg = models.User(name="Family Caregiver", role="caregiver")
            db.add_all([a, r, cg])
            db.commit()
    finally:
        db.close()


seed_users()


@app.get("/")
def root():
    return {"status": "running"}


# ---------- CHAT ENDPOINT ----------
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    # 1) Save user message
    user_msg = models.ChatMessage(
        user_id=req.user_id,
        sender="user",
        text=req.message
    )
    db.add(user_msg)

    # 2) Analyze sentiment
    mood_label, mood_score = simple_sentiment(req.message)
    mood_entry = models.MoodEntry(
        user_id=req.user_id,
        mood=mood_label,
        score=mood_score
    )
    db.add(mood_entry)

    # 3) Create reply
    if mood_label == "negative":
        reply_text = (
            "I'm sorry you're feeling this way. "
            "You are not alone, and I'm here to listen. "
            "Would you like your caregiver to check in on you?"
        )
    elif mood_label == "positive":
        reply_text = "I'm glad to hear that. Let's keep this positivity going."
    else:
        reply_text = "Thank you for sharing. I'm here whenever you want to talk."

    # 4) Save bot message
    bot_msg = models.ChatMessage(
        user_id=req.user_id,
        sender="bot",
        text=reply_text
    )
    db.add(bot_msg)

    db.commit()

    return ChatResponse(reply=reply_text, mood=mood_label)


# ---------- REMINDERS ----------
@app.post("/reminders", response_model=ReminderOut)
def create_reminder(rem: ReminderCreate, db: Session = Depends(get_db)):
    obj = models.Reminder(
        user_id=rem.user_id,
        title=rem.title,
        time=rem.time,
        status="pending"
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@app.get("/users/{user_id}/reminders", response_model=List[ReminderOut])
def list_reminders(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Reminder).filter_by(user_id=user_id).all()


@app.post("/reminders/{rem_id}/complete", response_model=ReminderOut)
def complete_reminder(rem_id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Reminder).filter_by(id=rem_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Reminder not found")
    obj.status = "completed"
    db.commit()
    db.refresh(obj)
    return obj


# ---------- CAREGIVER SUMMARY ----------
@app.get("/caregiver/summary", response_model=List[CaregiverSeniorSummary])
def caregiver_summary(db: Session = Depends(get_db)):
    seniors = db.query(models.User).filter_by(role="senior").all()
    results: List[CaregiverSeniorSummary] = []

    now = datetime.utcnow()
    three_days_ago = now - timedelta(days=3)

    for s in seniors:
        # Last mood
        last_mood_entry = (
            db.query(models.MoodEntry)
            .filter(models.MoodEntry.user_id == s.id)
            .order_by(models.MoodEntry.created_at.desc())
            .first()
        )
        if last_mood_entry:
            last_mood = last_mood_entry.mood
        else:
            last_mood = "unknown"

        # Last user message
        last_msg = (
            db.query(models.ChatMessage)
            .filter(models.ChatMessage.user_id == s.id, models.ChatMessage.sender == "user")
            .order_by(models.ChatMessage.created_at.desc())
            .first()
        )
        last_message = last_msg.text if last_msg else "No messages yet"

        # Risk rules
        negative_count = (
            db.query(models.MoodEntry)
            .filter(
                models.MoodEntry.user_id == s.id,
                models.MoodEntry.created_at >= three_days_ago,
                models.MoodEntry.mood == "negative",
            )
            .count()
        )

        pending_reminders = (
            db.query(models.Reminder)
            .filter(
                models.Reminder.user_id == s.id,
                models.Reminder.status == "pending",
            )
            .count()
        )

        risk = (negative_count >= 2) or (pending_reminders >= 2)

        results.append(
            CaregiverSeniorSummary(
                senior_id=s.id,
                name=s.name,
                last_mood=last_mood,
                last_message=last_message,
                risk=risk,
            )
        )

    return results 
