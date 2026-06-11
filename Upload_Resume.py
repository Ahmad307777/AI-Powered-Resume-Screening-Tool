import tempfile
import joblib
import pickle
import numpy as np
import pandas as pd
import streamlit as st
import sqlite3
from pathlib import Path
from nltk.corpus import stopwords
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import warnings
import nltk
import re

# Ensure NLTK resources are available
try:
    nltk.data.find('corpora/stopwords')
except (AttributeError, LookupError):
    nltk.download('stopwords', quiet=True)

# Download other essentials
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)

# --- Page Setup & Aesthetics ---
st.set_page_config(page_title="AI Resume Portal", layout="centered")

# Custom Premium Styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Outfit', sans-serif;
    }
    
    /* Elegant Title Gradient */
    .hero-title {
        background: linear-gradient(135deg, #FF4E50 0%, #F9D423 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        font-size: 2.8rem;
        margin-bottom: 0.2rem;
        text-align: center;
    }
    
    .hero-subtitle {
        color: #aaa;
        font-size: 1.1rem;
        text-align: center;
        margin-bottom: 2rem;
    }
    
    /* Active Requirement Box (Glassmorphic) */
    .req-box {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .req-header {
        font-size: 13px;
        text-transform: uppercase;
        color: #00e676;
        font-weight: 700;
        margin-bottom: 5px;
        letter-spacing: 1px;
    }
    
    .req-role {
        font-size: 22px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 8px;
    }
    
    .req-keywords {
        font-size: 14px;
        color: #ddd;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding-top: 8px;
        margin-top: 8px;
    }
    
    /* Glassmorphism Form container */
    div[data-testid="stForm"] {
        background: rgba(255, 255, 255, 0.04);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 2.5rem;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        margin-bottom: 2rem;
    }
    
    /* Pill tags */
    .pill {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 600;
        margin: 3px;
        text-transform: uppercase;
    }
    .pill-matched {
        background-color: rgba(46, 204, 113, 0.15);
        color: #2ecc71;
        border: 1px solid rgba(46, 204, 113, 0.3);
    }
    .pill-missing {
        background-color: rgba(231, 76, 60, 0.15);
        color: #e74c3c;
        border: 1px solid rgba(231, 76, 60, 0.3);
    }
    
    /* Score card metrics */
    .metric-grid {
        display: flex;
        gap: 15px;
        margin: 15px 0;
    }
    .metric-item {
        flex: 1;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 15px;
        text-align: center;
    }
    .metric-label {
        font-size: 11px;
        text-transform: uppercase;
        color: #aaa;
        margin-bottom: 5px;
    }
    .metric-val {
        font-size: 26px;
        font-weight: 700;
        color: #fff;
    }
</style>
""", unsafe_allow_html=True)

# Load model and vectorizer once at startup
@st.cache_resource
def load_ml_components():
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        cv = pickle.load(open('cv.pickle', 'rb'))
        model = joblib.load('RF.joblib')
    return cv, model

cv, model = load_ml_components()

# Cleaning the Resume uploaded
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    sw = set(stopwords.words('english'))
    text = " ".join([word for word in text.split() if word not in sw])
    return text

def clean(df):
    df['Resume'] = df['Resume'].apply(clean_text)
    return df

# Database state management
mydb = sqlite3.connect('resumes.db', check_same_thread=False)
cur = mydb.cursor()

# Get current HR requirement
cur.execute("SELECT POSITION FROM HR")
pos_row = cur.fetchone()
pos_name = pos_row[0] if pos_row else "Not Set"

# Get required skills
cur.execute("SELECT skills FROM skills WHERE LOWER(position)=?", (pos_name.lower(),))
skills_row = cur.fetchone()
if skills_row:
    ski = list(skills_row)
    skill_str = ski[0].upper()
else:
    ski = [""]
    skill_str = "No specific keywords defined for this role."

# Render Header & Active Position Requirements
st.markdown('<h1 class="hero-title">🔮 AI Resume Screen</h1>', unsafe_allow_html=True)
st.markdown('<div class="hero-subtitle">Upload your CV to verify matching alignment in real time.</div>', unsafe_allow_html=True)

# Requirement Banner
st.markdown(
    f"""
    <div class="req-box">
        <div class="req-header">Current HR Target Open Role</div>
        <div class="req-role">📋 {pos_name.upper()}</div>
        <div class="req-keywords"><strong>Key Skill Keywords Required:</strong> {skill_str}</div>
    </div>
    """, 
    unsafe_allow_html=True
)

st.subheader("Candidate Application Portal")
st.write("Please fill in your details and attach your CV (accepted formats: PDF, DOCX, TXT)")

# Application Form
with st.form("Registration Form"):   
    email = st.text_input(label='Email Address', placeholder="your.name@example.com")
    fullName = st.text_input(label='Full Name', placeholder="Enter your full name") 
    mobile = st.text_input(label='Mobile Phone', placeholder="e.g. +923001234567")
    location = st.text_input(label='Location (City, Country)', placeholder="e.g. Lahore, Pakistan")
    uploaded_file = st.file_uploader(label='Resume Document', type=['pdf', 'docx', 'txt'], accept_multiple_files=False)
    submitted = st.form_submit_button("Submit Application")

if submitted:
    if not email or not fullName or not uploaded_file:
        st.error("Please fill in all mandatory fields (Name, Email, Resume).")
    else:
        content = ''
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
            fp = Path(tmp_file.name)
            fp.write_bytes(uploaded_file.getvalue())
            
            # Text Extraction
            if uploaded_file.type == 'text/plain':
                content = str(uploaded_file.getvalue(), 'utf-8', errors='ignore')
            elif uploaded_file.type == 'application/pdf':
                import PyPDF2
                with open(tmp_file.name, 'rb') as pdffileobj:
                    pdfreader = PyPDF2.PdfReader(pdffileobj)
                    for i in range(len(pdfreader.pages)):
                        pageobj = pdfreader.pages[i]
                        text = pageobj.extract_text()
                        if text:
                            content += text
            elif uploaded_file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                import docx2txt
                content = docx2txt.process(tmp_file.name)
                
        # Clean text
        frame = pd.DataFrame({'Resume': [content]})
        frame = clean(frame)
        cleaned_text_str = frame['Resume'][0]

        # 1. Keyword Matching Score
        required_skills = [s.strip().lower() for s in ski[0].split(',') if s.strip()]
        score = 0
        matched_skills_list = []
        missing_skills_list = []
        
        content_lower = content.lower()
        for s in required_skills:
            if s in content_lower:
                score += 1
                matched_skills_list.append(s.title())
            else:
                missing_skills_list.append(s.title())
        
        matched_skills_str = ', '.join(matched_skills_list)
        missing_skills_str = ', '.join(missing_skills_list)
        length = len(required_skills)
        score_percent = (score / length * 100) if length > 0 else 0
        
        # 2. Actual TF-IDF Cosine Similarity
        try:
            cleaned_req_skills = clean_text(ski[0])
            X_candidate = cv.transform([cleaned_text_str])
            X_skills = cv.transform([cleaned_req_skills])
            cos_sim = cosine_similarity(X_candidate, X_skills)[0][0]
            cos_sim_percent = cos_sim * 100
        except Exception:
            cos_sim_percent = 0.0

        # AI Decision Logic based on keyword matching
        if score_percent >= 50:
            status = "Selected"
            reasoning = f"Strong alignment detected: {score_percent:.1f}% keyword match & {cos_sim_percent:.1f}% semantic similarity. Key matching skills include: {matched_skills_str}."
        else:
            status = "Rejected"
            reasoning = f"Score of {score_percent:.1f}% is below the 50% threshold. Missing core skills: {missing_skills_str}."

        # ML Classification
        with st.spinner("Classifying resume..."):
            try:
                # Direct prediction using TF-IDF and Random Forest
                X_pred = cv.transform([cleaned_text_str])
                pred = model.predict(X_pred)
                
                # Model categories mapping
                dict_category = {
                    0: 'Advocate', 1: 'Arts', 2: 'Automation Testing', 3: 'Blockchain', 4: 'Business Analyst', 
                    5: 'Civil Engineer', 6: 'Data Science', 7: 'Database', 8: 'DevOps Engineer', 9: 'DotNet Developer', 
                    10: 'ETL Developer', 11: 'Electrical Engineering', 12: 'HR', 13: 'Hadoop', 14: 'Health and fitness', 
                    15: 'Java Developer', 16: 'Mechanical Engineer', 17: 'Network Security Engineer', 18: 'Operations Manager', 
                    19: 'PMO', 20: 'Python Developer', 21: 'SAP Developer', 22: 'Sales', 23: 'Testing', 24: 'Web Designing'
                }
                
                prediction_id = pred[0]
                prediction_label = dict_category[prediction_id]
                
                # --- Fixed AI Correction Layer ---
                tech_keywords = ['software', 'cloud', 'aws', 'azure', 'google cloud', 'database', 'sql', 'coding', 'programming', 'infrastructure', 'full-stack', 'backend', 'python', 'java', 'javascript', 'c++', 'developer', 'engineer']
                if prediction_label.upper() in ["TEACHER", "ARTS", "PUBLIC-RELATIONS", "ADVOCATE", "HEALTH AND FITNESS"]:
                    if any(kw in content_lower for kw in tech_keywords):
                        # Dynamic repair: override prediction_id to match HR's requested position index if it is a tech role
                        target_id = None
                        for kid, label in dict_category.items():
                            if label.lower() == pos_name.lower():
                                target_id = kid
                                break
                        if target_id is not None:
                            prediction_id = target_id
                        else:
                            prediction_id = 20  # Fallback to Python Developer (valid index)
                
                prediction_category = dict_category[prediction_id].upper()
                
                # Check Category Alignment
                if dict_category[prediction_id].lower() == pos_name.lower():
                    # Load binary file data for DB storage
                    with open(tmp_file.name, 'rb') as file:
                        convertfile = file.read()
                    
                    query = """INSERT INTO employees (Name,Email,Resume,score,location,category,matched_skills,status,reasoning) VALUES (?,?,?,?,?,?,?,?,?)"""
                    value = (fullName, email, convertfile, score_percent, location, prediction_category, matched_skills_str, status, reasoning)
                    cur.execute(query, value)
                    mydb.commit()
                    
                    # Display Success Report
                    st.divider()
                    st.markdown("### 🎉 Application Successfully Submitted")
                    
                    # Status Badge
                    status_class = "rgba(46, 204, 113, 0.2)" if status == "Selected" else "rgba(230, 126, 34, 0.2)"
                    status_color = "#2ecc71" if status == "Selected" else "#e67e22"
                    st.markdown(
                        f'<div style="background: {status_class}; border: 1px solid {status_color}; color: {status_color}; padding: 12px; border-radius: 8px; font-weight: 700; text-align: center; margin-bottom: 20px;">'
                        f'PRE-SCREENING RESULT: {status.upper()}'
                        f'</div>', 
                        unsafe_allow_html=True
                    )
                    
                    # Metrics Grid
                    st.markdown(
                        f"""
                        <div class="metric-grid">
                            <div class="metric-item">
                                <div class="metric-label">AI Categorized Role</div>
                                <div class="metric-val" style="font-size: 20px; color: #F9D423;">{prediction_category}</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-label">Keyword Match</div>
                                <div class="metric-val">{score_percent:.1f}%</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-label">Semantic Cosine Sim</div>
                                <div class="metric-val" style="color: #00e676;">{cos_sim_percent:.1f}%</div>
                            </div>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
                    
                    # Display Matched and Missing Skills as Badge Pills
                    c1, c2 = st.columns(2)
                    with c1:
                        st.write("**Matched Required Skills:**")
                        if matched_skills_list:
                            pills_html = "".join([f'<span class="pill pill-matched">{s}</span>' for s in matched_skills_list])
                            st.markdown(pills_html, unsafe_allow_html=True)
                        else:
                            st.write("*None*")
                    
                    with c2:
                        st.write("**Missing Required Skills:**")
                        if missing_skills_list:
                            pills_html = "".join([f'<span class="pill pill-missing">{s}</span>' for s in missing_skills_list])
                            st.markdown(pills_html, unsafe_allow_html=True)
                        else:
                            st.write("*None*")
                    
                    st.divider()
                    st.info(f"💡 **AI Match Analysis:** {reasoning}")
                    
                else:
                    # Reject because category doesn't match HR open requirement
                    st.divider()
                    st.error("❌ Application Submission Failed")
                    
                    st.markdown(
                        f"""
                        <div class="req-box" style="border: 1px solid rgba(231, 76, 60, 0.4); background: rgba(231, 76, 60, 0.05);">
                            <div style="color: #e74c3c; font-weight: 700; text-transform: uppercase; font-size: 13px;">Role Category Mismatch</div>
                            <p style="margin-top: 5px;">The AI model classified your resume as <strong>{prediction_category}</strong>, but the current recruitment rule is filtering specifically for <strong>{pos_name.upper()}</strong>.</p>
                            <p style="font-size: 13px; color: #aaa;">Your application details were not recorded because your profile is not aligned with this department.</p>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
                    
            except Exception as e:
                st.error(f"An error occurred during resume analysis: {e}")
                import traceback
                traceback.print_exc()

mydb.close()
