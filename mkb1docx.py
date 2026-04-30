from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

doc = Document()
for sec in doc.sections:
    sec.top_margin = Cm(2.5); sec.bottom_margin = Cm(2.5)
    sec.left_margin = Cm(3);  sec.right_margin = Cm(2.5)

BLUE  = (31, 73, 125)
BLUE2 = (54, 96, 146)
RED   = (192, 0, 0)

def sf(run, size=11, bold=False, color=None):
    run.font.name = 'Calibri'; run.font.size = Pt(size); run.font.bold = bold
    if color: run.font.color.rgb = RGBColor(*color)

def heading(text, level):
    p = doc.add_paragraph()
    r = p.add_run(text)
    if   level == 1: sf(r, 14, True, BLUE);  p.paragraph_format.space_before = Pt(12)
    elif level == 2: sf(r, 12, True, BLUE2); p.paragraph_format.space_before = Pt(8)
    else:            sf(r, 11, True);         p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(4)

def para(text, bold=False, italic=False, center=False, size=11, color=None):
    p = doc.add_paragraph()
    r = p.add_run(text); sf(r, size, bold, color); r.italic = italic
    if center: p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(3)

def bullet(text):
    p = doc.add_paragraph(style='List Bullet')
    sf(p.add_run(text), 11); p.paragraph_format.space_after = Pt(2)

def code(text):
    p = doc.add_paragraph()
    r = p.add_run(text); r.font.name = 'Courier New'; r.font.size = Pt(9)
    p.paragraph_format.left_indent = Inches(0.4); p.paragraph_format.space_after = Pt(1)
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'),'clear'); shd.set(qn('w:color'),'auto'); shd.set(qn('w:fill'),'F2F2F2')
    p._p.get_or_add_pPr().append(shd)

def table(headers, rows):
    t = doc.add_table(rows=1+len(rows), cols=len(headers))
    t.style = 'Table Grid'; t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(headers):
        c = t.rows[0].cells[i]; c.text = h
        for pr in c.paragraphs:
            for r in pr.runs: r.font.bold=True; r.font.size=Pt(10); r.font.name='Calibri'
        shd = OxmlElement('w:shd')
        shd.set(qn('w:val'),'clear'); shd.set(qn('w:color'),'auto'); shd.set(qn('w:fill'),'BDD7EE')
        c._tc.get_or_add_tcPr().append(shd)
    for ri, rd in enumerate(rows):
        for ci, val in enumerate(rd):
            c = t.rows[ri+1].cells[ci]; c.text = val
            for pr in c.paragraphs:
                for r in pr.runs: r.font.size=Pt(10); r.font.name='Calibri'
    doc.add_paragraph().paragraph_format.space_after = Pt(2)

# ── TITLE PAGE ──────────────────────────────────────────────────────────────
para('Namal University', bold=True, center=True, size=16, color=BLUE)
para('Department of Computer Science', center=True, size=13)
doc.add_paragraph()
para('CSC-361: Machine Learning', bold=True, center=True, size=12)
para('Track B – Software-Based AI System', center=True, size=12)
doc.add_paragraph()
para('Milestone 1 – Product Planning and System Design', bold=True, center=True, size=15, color=RED)
doc.add_paragraph()
for lbl, val in [('Semester','Spring 2025'),('Instructor','Dr. Shafiq Ur Rehman Khan'),
                 ('Max Marks','4 / 20'),('Mapped CLO','CLO-1'),('Submission Date','01 April 2025')]:
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sf(p.add_run(lbl+': '), 11, True); sf(p.add_run(val), 11)
doc.add_paragraph()
para('Group Members', bold=True, center=True, size=12)
for m in ['Ahmad Mustafa','Raqib Hayat','Niyaz Ali Malik','Tahir']:
    para(m, center=True)
doc.add_page_break()

# ── SECTION 1 ───────────────────────────────────────────────────────────────
heading('1. Problem Definition and Target Audience', 1)

heading('1.1 Problem Statement', 2)
para('The modern recruitment process is overwhelmed by volume. A single job posting at a mid-to-large organization can attract hundreds or thousands of applications within days. HR teams are forced to manually read through each resume to determine relevance — a process that is slow, inconsistent, and prone to unconscious bias. Studies show that recruiters spend an average of 6–10 seconds on an initial resume scan, meaning qualified candidates are frequently overlooked simply due to fatigue or subjective judgment.')
para('There is a clear need for an intelligent, automated system that can:')
bullet('Accurately classify resumes into the correct job category')
bullet('Score candidates against specific job requirements')
bullet('Provide transparent, explainable decisions to HR teams')
bullet('Deliver results in real time without manual intervention')
para('This project builds an AI-powered Resume Screening and Classification System that uses Natural Language Processing (NLP) and Machine Learning (ML) to automate the initial screening phase of recruitment.')

