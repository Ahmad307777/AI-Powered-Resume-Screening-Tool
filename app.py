from dotenv import load_dotenv
load_dotenv()  # Load .env variables before anything else

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
import sqlite3
import pandas as pd
import numpy as np
import pickle
import joblib
import warnings
import re
import os
import tempfile
import io
import requests as http_requests
from pathlib import Path
from collections import Counter
import nltk
from nltk.corpus import stopwords
from sklearn.metrics.pairwise import cosine_similarity
from pydantic import BaseModel

# Ensure NLTK resources are available
try:
    nltk.data.find('corpora/stopwords')
except (AttributeError, LookupError):
    nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)

app = FastAPI(title="AI Resume Screening API")

# Enable CORS for React Frontend (running on port 5173 by default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML components
def load_ml_components():
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        cv = pickle.load(open('cv.pickle', 'rb'))
        model = joblib.load('RF.joblib')
    return cv, model

cv, model = load_ml_components()

# Clean text function matching original code
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    sw = set(stopwords.words('english'))
    text = " ".join([word for word in text.split() if word not in sw])
    return text

def get_db_connection():
    conn = sqlite3.connect('resumes.db', check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

# Category mappings matching the retrained 25-class RF model
dict_category = {
    0: 'Advocate',
    1: 'Arts',
    2: 'Automation Testing',
    3: 'Blockchain',
    4: 'Business Analyst',
    5: 'Civil Engineer',
    6: 'Data Science',
    7: 'Database',
    8: 'DevOps Engineer',
    9: 'DotNet Developer',
    10: 'ETL Developer',
    11: 'Electrical Engineering',
    12: 'HR',
    13: 'Hadoop',
    14: 'Health and fitness',
    15: 'Java Developer',
    16: 'Mechanical Engineer',
    17: 'Network Security Engineer',
    18: 'Operations Manager',
    19: 'PMO',
    20: 'Python Developer',
    21: 'SAP Developer',
    22: 'Sales',
    23: 'Testing',
    24: 'Web Designing',
}

def extract_experience_years(text: str) -> int:
    """Extract the highest mentioned years of experience from resume text."""
    patterns = [
        r'(\d+)\+?\s*years?\s+of\s+experience',
        r'experience\s+of\s+(\d+)\+?\s*years?',
        r'(\d+)\+?\s*years?\s+experience',
        r'(\d+)\+?\s*yrs?\s+experience',
    ]
    found = []
    text_lower = text.lower()
    for pat in patterns:
        matches = re.findall(pat, text_lower)
        found.extend([int(m) for m in matches if int(m) <= 40])  # cap at 40 years
    return max(found) if found else 0

def extract_email(text: str) -> str:
    # Strategy 1: Explicitly labeled email (e.g. "Email: user@domain.com") — highest confidence
    labeled = re.search(
        r'(?:email|e-mail|mail|contact)[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})',
        text, re.IGNORECASE
    )
    if labeled:
        return labeled.group(1).strip()

    # Strategy 2: Email preceded by whitespace or newline — isolated in text
    # (pdfplumber preserves spaces so merged-word issue is resolved at source)
    standalone = re.search(
        r'(?:^|[\s])([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})',
        text, re.MULTILINE
    )
    if standalone:
        return standalone.group(1).strip()

    # Strategy 3: Any email anywhere in the text (final fallback)
    generic = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    if generic:
        return generic.group(0).strip()

    return ""

def extract_phone(text: str) -> str:
    patterns = [
        r'(?:\+?92[-.\s]*)?\(?0?3\d{2}\)?[-.\s]*\d{7}', # Pakistani format
        r'(?:\+?\d{1,3}[-.\s]*)?\(?\d{3}\)?[-.\s]*\d{3}[-.\s]*\d{4}', # US/International style
        r'\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,6}', # general numbers
    ]
    for pattern in patterns:
        matches = re.findall(pattern, text)
        for m in matches:
            digits_only = re.sub(r'\D', '', m)
            if 7 <= len(digits_only) <= 15:
                return m.strip()
    return ""

def extract_urls(text: str) -> list:
    url_pattern = re.compile(
        r'https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)'
        r'|'
        r'\b(?:www\.)?linkedin\.com/in/[-a-zA-Z0-9_]+'
        r'|'
        r'\b(?:www\.)?github\.com/[-a-zA-Z0-9_]+'
    , re.IGNORECASE)
    matches = url_pattern.findall(text)
    unique_urls = []
    for m in matches:
        url = m.strip()
        if not url.lower().startswith('http'):
            url = 'https://' + url
        if url not in unique_urls:
            unique_urls.append(url)
    return unique_urls

def extract_name(text: str, filename: str = "") -> str:
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    for line in lines[:3]:
        words = line.split()
        if 2 <= len(words) <= 4:
            if all(w[0].isupper() and w.isalpha() for w in words if w):
                lower_line = line.lower()
                if not any(k in lower_line for k in ["resume", "curriculum", "vitae", "summary", "profile", "contact", "experience", "education", "page", "developer", "engineer"]):
                    return line
    if filename:
        name_part = os.path.splitext(filename)[0]
        name_part = re.sub(r'[-_]', ' ', name_part)
        name_part = re.sub(r'\b(resume|cv|pdf|docx|txt|updated|new|latest|version\d*|202\d)\b', '', name_part, flags=re.IGNORECASE)
        name_part = ' '.join(name_part.split())
        if name_part:
            return name_part.title()
    return ""

class ConfigUpdate(BaseModel):
    position: str
    experience: int

@app.get("/api/config")
def get_config():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Get active position
    cur.execute("SELECT Position, Experience FROM HR")
    active_pos_row = cur.fetchone()
    
    if not active_pos_row:
        conn.close()
        return {
            "position": "Not Set",
            "experience": 0,
            "skills": "",
            "available_positions": sorted(list(dict_category.values()))
        }
        
    position = active_pos_row["Position"]
    experience = active_pos_row["Experience"]
    
    # Get required skills
    cur.execute("SELECT skills FROM skills WHERE LOWER(position)=?", (position.lower(),))
    skills_row = cur.fetchone()
    skills_str = skills_row["skills"] if skills_row else ""
    
    conn.close()
    return {
        "position": position.title(),
        "experience": experience,
        "skills": skills_str,
        "available_positions": sorted(list(dict_category.values()))
    }

@app.post("/api/config")
def update_config(config: ConfigUpdate):
    if config.position not in dict_category.values():
        raise HTTPException(status_code=400, detail=f"Invalid position. Must be one of: {sorted(list(dict_category.values()))}")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("DELETE FROM HR")
        cur.execute("INSERT INTO HR (Position, Experience) VALUES (?, ?)", (config.position.lower(), config.experience))
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
    conn.close()
    return {"message": f"Active recruitment target set to {config.position} (Min Experience: {config.experience} years)"}

@app.post("/api/parse")
async def parse_resume(file: UploadFile = File(...)):
    # Read the file content
    file_bytes = await file.read()
    content = ""
    suffix = Path(file.filename).suffix.lower()
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
        tmp_file.write(file_bytes)
        tmp_file_path = tmp_file.name

    try:
        if suffix == '.txt':
            content = file_bytes.decode('utf-8', errors='ignore')
        elif suffix == '.pdf':
            import pdfplumber
            with pdfplumber.open(tmp_file_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        content += text + '\n'
        elif suffix == '.docx':
            import docx2txt
            content = docx2txt.process(tmp_file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or TXT.")
    except Exception as e:
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)
        raise HTTPException(status_code=500, detail=f"Failed to extract text from resume: {str(e)}")
    finally:
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)
            
    # Extract details
    email = extract_email(content)
    phone = extract_phone(content)
    urls = extract_urls(content)
    name = extract_name(content, file.filename)
    
    # Return comma separated string for urls
    urls_str = ','.join(urls)
    
    return {
        "success": True,
        "name": name,
        "email": email,
        "phone": phone,
        "urls": urls_str,
        "extracted_text": content
    }

@app.post("/api/upload")
async def upload_resume(
    email: str = Form(...),
    fullName: str = Form(...),
    mobile: str = Form(""),
    location: str = Form(...),
    urls: str = Form(""),
    file: UploadFile = File(...)
):
    # Retrieve current active HR position & skills
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT Position FROM HR")
    pos_row = cur.fetchone()
    if not pos_row:
        conn.close()
        raise HTTPException(status_code=400, detail="Recruitment position not configured by HR. Please set it first.")
        
    pos_name = pos_row["Position"]
    
    cur.execute("SELECT skills FROM skills WHERE LOWER(position)=?", (pos_name.lower(),))
    skills_row = cur.fetchone()
    required_skills = [s.strip().lower() for s in skills_row["skills"].split(',') if s.strip()] if skills_row else []
    
    # Read the file content
    file_bytes = await file.read()
    content = ""
    
    # Save file to a temp file to parse it
    suffix = Path(file.filename).suffix.lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
        tmp_file.write(file_bytes)
        tmp_file_path = tmp_file.name

    try:
        if suffix == '.txt':
            content = file_bytes.decode('utf-8', errors='ignore')
        elif suffix == '.pdf':
            import pdfplumber
            with pdfplumber.open(tmp_file_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        content += text + '\n'
        elif suffix == '.docx':
            import docx2txt
            content = docx2txt.process(tmp_file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or TXT.")
    except Exception as e:
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)
        raise HTTPException(status_code=500, detail=f"Failed to extract text from resume: {str(e)}")
    finally:
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)

    if not content.strip():
        raise HTTPException(status_code=400, detail="Extracted text from resume is empty.")

    # Process and Clean Text
    cleaned_text_str = clean_text(content)
    content_lower = content.lower()

    # 1. Keyword Matching Score
    score = 0
    matched_skills_list = []
    missing_skills_list = []
    
    for s in required_skills:
        if s in content_lower:
            score += 1
            matched_skills_list.append(s.title())
        else:
            missing_skills_list.append(s.title())
            
    matched_skills_str = ', '.join(matched_skills_list)
    missing_skills_str = ', '.join(missing_skills_list)
    length = len(required_skills)
    score_percent = (score / length * 100) if length > 0 else 0.0

    # 2. Semantic Cosine Similarity
    try:
        skills_raw_str = skills_row["skills"] if skills_row else ""
        cleaned_req_skills = clean_text(skills_raw_str)
        X_candidate = cv.transform([cleaned_text_str])
        X_skills = cv.transform([cleaned_req_skills])
        cos_sim = cosine_similarity(X_candidate, X_skills)[0][0]
        cos_sim_percent = float(cos_sim * 100)
    except Exception:
        cos_sim_percent = 0.0

    # Decision logic matching the original
    if score_percent >= 50:
        status = "Selected"
        reasoning = f"Strong alignment detected: {score_percent:.1f}% keyword match & {cos_sim_percent:.1f}% semantic similarity. Key matching skills include: {matched_skills_str}."
    else:
        status = "Rejected"
        reasoning = f"Score of {score_percent:.1f}% is below the 50% threshold. Missing core skills: {missing_skills_str}."

    # ML Classification
    try:
        X_pred = cv.transform([cleaned_text_str])
        pred = model.predict(X_pred)
        prediction_id = int(pred[0])
        prediction_label = dict_category[prediction_id]

        # --- Confidence Score via predict_proba ---
        proba = model.predict_proba(X_pred)[0]  # shape: (n_classes,)
        top_confidence = float(proba[prediction_id]) * 100

        # --- Multi-category detection: check if 2nd best is within 15% ---
        sorted_proba = sorted(enumerate(proba), key=lambda x: x[1], reverse=True)
        top1_id, top1_prob = sorted_proba[0]
        top2_id, top2_prob = sorted_proba[1] if len(sorted_proba) > 1 else (top1_id, 0)
        secondary_label = None
        secondary_confidence = 0.0
        if top2_prob > 0 and (top1_prob - top2_prob) < 0.15:
            secondary_label = dict_category.get(top2_id, '')
            secondary_confidence = float(top2_prob) * 100

        # --- Extract years of experience from resume ---
        experience_years = extract_experience_years(content)
        hr_experience_required = cur.execute("SELECT Experience FROM HR").fetchone()
        min_experience = hr_experience_required["Experience"] if hr_experience_required else 0
        experience_ok = experience_years >= min_experience

        prediction_category = dict_category[prediction_id].upper()

        # --- Smart Role Alignment Override ---
        # If the ML model predicts a different role, but the candidate has a strong keyword match (>= 50%)
        # or the target role is their secondary prediction, we align them to the target role.
        is_category_match = (dict_category[prediction_id].lower() == pos_name.lower())
        
        if not is_category_match:
            is_secondary_match = secondary_label and secondary_label.lower() == pos_name.lower()
            if score_percent >= 50 or is_secondary_match:
                is_category_match = True
                reasoning += f" [AI Override: Originally classified as {prediction_category}, but realigned to {pos_name.upper()} due to strong skill match.]"
                prediction_category = pos_name.upper()

        # Check Category Alignment
        if is_category_match:
            # Match succeeded: insert into database
            query = """INSERT INTO employees (Name, Email, Resume, score, location, category, matched_skills, status, reasoning, extracted_text, original_filename, phone, urls) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
            value = (fullName, email, file_bytes, score_percent, location, prediction_category, matched_skills_str, status, reasoning, content, file.filename, mobile, urls)
            cur.execute(query, value)
            conn.commit()
            success = True
            message = "Application successfully submitted."
        else:
            success = False
            message = f"Role Category Mismatch: Classified as {prediction_category}, but target is {pos_name.upper()}."

    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(e)}")

    conn.close()

    return {
        "success": success,
        "message": message,
        "data": {
            "fullName": fullName,
            "email": email,
            "location": location,
            "status": status,
            "category": prediction_category,
            "keywordScore": round(score_percent, 1),
            "semanticScore": round(cos_sim_percent, 1),
            "confidenceScore": round(top_confidence, 1),
            "secondaryCategory": secondary_label,
            "secondaryConfidence": round(secondary_confidence, 1) if secondary_label else None,
            "experienceYears": experience_years,
            "experienceMeetsRequirement": experience_ok,
            "matchedSkills": matched_skills_list,
            "missingSkills": missing_skills_list,
            "reasoning": reasoning
        }
    }

@app.get("/api/candidates")
def get_candidates(category: str = None):
    conn = get_db_connection()
    cur = conn.cursor()
    
    if category:
        cur.execute("SELECT rowid as id, Name, Email, score, location, category, matched_skills, status, reasoning, extracted_text, original_filename, phone, urls FROM employees WHERE LOWER(category) = ? ORDER BY score DESC", (category.lower(),))
    else:
        cur.execute("SELECT rowid as id, Name, Email, score, location, category, matched_skills, status, reasoning, extracted_text, original_filename, phone, urls FROM employees ORDER BY score DESC")
        
    candidates = [dict(row) for row in cur.fetchall()]
    conn.close()
    return candidates

@app.get("/api/candidates/{candidate_id}/resume")
def get_candidate_resume(candidate_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT Name, Resume, original_filename FROM employees WHERE rowid = ?", (candidate_id,))
    row = cur.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Candidate resume not found")
        
    file_bytes = row["Resume"]
    name = row["Name"].replace(" ", "_")
    original_filename = row["original_filename"] or ""
    
    ext = os.path.splitext(original_filename)[1].lower() if original_filename else '.pdf'
    if ext == '.txt':
        media_type = "text/plain"
    elif ext == '.docx':
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:
        media_type = "application/pdf"
    
    # Return file stream
    return Response(
        content=file_bytes,
        media_type=media_type,
        headers={"Content-Disposition": f"inline; filename={name}_Resume{ext}"}
    )

@app.get("/api/analytics")
def get_analytics():
    conn = get_db_connection()
    query = "SELECT rowid as id, Name, Email, score, location, category, matched_skills, status, reasoning FROM employees"
    df = pd.read_sql(query, conn)
    conn.close()
    
    if df.empty:
        return {
            "total_applicants": 0,
            "unique_categories": 0,
            "avg_score": 0.0,
            "primary_location": "N/A",
            "category_distribution": [],
            "score_distribution": [],
            "top_skills": [],
            "geo_distribution": []
        }
        
    # Standard statistics
    total_applicants = len(df)
    unique_categories = int(df['category'].nunique())
    avg_score = float(df['score'].mean())
    primary_location = df['location'].mode()[0] if not df['location'].mode().empty else "N/A"
    
    # Category Distribution
    cat_counts = df['category'].value_counts().reset_index()
    cat_counts.columns = ['category', 'count']
    category_distribution = cat_counts.to_dict(orient='records')
    
    # Average score per category
    avg_score_cat = df.groupby('category')['score'].mean().reset_index()
    avg_score_cat.columns = ['category', 'avg_score']
    avg_score_cat['avg_score'] = avg_score_cat['avg_score'].round(1)
    score_distribution = avg_score_cat.to_dict(orient='records')
    
    # Top Driver Skills
    all_skills = []
    for skills in df['matched_skills'].dropna():
        if skills:
            all_skills.extend([s.strip().title() for s in skills.split(',') if s.strip()])
            
    top_skills = []
    if all_skills:
        skill_counts = Counter(all_skills).most_common(10)
        top_skills = [{"skill": k, "frequency": v} for k, v in skill_counts]
        
    # Geo distribution
    loc_counts = df['location'].value_counts().reset_index()
    loc_counts.columns = ['location', 'count']
    geo_distribution = loc_counts.to_dict(orient='records')
    
    return {
        "total_applicants": total_applicants,
        "unique_categories": unique_categories,
        "avg_score": round(avg_score, 1),
        "primary_location": primary_location,
        "category_distribution": category_distribution,
        "score_distribution": score_distribution,
        "top_skills": top_skills,
        "geo_distribution": geo_distribution
    }

@app.post("/api/enhance")
async def enhance_resume(
    file: UploadFile = File(...),
    job_title: str = Form(""),
    required_skills: str = Form(""),
):
    """Use Groq Llama to analyze CV faults and suggest improvements for the given job."""
    groq_api_key = os.environ.get("GROQ_API_KEY", "")
    if not groq_api_key:
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY environment variable is not set. Please set it to enable AI CV enhancement."
        )

    # Extract text from uploaded file
    file_bytes = await file.read()
    content = ""
    suffix = Path(file.filename).suffix.lower()

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
        tmp_file.write(file_bytes)
        tmp_file_path = tmp_file.name

    try:
        if suffix == '.txt':
            content = file_bytes.decode('utf-8', errors='ignore')
        elif suffix == '.pdf':
            import pdfplumber
            with pdfplumber.open(tmp_file_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        content += text + '\n'
        elif suffix == '.docx':
            import docx2txt
            content = docx2txt.process(tmp_file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format.")
    finally:
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)

    if not content.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the resume.")

    # Truncate to avoid token limits (~6000 chars ≈ 1500 tokens)
    cv_text = content[:6000]

    # Build a structured prompt
    job_context = f"Target Job Role: {job_title}" if job_title else "Target Job Role: Not specified"
    skills_context = f"Required Skills: {required_skills}" if required_skills else ""

    prompt = f"""You are an expert career coach and resume reviewer. Analyze the following CV against the job requirements and provide:

1. A numbered list of **specific faults or weaknesses** in this CV for the given job role (e.g. missing skills, poor formatting clues, vague descriptions, missing quantifiable achievements, lack of relevant keywords).
2. A numbered list of **concrete improvement suggestions** to fix each fault and make the CV stronger for this role.

{job_context}
{skills_context}

--- CV CONTENT ---
{cv_text}
--- END CV ---

Respond ONLY in this exact JSON format (no extra text outside the JSON):
{{
  "faults": [
    "Fault 1 description",
    "Fault 2 description"
  ],
  "suggestions": [
    "Suggestion 1 corresponding to Fault 1",
    "Suggestion 2 corresponding to Fault 2"
  ]
}}"""

    # Call Groq API
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.4,
        "max_tokens": 1500,
    }

    try:
        response = http_requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60,
        )
        response.raise_for_status()
    except http_requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Groq API request failed: {str(e)}")

    resp_data = response.json()
    raw_content = resp_data["choices"][0]["message"]["content"].strip()

    # Parse the JSON response from Llama
    import json as json_module
    # Extract JSON block even if model wraps it in markdown
    json_match = re.search(r'\{[\s\S]*\}', raw_content)
    if not json_match:
        raise HTTPException(status_code=500, detail="AI returned an unexpected format. Try again.")

    try:
        parsed = json_module.loads(json_match.group(0))
        faults = parsed.get("faults", [])
        suggestions = parsed.get("suggestions", [])
    except json_module.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response JSON.")

    return {
        "success": True,
        "job_title": job_title,
        "faults": faults,
        "suggestions": suggestions,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
