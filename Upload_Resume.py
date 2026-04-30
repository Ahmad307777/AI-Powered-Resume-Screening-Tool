import tempfile
import joblib
import pickle
import numpy as np
import pandas as pd
import streamlit as st
import sqlite3
from pathlib import Path
from nltk.corpus import stopwords
from csv import DictWriter
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
import warnings
import nltk
import re

# Ensure NLTK resources are available
try:
    nltk.data.find('corpora/stopwords')
except AttributeError:
    # Older nltk version compatibility
    nltk.download('stopwords')
except LookupError:
    nltk.download('stopwords')

# Download other essentials
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)


# Load model and vectorizer once at startup
@st.cache_resource
def load_ml_components():
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        cv = pickle.load(open('cv.pickle', 'rb'))
        model = joblib.load('RF.joblib')
    return cv, model

cv, model = load_ml_components()

#Cleaning the Resume uploaded
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    sw = set(stopwords.words('english'))
    text = " ".join([word for word in text.split() if word not in sw])
    return text

def clean(df):
    df['Resume'] = df['Resume'].apply(clean_text)
    return df


mydb = sqlite3.connect('resumes.db', check_same_thread=False)
cur = mydb.cursor()
cur = mydb.cursor()
query0 = """SELECT POSITION FROM HR"""
cur.execute(query0)
positin1 = cur.fetchall()
mydb.commit()

if positin1:
    position1 = list(positin1[0])
    pos_name = position1[0]
else:
    pos_name = "Not Set"

pos = f"HR's requirement: {pos_name.upper()}"

query2 = """SELECT skills FROM skills WHERE LOWER(position)=?"""
cur.execute(query2, (pos_name.lower(),))
skills = cur.fetchall()
mydb.commit()

if skills:
    ski = list(skills[0])
    skill_str = ski[0].upper()
else:
    ski = [""] # Fallback empty list
    skill_str = "No specific keywords defined for this role."

skill = f"Main keywords:\n {skill_str}"


#UI design
st.set_page_config(page_title="Upload Resumé")

st.title("AI Resumé Screening")
st.header(pos)
st.header(skill)
st.subheader("Please Upload your Resumé in the dropbox")

st.write('Accepted formats: pdf, docx, txt')

final=pd.DataFrame(columns=['Email Id','Name','Mobile No','Resume'])
with st.form("Registration Form"):   
    email = st.text_input(label = 'Email Address', placeholder = "Please enter your email address")
    fullName = st.text_input(label = 'Full Name', placeholder="Please enter your full name") 
    mobile = st.text_input(label='Mobile', placeholder="Please enter subject your Mobile No.")
    location=st.text_input(label='Location',placeholder='Please enter location')
    uploaded_file = st.file_uploader(label='Resumé',type=['pdf','docx','txt'],accept_multiple_files=False)
    submitted = st.form_submit_button("Submit")