heading('1.2 Target Audience', 2)
table(['User Type','Role','Need'],[
    ['HR Managers / Recruiters','Primary users','Set job requirements, view ranked shortlisted candidates, access AI reasoning'],
    ['Job Applicants / Candidates','Secondary users','Upload resume, receive instant feedback on category match and selection status'],
    ['System Administrators','Technical users','Manage database, retrain model on new data, maintain deployment'],
])

heading('1.3 Scope', 2)
para('The system handles:')
bullet('Resume upload in PDF, DOCX, and TXT formats')
bullet('Automatic text extraction and NLP-based cleaning')
bullet('Multi-class classification into 25 job categories')
bullet('Skill-based scoring against HR-defined requirements')
bullet('Persistent storage of candidate profiles in a database')
bullet('A web-based interface accessible without technical knowledge')
para('Out of scope for this version: multilingual resumes, OCR for scanned images, automated email notifications.', italic=True)

# ── SECTION 2 ───────────────────────────────────────────────────────────────
heading('2. System Architecture', 1)

heading('2.1 Architecture Diagram (Text Representation)', 2)
code('┌─────────────────────────────────────────────────────┐')
code('│              WEB APPLICATION LAYER (Streamlit)      │')
code('│  ┌──────────────────┐    ┌────────────────────────┐ │')
code('│  │ Candidate Portal  │    │     HR Dashboard       │ │')
code('│  │ Upload_Resume.py  │    │       HR.py            │ │')
code('│  └────────┬──────────┘    └──────────┬─────────────┘ │')
code('└───────────┼──────────────────────────┼───────────────┘')
code('            ▼                          ▼')
code('┌─────────────────────────────────────────────────────┐')
code('│                  PROCESSING LAYER                   │')
code('│  Text Extraction → NLP Cleaning → TF-IDF → RF Model │')
code('│  PyPDF2/docx2txt   NLTK/regex    cv.pickle RF.joblib │')
code('│                        ↓                            │')
code('│              Decision Engine                        │')
code('│         Category + Score + Selected/Rejected        │')
code('└──────────────────────────┬──────────────────────────┘')
code('                           ▼')
code('┌─────────────────────────────────────────────────────┐')
code('│                   DATA LAYER                        │')
code('│         SQLite Database (resumes.db)                │')
code('│   HR Table | Employees Table | Skills Table         │')
code('└──────────────────────────┬──────────────────────────┘')
code('                           ▼')
code('┌─────────────────────────────────────────────────────┐')
code('│                 ANALYTICS LAYER                     │')
code('│   pages/Dashboard.py | pages/Show_Resumes.py        │')
code('└─────────────────────────────────────────────────────┘')

heading('2.2 Component Descriptions', 2)
table(['Component','Technology','Responsibility'],[
    ['Candidate Portal','Streamlit (Upload_Resume.py)','Resume upload, result display'],
    ['HR Dashboard','Streamlit (HR.py)','Job requirement setting, candidate ranking'],
    ['Text Extraction','PyPDF2, docx2txt','Extract raw text from PDF/DOCX/TXT'],
    ['NLP Cleaning','NLTK, regex','Lowercase, stopword removal, special char stripping'],
    ['TF-IDF Vectorizer','scikit-learn','Convert cleaned text to numerical feature vectors'],
    ['Random Forest Model','scikit-learn','Predict job category from feature vector'],
    ['Skill Matcher','Custom Python','Score candidate against HR-defined required skills'],
    ['Decision Engine','Custom Python','Combine ML prediction + score into Selected/Rejected'],
    ['Database','SQLite (resumes.db)','Persist HR requirements, candidate profiles, skills'],
    ['Analytics','Plotly, pandas','Visualize application trends and metrics'],
])

heading('2.3 Data Flow', 2)
for s in [
    'Candidate uploads resume (PDF/DOCX/TXT)',
    'Text is extracted from the file using PyPDF2 or docx2txt',
    'Text is cleaned: lowercase, remove special chars, remove stopwords',
    'Cleaned text is transformed by TF-IDF vectorizer (cv.pickle)',
    'Feature vector is passed to Random Forest model (RF.joblib)',
    'Model predicts job category (one of 25 classes)',
    'Skill match score is computed against HR required skills from database',
    'Decision: score >= 50% = Selected, else = Rejected with reasoning',
    'Result and reasoning stored in SQLite employees table',
    'HR dashboard displays ranked candidates sorted by score descending',
]:
    bullet(s)

