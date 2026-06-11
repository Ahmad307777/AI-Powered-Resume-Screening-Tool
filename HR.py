import streamlit as st
import sqlite3
import pandas as pd
import base64
import tempfile
import os

# --- Page Config & Aesthetics ---
st.set_page_config(page_title="HR Dashboard", layout="wide")

# Custom CSS for Premium Design
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Outfit', sans-serif;
    }
    
    /* Elegant Title Gradient */
    .title-gradient {
        background: linear-gradient(135deg, #3f51b5 0%, #e91e63 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        font-size: 2.8rem;
        margin-bottom: 0.5rem;
    }
    
    /* Glassmorphism Card for Form */
    div[data-testid="stForm"] {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2.5rem;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(12px);
        margin-bottom: 2rem;
    }
    
    /* Metric Card Styling */
    .metric-card {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    /* Status Badge Pills */
    .status-badge {
        padding: 6px 14px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 13px;
        text-transform: uppercase;
        display: inline-block;
        text-align: center;
    }
    .status-selected {
        background-color: rgba(46, 204, 113, 0.15) !important;
        color: #2ecc71 !important;
        border: 1px solid rgba(46, 204, 113, 0.3) !important;
    }
    .status-rejected {
        background-color: rgba(231, 76, 60, 0.15) !important;
        color: #e74c3c !important;
        border: 1px solid rgba(231, 76, 60, 0.3) !important;
    }
    
    /* Details Container Styling */
    .details-box {
        background: rgba(255, 255, 255, 0.02);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 20px;
        margin-top: 15px;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<h1 class="title-gradient">🎯 Recruiter Dashboard</h1>', unsafe_allow_html=True)
st.markdown("Configure the active recruitment role and analyze candidates matched by AI.")
st.markdown("---")

# The 25 categories supported by the trained ML model (aligned with UpdatedResumeDataSet)
categories = [
    'Advocate', 'Arts', 'Automation Testing', 'Blockchain', 'Business Analyst', 
    'Civil Engineer', 'Data Science', 'Database', 'DevOps Engineer', 'DotNet Developer', 
    'ETL Developer', 'Electrical Engineering', 'HR', 'Hadoop', 'Health and fitness', 
    'Java Developer', 'Mechanical Engineer', 'Network Security Engineer', 
    'Operations Manager', 'PMO', 'Python Developer', 'SAP Developer', 'Sales', 
    'Testing', 'Web Designing'
]

# Form for setting role requirement
with st.form("HR form"):
    st.subheader("Configure Recruitment Target")
    position = st.selectbox(
        label="Required Job Position", 
        options=sorted(categories), 
        help="Select the job role for which the AI will filter candidates"
    )
    exp = st.text_input(
        label="Minimum Experience (in years)", 
        placeholder="e.g. 2",
        value="0"
    )
    submitted = st.form_submit_button("Set Role & Update Filter")

mydb = sqlite3.connect('resumes.db', check_same_thread=False)
cur = mydb.cursor()   

if submitted:
    try:
        exp_int = int(exp)
    except ValueError:
        exp_int = 0
        st.error("Please enter a valid number for experience.")
    
    # Save the current requirement
    cur.execute("DELETE FROM HR")
    cur.execute("INSERT INTO HR (Position, Experience) VALUES (?, ?)", (position.lower(), exp_int))
    mydb.commit()
    st.success(f"Active recruitment position set to: **{position}** (Min Experience: {exp_int} years)")

# Initialize session state for views
if 'show_resumes' not in st.session_state:
    st.session_state.show_resumes = False
if 'view_resume_index' not in st.session_state:
    st.session_state.view_resume_index = None

# Query currently active position
cur.execute("SELECT POSITION, EXPERIENCE FROM HR")
active_pos_row = cur.fetchone()
if active_pos_row:
    active_role = active_pos_row[0].title()
    active_exp = active_pos_row[1]
    st.info(f"⚡ **Active Filtering Rule:** Matching candidates for **{active_role}** (Requirement: ≥ {active_exp} Years Exp)")
else:
    st.warning("⚠️ No active filtering role has been set. Please select a position above.")

st.divider()

if st.button("Show Registered Candidates", type="secondary"):
    st.session_state.show_resumes = True

if st.session_state.show_resumes:
    cur.execute("SELECT NAME, EMAIL, LOCATION, SCORE, RESUME, CATEGORY, STATUS, REASONING FROM employees ORDER BY SCORE DESC")
    resumes = cur.fetchall()

    if not resumes:
        st.info("No candidates have uploaded resumes for this system yet.")
    else:
        st.subheader("📋 Registered Candidates (Sorted by Score)")
        
        # Grid Headers
        colms = st.columns((2, 2.5, 1.5, 2, 1.5, 1.5))
        fields = ["Name", 'Email', "Score", "Predicted Role", "Status", "Action"]
        for col, field_name in zip(colms, fields):
            col.write(f"**{field_name}**")
        
        st.markdown("<hr style='margin: 0.5em 0; opacity: 0.2;' />", unsafe_allow_html=True)
        
        for i, row in enumerate(resumes):
            col1, col2, col3, col4, col5, col6 = st.columns((2, 2.5, 1.5, 2, 1.5, 1.5))
            col1.write(row[0])  # Name
            col2.write(row[1])  # Email
            col3.write(f"**{row[3]:.1f}%**")  # Score
            col4.write(row[5].title())  # Category
            
            # Status Badge
            status_style = "status-selected" if row[6] == "Selected" else "status-rejected"
            col5.markdown(f'<div class="status-badge {status_style}">{row[6]}</div>', unsafe_allow_html=True)
            
            if col6.button("View Report", key=f"view_{i}", type="primary"):
                st.session_state.view_resume_index = i
            
            st.markdown("<hr style='margin: 0.3em 0; opacity: 0.1;' />", unsafe_allow_html=True)

        # Candidate Details & PDF Viewer Section
        if st.session_state.view_resume_index is not None and st.session_state.view_resume_index < len(resumes):
            selected_row = resumes[st.session_state.view_resume_index]
            
            st.markdown("---")
            st.markdown(f'<h2 style="color: #e91e63;">📋 Selection Report: {selected_row[0]}</h2>', unsafe_allow_html=True)
            
            r1, r2 = st.columns([1, 2])
            with r1:
                st.markdown(
                    f"""
                    <div class="metric-card">
                        <div style="font-size: 14px; text-transform: uppercase; color: #aaa; margin-bottom: 5px;">Match Score</div>
                        <div style="font-size: 32px; font-weight: 700; color: #e91e63;">{selected_row[3]:.1f}%</div>
                    </div>
                    """, 
                    unsafe_allow_html=True
                )
                status_class = "status-selected" if selected_row[6] == "Selected" else "status-rejected"
                st.markdown(f'<div style="text-align: center; margin-top: 15px;"><div class="status-badge {status_class}" style="font-size: 16px; padding: 10px 20px;">{selected_row[6]}</div></div>', unsafe_allow_html=True)
            
            with r2:
                st.markdown(
                    f"""
                    <div class="details-box">
                        <h4>AI Reasoning & Keyword Analysis</h4>
                        <p>{selected_row[7]}</p>
                        <p><strong>Candidate Location:</strong> {selected_row[2]}</p>
                        <p><strong>Candidate Email:</strong> {selected_row[1]}</p>
                    </div>
                    """, 
                    unsafe_allow_html=True
                )

            st.write("### Resume Document Preview")
            try:
                # Save binary resume data to a temporary file
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    tmp.write(selected_row[4])
                    tmp_path = tmp.name
                
                with open(tmp_path, "rb") as f:
                    base64_pdf = base64.b64encode(f.read()).decode('utf-8')
                    pdf_display = f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="100%" height="800" type="application/pdf"></iframe>'
                    st.markdown(pdf_display, unsafe_allow_html=True)
                
                st.download_button(
                    label="📥 Download Resume PDF",
                    data=selected_row[4],
                    file_name=f"{selected_row[0].replace(' ', '_')}_Resume.pdf",
                    mime="application/pdf"
                )
                
                os.unlink(tmp_path)
            except Exception as e:
                st.error(f"Error displaying resume: {e}")
            
            if st.button("Close Report Viewer", type="secondary"):
                st.session_state.view_resume_index = None
                st.rerun()

mydb.close()