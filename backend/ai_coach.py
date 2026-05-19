from dotenv import load_dotenv
from groq import Groq
import os
import json

load_dotenv()

def get_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set!")
    return Groq(api_key=api_key)

# ─── CV REVIEWER ───────────────────────────────────────────
def review_cv(cv_text: str) -> dict:
    client = get_client()
    prompt = f"""You are an expert African career coach and CV consultant with 20 years experience.
Review this CV and respond ONLY with valid JSON:
{{
  "overall_score": <number 0-100>,
  "grade": "<A/B/C/D/F>",
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "missing_sections": ["<missing 1>", "<missing 2>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"],
  "ats_score": <number 0-100>,
  "ats_tips": ["<ATS tip 1>", "<ATS tip 2>"],
  "rewritten_summary": "<A powerful rewritten professional summary for this person>",
  "job_titles": ["<suitable job title 1>", "<suitable job title 2>", "<suitable job title 3>"]
}}

CV Content:
{cv_text[:6000]}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=2000
    )
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


# ─── INTERVIEW COACH ───────────────────────────────────────
def generate_interview(job_title: str, experience: str) -> dict:
    client = get_client()
    prompt = f"""You are an expert interview coach specializing in African job markets.
Generate interview questions and model answers for:
Job Title: {job_title}
Experience Level: {experience}

Respond ONLY with valid JSON:
{{
  "job_title": "{job_title}",
  "questions": [
    {{
      "id": 1,
      "category": "<Technical/Behavioral/Situational>",
      "question": "<interview question>",
      "model_answer": "<detailed model answer>",
      "tips": "<quick tip for answering>"
    }}
  ]
}}
Generate exactly 6 questions covering different categories."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=3000
    )
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


def score_answer(question: str, answer: str, job_title: str) -> dict:
    client = get_client()
    prompt = f"""You are an expert interview coach. Score this interview answer.
Job: {job_title}
Question: {question}
Candidate Answer: {answer}

Respond ONLY with valid JSON:
{{
  "score": <number 0-100>,
  "grade": "<Excellent/Good/Average/Poor>",
  "feedback": "<detailed feedback>",
  "what_was_good": "<what they did well>",
  "what_to_improve": "<specific improvements>",
  "better_answer": "<a stronger version of their answer>"
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


# ─── SALARY ADVISOR ────────────────────────────────────────
def get_salary_advice(job_title: str, experience: str, location: str, skills: str) -> dict:
    client = get_client()
    prompt = f"""You are a salary expert for African job markets especially Nigeria.
Provide salary insights for:
Job Title: {job_title}
Experience: {experience}
Location: {location}
Skills: {skills}

Respond ONLY with valid JSON:
{{
  "job_title": "{job_title}",
  "location": "{location}",
  "salary_range": {{
    "minimum": "<amount in NGN and USD>",
    "average": "<amount in NGN and USD>",
    "maximum": "<amount in NGN and USD>"
  }},
  "market_demand": "<High/Medium/Low>",
  "negotiation_tips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "skills_that_increase_salary": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "best_companies": ["<company 1>", "<company 2>", "<company 3>"],
  "career_growth": "<salary growth projection over 5 years>",
  "negotiation_script": "<a word-for-word salary negotiation script>"
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=2000
    )
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


# ─── CAREER ROADMAP ────────────────────────────────────────
def generate_roadmap(current_role: str, target_role: str, experience: str) -> dict:
    client = get_client()
    prompt = f"""You are a career strategist specializing in African tech and professional markets.
Create a detailed career roadmap:
Current Role: {current_role}
Target Role: {target_role}
Years of Experience: {experience}

Respond ONLY with valid JSON:
{{
  "current_role": "{current_role}",
  "target_role": "{target_role}",
  "estimated_time": "<realistic time to achieve goal>",
  "difficulty": "<Easy/Medium/Hard/Very Hard>",
  "steps": [
    {{
      "phase": "<Phase 1: Foundation>",
      "duration": "<3 months>",
      "actions": ["<action 1>", "<action 2>"],
      "skills_to_learn": ["<skill 1>", "<skill 2>"],
      "milestone": "<what success looks like>"
    }}
  ],
  "free_resources": ["<resource 1>", "<resource 2>", "<resource 3>"],
  "certifications": ["<cert 1>", "<cert 2>"],
  "salary_progression": "<expected salary at each stage>",
  "motivation": "<an inspiring message for this journey>"
}}
Generate exactly 4 phases."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=3000
    )
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


# ─── COVER LETTER WRITER ───────────────────────────────────
def write_cover_letter(name: str, job_title: str, company: str, experience: str, skills: str) -> dict:
    client = get_client()
    prompt = f"""You are an expert cover letter writer for African professionals.
Write a powerful cover letter for:
Name: {name}
Job Title: {job_title}
Company: {company}
Experience: {experience}
Key Skills: {skills}

Respond ONLY with valid JSON:
{{
  "subject_line": "<email subject line>",
  "cover_letter": "<full professional cover letter>",
  "key_highlights": ["<highlight 1>", "<highlight 2>", "<highlight 3>"],
  "tips": "<tips for submitting this application>"
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=2000
    )
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


# ─── CAREER CHAT ───────────────────────────────────────────
def career_chat(message: str, history: list) -> str:
    client = get_client()
    messages = [
        {
            "role": "system",
            "content": """You are CareerCoach Africa — an expert AI career advisor 
specializing in African job markets, especially Nigeria. You help with:
- CV/Resume advice
- Interview preparation  
- Salary negotiation
- Career growth strategies
- Job search tips
- Professional development
Always give practical, actionable advice relevant to the African context.
Be encouraging, professional, and specific."""
        }
    ]
    for msg in history[-10:]:
        messages.append(msg)
    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
        max_tokens=1000
    )
    return response.choices[0].message.content

# ─── DAILY CAREER TIP ──────────────────────────────────────
def get_daily_tip() -> dict:
    client = get_client()
    prompt = """You are CareerCoach Africa. Generate a powerful daily career tip for African professionals.
Respond ONLY with valid JSON:
{
  "tip": "<one powerful actionable career tip>",
  "category": "<Networking/Skills/Mindset/Job Search/Salary>",
  "action": "<one specific thing to do today>"
}"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.9,
        max_tokens=300
    )
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())