# ── SECTION 3 ───────────────────────────────────────────────────────────────
heading('3. ML Paradigm Identification', 1)

heading('3.1 Paradigm: Supervised Learning — Multi-Class Classification', 2)
para('This system uses Supervised Learning, specifically a Multi-Class Classification approach.')

heading('3.2 Justification', 2)
table(['Aspect','Explanation'],[
    ['Labeled training data','The dataset contains 3,446 resumes each labeled with a specific job category (e.g., "Python Developer", "Data Science", "HR"). This labeled structure is the defining characteristic of supervised learning.'],
    ['Discrete output classes','The model must assign each resume to exactly one of 25 predefined job categories — a classic multi-class classification problem.'],
    ['No unsupervised alternative','Clustering (unsupervised) would group resumes by similarity but cannot assign meaningful job category labels without ground truth.'],
    ['No regression needed','The target variable is categorical (job role), not continuous, ruling out regression.'],
    ['Deep learning not required','The dataset size (3,446 samples) is insufficient to train deep neural networks effectively. Ensemble methods like Random Forest achieve comparable accuracy with far less data and compute.'],
])

heading('3.3 Algorithm Selection Rationale', 2)
para('The Random Forest Classifier was chosen as the primary algorithm:')
bullet('Handles high-dimensional sparse feature spaces (TF-IDF produces thousands of features)')
bullet('Naturally supports multi-class classification without modification')
bullet('Resistant to overfitting through ensemble averaging of 500 decision trees')
bullet('Provides feature importance scores for interpretability')
bullet('Achieves 87% accuracy on this dataset — highest among all evaluated algorithms')

heading('3.4 Feature Extraction: TF-IDF', 2)
para('Since the input is raw text, a feature extraction step is required before ML. TF-IDF (Term Frequency–Inverse Document Frequency) was selected because:')
bullet('It quantifies the importance of each word relative to the entire corpus')
bullet('It down-weights common words (e.g., "work", "team") and up-weights domain-specific terms (e.g., "kubernetes", "tensorflow")')
bullet('It produces a sparse numerical matrix compatible with scikit-learn classifiers')
bullet('It is computationally efficient for the dataset size')

# ── SECTION 4 ───────────────────────────────────────────────────────────────
heading('4. Dataset Planning', 1)

heading('4.1 Dataset Source', 2)
table(['Dataset','Source','Link'],[
    ['Resume Dataset','Gaurav Dutt','kaggle.com/datasets/gauravduttakiit/resume-dataset'],
    ['Resume Dataset','Sneha Anbhawal','kaggle.com/datasets/snehaanbhawal/resume-dataset'],
])
para('The merged dataset is stored as UpdatedResumeDataSet.csv.')

heading('4.2 Dataset Description', 2)
table(['Property','Value'],[
    ['Total samples','3,446 resumes'],
    ['Number of categories','25 job roles'],
    ['File format','CSV (two columns: Resume, Category)'],
    ['Language','English'],
    ['Average resume length','~300–800 words after cleaning'],
])

heading('4.3 Category Distribution', 2)
para('The 25 job categories covered:', italic=True)
para('Advocate, Arts, Automation Testing, Blockchain, Business Analyst, Civil Engineer, Data Science, Database, DevOps Engineer, DotNet Developer, ETL Developer, Electrical Engineering, HR, Hadoop, Health and Fitness, Java Developer, Mechanical Engineer, Network Security Engineer, Operations Manager, PMO, Python Developer, SAP Developer, Sales, Testing, Web Designing.')

heading('4.4 Preprocessing Needs', 2)
table(['Issue','Preprocessing Step'],[
    ['Mixed case text','Lowercase conversion'],
    ['Punctuation and symbols','Regex-based removal of non-alphabetic characters'],
    ['Common noise words','NLTK English stopword removal'],
    ['Inflected word forms','WordNet Lemmatization (managing to manage)'],
    ['Short noise tokens','Remove words with fewer than 3 characters'],
    ['Class imbalance','SMOTE-Tomek oversampling/undersampling'],
    ['Categorical labels','LabelEncoder integer mapping'],
    ['Raw text to numbers','TF-IDF vectorization (5,000 features)'],
])

heading('4.5 Data Quality Notes', 2)
bullet('No missing values in either the Resume or Category columns')
bullet('Some duplicate category naming exists (e.g., "ARTS" vs "Arts") — resolved by label encoding')
bullet('Resume text quality varies: some contain structured sections (Skills, Experience) while others are free-form paragraphs')

# ── SECTION 5 ───────────────────────────────────────────────────────────────
heading('5. Technical Planning', 1)