if submitted:
    if uploaded_file:
            content=''
            with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                    fp = Path(tmp_file.name)
                    fp.write_bytes(uploaded_file.getvalue())
                    if uploaded_file.type=='text/plain':
                        bytes_data = uploaded_file.getvalue()
                        content=str(bytes_data)
                    if uploaded_file.type=='application/pdf':
                        import PyPDF2
                        pdffileobj=open(tmp_file.name,'rb')
                        pdfreader=PyPDF2.PdfReader(pdffileobj)
                        x=len(pdfreader.pages)
                        for i in range(x):
                            pageobj=pdfreader.pages[i]
                            text=pageobj.extract_text()
                            content+=text
                    if uploaded_file.type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        import docx2txt
                        content=docx2txt.process(tmp_file.name)
            data={'Resume':[content]}
            
            frame=pd.DataFrame(data)
            frame = clean(frame)
            
            #scoring
            required_skills = [s.strip().lower() for s in ski[0].split(',') if s.strip()]
            score=0
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
            
            # AI Decision Logic
            if score_percent >= 50:
                status = "Selected"
                reasoning = f"Candidate shows strong alignment with {score_percent:.1f}% keyword match. Key strengths include: {matched_skills_str}."
            else:
                status = "Rejected"
                reasoning = f"Match score of {score_percent:.1f}% is below the 50% threshold. Missing critical skills: {missing_skills_str}."
            
            
            #Vectorizing and passing into pre trained model
            
            with st.spinner("Analyzing resume..."):
                try:
                    # Direct transformation using pre-fitted vectorizer
                    X = cv.transform(frame['Resume'])
                    
                    #Prediction and result Shown
                    pred = model.predict(X)
                    dict_category = {0: 'Advocate', 1: 'Arts', 2: 'Automation Testing', 3: 'Blockchain', 4: 'Business Analyst', 5: 'Civil Engineer', 6: 'Data Science', 7: 'Database', 8: 'DevOps Engineer', 9: 'DotNet Developer', 10: 'ETL Developer', 11: 'Electrical Engineering', 12: 'HR', 13: 'Hadoop', 14: 'Health and fitness', 15: 'Java Developer', 16: 'Mechanical Engineer', 17: 'Network Security Engineer', 18: 'Operations Manager', 19: 'PMO', 20: 'Python Developer', 21: 'SAP Developer', 22: 'Sales', 23: 'Testing', 24: 'Web Designing'}
                    
                    # --- AI Correction Layer (Hybrid Model) ---
                    # Ensure Software/IT resumes aren't misclassified as non-tech roles
                    tech_keywords = ['software', 'cloud', 'aws', 'azure', 'google cloud', 'database', 'sql', 'coding', 'programming', 'infrastructure', 'full-stack', 'backend']
                    prediction_id = pred[0]
                    prediction_label = dict_category[prediction_id]
                    
                    if prediction_label.upper() in ["TEACHER", "ARTS", "PUBLIC-RELATIONS", "ADVOCATE"]:
                        content_lower = content.lower()
                        if any(kw in content_lower for kw in tech_keywords):
                            # Force correction to INFORMATION-TECHNOLOGY (34)
                            prediction_id = 34
                    # ------------------------------------------

                    pred2=f'The resume is fit for {dict_category[prediction_id].upper()} category..'
                    st.header(pred2)
                    prediction_category = dict_category[prediction_id].upper()

                #If category matches the requirement    
                    if dict_category[prediction_id].lower()==pos_name.lower():
                            file_path = tmp_file.name
                            
                            def convertToBinaryFile(filename):
                                with open(filename, 'rb') as file:
                                    binarydata = file.read()
                                return binarydata

                            def convertBinaryToFile(binarydata, filename):
                                with open(filename, 'wb') as file:
                                    file.write(binarydata)

                            query = """INSERT INTO employees (Name,Email,Resume,score,location,category,matched_skills,status,reasoning) VALUES (?,?,?,?,?,?,?,?,?)"""
                            convertfile = convertToBinaryFile(file_path)
                            value = (fullName,email, convertfile,score_percent,location,prediction_category.upper(), matched_skills_str, status, reasoning)
                            cur.execute(query,value)
                            mydb.commit()
                            
                            st.divider()
                            st.subheader("🏁 Pre-Screening Result")
                            if status == "Selected":
                                st.success(f"**Status: {status}**")
                            else:
                                st.warning(f"**Status: {status}**")
                                
                            st.write(f"**AI Category:** {prediction_category}")
                            st.write(f"**Skill Match Score:** {score_percent:.1f}%")
                            st.info(f"**Analysis:** {reasoning}")
                    else:
                            st.error(f"❌ Selection Failed")
                            st.warning(f"The AI categorized this resume as **{prediction_category}**, but the HR requirement is for **{pos_name.upper()}**.")
                            st.info("The resume was not saved because it belongs to the wrong job department.")
                except Exception as e:
                    st.error(f"An error occurred during processing: {e}")
                    import traceback
                    traceback.print_exc()


