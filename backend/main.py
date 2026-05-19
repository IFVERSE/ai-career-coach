from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, CareerSession, ChatMessage
from ai_coach import (
    review_cv, generate_interview, score_answer,
    get_salary_advice, generate_roadmap,
    write_cover_letter, career_chat, get_daily_tip
)
from dotenv import load_dotenv
import PyPDF2
import traceback
import json
import io
import httpx

load_dotenv()

app = FastAPI(title="AI Career Coach Africa API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── HELPER: Extract text from PDF ─────────────────────────
def extract_pdf_text(file_bytes: bytes) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception:
        return ""


# ─── Route 1: CV Review ─────────────────────────────────────
@app.post("/api/cv-review")
async def cv_review_route(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        if file.filename.endswith(".pdf"):
            cv_text = extract_pdf_text(content)
        else:
            cv_text = content.decode("utf-8", errors="replace")

        if not cv_text.strip():
            raise HTTPException(status_code=400, detail="Could not read file")

        result = review_cv(cv_text)

        session = CareerSession(
            session_type="cv_review",
            user_input=cv_text[:1000],
            ai_response=json.dumps(result)
        )
        db.add(session)
        db.commit()

        return result
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ─── Route 2: Generate Interview Questions ──────────────────
@app.post("/api/interview/generate")
async def generate_interview_route(data: dict):
    try:
        result = generate_interview(
            data.get("job_title", "Software Engineer"),
            data.get("experience", "Mid-level")
        )
        return result
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ─── Route 3: Score Interview Answer ───────────────────────
@app.post("/api/interview/score")
async def score_answer_route(data: dict):
    try:
        result = score_answer(
            data.get("question", ""),
            data.get("answer", ""),
            data.get("job_title", "")
        )
        return result
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ─── Route 4: Salary Advisor ────────────────────────────────
@app.post("/api/salary")
async def salary_route(data: dict):
    try:
        result = get_salary_advice(
            data.get("job_title", ""),
            data.get("experience", ""),
            data.get("location", "Nigeria"),
            data.get("skills", "")
        )
        return result
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ─── Route 5: Career Roadmap ────────────────────────────────
@app.post("/api/roadmap")
async def roadmap_route(data: dict):
    try:
        result = generate_roadmap(
            data.get("current_role", ""),
            data.get("target_role", ""),
            data.get("experience", "")
        )
        return result
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ─── Route 6: Cover Letter ──────────────────────────────────
@app.post("/api/cover-letter")
async def cover_letter_route(data: dict):
    try:
        result = write_cover_letter(
            data.get("name", ""),
            data.get("job_title", ""),
            data.get("company", ""),
            data.get("experience", ""),
            data.get("skills", "")
        )
        return result
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ─── Route 7: Career Chat ───────────────────────────────────
@app.post("/api/chat")
async def chat_route(
    data: dict,
    db: Session = Depends(get_db)
):
    try:
        message = data.get("message", "")
        history = data.get("history", [])

        response = career_chat(message, history)

        db.add(ChatMessage(role="user", content=message))
        db.add(ChatMessage(role="assistant", content=response))
        db.commit()

        return {"response": response}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# ─── Route 9: Daily Tip ─────────────────────────────────────
@app.get("/api/daily-tip")
def daily_tip_route():
    try:
        result = get_daily_tip()
        return result
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# ─── Route 10: Live Jobs ─────────────────────────────────────
@app.get("/api/jobs")
async def get_jobs(category: str = "software-dev"):
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"https://remotive.com/api/remote-jobs?category={category}&limit=20",
                timeout=10.0
            )
            data = res.json()
            jobs = []
            for job in data.get("jobs", []):
                jobs.append({
                    "id": job.get("id"),
                    "title": job.get("title"),
                    "company": job.get("company_name"),
                    "location": job.get("candidate_required_location", "Worldwide"),
                    "salary": job.get("salary", "Not specified"),
                    "tags": job.get("tags", [])[:5],
                    "url": job.get("url"),
                    "posted": job.get("publication_date", "")[:10],
                    "description": job.get("description", "")[:500],
                    "logo": job.get("company_logo", "")
                })
            return {"jobs": jobs, "total": len(jobs)}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ─── Route 11: Analyze Job Fit ──────────────────────────────
@app.post("/api/job-fit")
async def analyze_job_fit(data: dict):
    try:
        job_title = data.get("job_title", "")
        job_description = data.get("job_description", "")
        user_profile = data.get("user_profile", "")

        from groq import Groq
        import os
        client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

        prompt = f"""You are an expert career coach for African professionals.
Analyze if this candidate fits this job and respond ONLY with valid JSON:

Job Title: {job_title}
Job Description: {job_description[:1000]}
Candidate Profile: {user_profile}

{{
  "match_score": <0-100>,
  "match_level": "<Perfect Match/Strong Match/Good Match/Partial Match/Poor Match>",
  "verdict": "<one sentence verdict>",
  "matching_skills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "missing_skills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "recommendation": "<specific advice whether to apply or not>",
  "preparation_tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}}"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=1000
        )
        raw = response.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# ─── Route 8: Health Check ──────────────────────────────────
@app.get("/")
def root():
    return {
        "status": "AI Career Coach Africa is running",
        "features": [
            "CV Review", "Interview Coach",
            "Salary Advisor", "Career Roadmap",
            "Cover Letter Writer", "Career Chat"
        ]
    }