heading('5.1 Technology Stack', 2)
table(['Layer','Technology','Purpose'],[
    ['Language','Python 3.11','Core development language'],
    ['Web Framework','Streamlit','Interactive web UI for HR and candidates'],
    ['ML Library','scikit-learn','TF-IDF, Random Forest, LabelEncoder, metrics'],
    ['NLP','NLTK','Stopwords, lemmatization, tokenization'],
    ['PDF Parsing','PyPDF2','Extract text from PDF resumes'],
    ['DOCX Parsing','docx2txt','Extract text from Word documents'],
    ['Data Processing','pandas, numpy','Dataset manipulation and feature engineering'],
    ['Visualization','Plotly','Interactive charts in analytics dashboard'],
    ['Database','SQLite (sqlite3)','Lightweight persistent storage'],
    ['Model Serialization','joblib, pickle','Save and load trained model artifacts'],
    ['Class Balancing','imbalanced-learn','SMOTE-Tomek resampling'],
    ['Model Training','Jupyter Notebook','Exploratory training and algorithm comparison'],
])

heading('5.2 Expected Technical Challenges', 2)
table(['Challenge','Description','Mitigation Strategy'],[
    ['Text extraction quality','Stylized PDFs with columns, tables, or images may produce garbled or incomplete text','Use PyPDF2 for standard PDFs; validate extracted content length before processing'],
    ['Class imbalance','Some job categories have significantly more training samples than others, biasing the model','Apply SMOTE-Tomek resampling to balance class distribution before training'],
    ['Vocabulary mismatch','Resumes using synonyms (e.g., "cloud infrastructure" vs "AWS") may be misclassified','Add a rule-based hybrid correction layer on top of ML predictions for known edge cases'],
    ['Category overlap','Adjacent job roles (e.g., Data Science vs Python Developer) share significant vocabulary','Use TF-IDF sublinear scaling and increase vocabulary size to better distinguish overlapping categories'],
    ['Model loading latency','Loading RF.joblib on every request would cause slow response times','Use @st.cache_resource to load model once at startup and reuse across all sessions'],
    ['SQLite thread safety','Streamlit runs in multi-threaded mode which can cause SQLite locking errors','Use check_same_thread=False on SQLite connection'],
    ['Scalability','SQLite is not suitable for high-concurrency production deployments','Migrate to PostgreSQL or MySQL for production; SQLite sufficient for academic demonstration'],
    ['Unseen job categories','Resumes for job roles not in training set will be misclassified','Display predicted category with confidence note; plan for periodic model retraining'],
])

heading('5.3 Development Plan', 2)
table(['Phase','Tasks'],[
    ['Phase 1 — Data & Model','Dataset collection, preprocessing pipeline, model training, evaluation'],
    ['Phase 2 — Backend','Database schema design, SQLite setup, query layer'],
    ['Phase 3 — Frontend','Streamlit candidate portal, HR dashboard, analytics page'],
    ['Phase 4 — Integration','Connect ML model to UI, wire database reads/writes, end-to-end testing'],
    ['Phase 5 — Refinement','Add hybrid correction layer, improve UI, performance testing'],
])

# ── SECTION 6 ───────────────────────────────────────────────────────────────
heading('6. Conclusion', 1)
para('This milestone establishes the complete product plan for the AI Resume Screening System. The problem is clearly defined — automating the manual resume screening process for HR teams using supervised ML. The system architecture covers all layers from the web UI through the ML core to the database. The supervised multi-class classification paradigm using Random Forest and TF-IDF is well-justified for this task. The dataset is identified, its preprocessing needs are documented, and the full technology stack with realistic technical challenges and mitigation strategies is planned. The project is ready to proceed to implementation in Milestone 2.')

# ── REFERENCES ───────────────────────────────────────────────────────────────
heading('References', 1)
for i, r in enumerate([
    'Kaggle Resume Dataset — Gaurav Dutt: kaggle.com/datasets/gauravduttakiit/resume-dataset',
    'Kaggle Resume Dataset — Sneha Anbhawal: kaggle.com/datasets/snehaanbhawal/resume-dataset',
    'Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. JMLR, 12, 2825-2830.',
    'Streamlit Documentation: docs.streamlit.io',
    'Breiman, L. (2001). Random Forests. Machine Learning, 45(1), 5-32.',
    'Bird, S., Klein, E., & Loper, E. (2009). Natural Language Processing with Python. O\'Reilly Media.',
], 1):
    para(f'{i}. {r}')

doc.save('Track_B_Milestone_1_Report.docx')
print('SUCCESS: Track_B_Milestone_1_Report.docx saved')
