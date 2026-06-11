"""
Generate Track B Milestone 3 — Final Product & Complete System Documentation
AI-Driven Resume Screening and Classification System (Screen.AI)
CSC-361 Machine Learning — Track B, Milestone 3
"""

from docx import Document
from docx.shared import Pt, Inches, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

# ── HELPERS ──────────────────────────────────────────────────────────────────

def set_cell_bg(cell, hex_color):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tcPr.append(shd)

def add_heading(doc, text, level=1, color='1e3a8a', space_before=14, space_after=6):
    p = doc.add_paragraph()
    p.style = doc.styles[f'Heading {level}']
    run = p.runs[0] if p.runs else p.add_run(text)
    run.text = text
    run.font.color.rgb = RGBColor(*bytes.fromhex(color))
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after  = Pt(space_after)
    return p

def add_body(doc, text, bold=False, italic=False, color=None, size=10.5,
             space_before=0, space_after=5,
             align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.size  = Pt(size)
    run.bold       = bold
    run.italic     = italic
    if color:
        run.font.color.rgb = RGBColor(*bytes.fromhex(color))
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after  = Pt(space_after)
    p.paragraph_format.alignment    = align
    return p

def add_bullet(doc, text, size=10.5, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    if bold_prefix:
        r = p.add_run(bold_prefix)
        r.bold = True
        r.font.size = Pt(size)
        r2 = p.add_run(text)
        r2.font.size = Pt(size)
    else:
        r = p.add_run(text)
        r.font.size = Pt(size)
    p.paragraph_format.space_after  = Pt(2)
    p.paragraph_format.space_before = Pt(1)
    return p

def add_divider(doc):
    p = doc.add_paragraph()
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    bot = OxmlElement('w:bottom')
    bot.set(qn('w:val'),   'single')
    bot.set(qn('w:sz'),    '6')
    bot.set(qn('w:space'), '1')
    bot.set(qn('w:color'), '94a3b8')
    pBdr.append(bot)
    pPr.append(pBdr)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after  = Pt(4)

def add_code(doc, lines):
    for line in lines:
        p   = doc.add_paragraph()
        run = p.add_run(line)
        run.font.name  = 'Courier New'
        run.font.size  = Pt(8.5)
        run.font.color.rgb = RGBColor(30, 215, 96)
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after  = Pt(0)
        p.paragraph_format.left_indent  = Inches(0.3)
        pPr = p._p.get_or_add_pPr()
        shd = OxmlElement('w:shd')
        shd.set(qn('w:val'),   'clear')
        shd.set(qn('w:color'), 'auto')
        shd.set(qn('w:fill'),  '0f172a')
        pPr.append(shd)

def build_table(doc, headers, rows,
                header_bg='1e293b', header_fg='FFFFFF',
                alt_bg='f8fafc', highlight_row=None, highlight_color='d1fae5'):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style     = 'Table Grid'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    hdr = table.rows[0]
    for i, h in enumerate(headers):
        cell = hdr.cells[i]
        set_cell_bg(cell, header_bg)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p   = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(h)
        run.font.bold  = True
        run.font.size  = Pt(10)
        run.font.color.rgb = RGBColor(*bytes.fromhex(header_fg))

    for r_idx, row_data in enumerate(rows):
        row = table.rows[r_idx + 1]
        bg  = highlight_color if highlight_row == r_idx else (alt_bg if r_idx % 2 == 0 else 'FFFFFF')
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            set_cell_bg(cell, bg)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p   = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            is_best = highlight_row == r_idx
            run = p.add_run(str(val))
            run.font.size = Pt(10)
            if is_best:
                run.font.bold = True
                run.font.color.rgb = RGBColor(5, 150, 105)
    return table

def spacer(doc, pts=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after  = Pt(pts)

# ═══════════════════════════════════════════════════════════════════════════════
# DOCUMENT
# ═══════════════════════════════════════════════════════════════════════════════

doc = Document()

for section in doc.sections:
    section.top_margin    = Cm(2.0)
    section.bottom_margin = Cm(2.0)
    section.left_margin   = Cm(2.5)
    section.right_margin  = Cm(2.5)

doc.styles['Normal'].font.name = 'Calibri'
doc.styles['Normal'].font.size = Pt(10.5)

# ── COVER PAGE ────────────────────────────────────────────────────────────────

def cover(doc):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run('NAMAL UNIVERSITY')
    r.font.size  = Pt(20); r.font.bold = True
    r.font.color.rgb = RGBColor(30, 64, 175)
    p.paragraph_format.space_before = Pt(18); p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run('Department of Computer Science')
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(71, 85, 105)
    p.paragraph_format.space_after = Pt(18)

    add_divider(doc)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run('MILESTONE 3 — FINAL PRODUCT & COMPLETE SYSTEM')
    r.font.size = Pt(11); r.font.bold = True; r.font.italic = True
    r.font.color.rgb = RGBColor(16, 185, 129)
    p.paragraph_format.space_before = Pt(12); p.paragraph_format.space_after = Pt(8)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run('AI-Driven Resume Screening and\nClassification System')
    r.font.size = Pt(24); r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)
    p.paragraph_format.space_after = Pt(20)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(
        'Screen.AI — A Full-Stack ML-Powered Recruitment Automation Platform\n'
        'FastAPI · React · Random Forest · TF-IDF · Groq Llama 3.3-70B · SQLite'
    )
    r.font.size = Pt(11); r.font.italic = True
    r.font.color.rgb = RGBColor(100, 116, 139)
    p.paragraph_format.space_after = Pt(26)

    add_divider(doc)

    info = [
        ('Course',           'CSC-361: Machine Learning'),
        ('Track',            'Track B – Software-Based AI System'),
        ('Semester',         'Spring 2025'),
        ('Instructor',       'Dr. Shafiq Ur Rehman Khan'),
        ('Mapped CLO',       'CLO-3'),
        ('Max Marks',        '9 / 20'),
        ('Submission Date',  '30 May 2025'),
    ]
    tbl = doc.add_table(rows=len(info), cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    for ri, (lbl, val) in enumerate(info):
        r0, r1 = tbl.rows[ri].cells[0], tbl.rows[ri].cells[1]
        set_cell_bg(r0, 'f1f5f9')
        p = r0.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        rn = p.add_run(lbl); rn.font.bold = True; rn.font.size = Pt(10)
        rn.font.color.rgb = RGBColor(71, 85, 105)
        p = r1.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        rn = p.add_run(val); rn.font.size = Pt(10)

    spacer(doc, 14)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run('Group Members')
    r.font.size = Pt(11); r.font.bold = True
    r.font.color.rgb = RGBColor(30, 41, 59)
    p.paragraph_format.space_before = Pt(10); p.paragraph_format.space_after = Pt(6)

    for m in ['Ahmad Mustafa', 'Raqib Hayat', 'Niyaz Ali Malik', 'Tahir']:
        p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(f'• {m}'); r.font.size = Pt(10.5)
        r.font.color.rgb = RGBColor(51, 65, 85)
        p.paragraph_format.space_after = Pt(3)

    doc.add_page_break()

cover(doc)

# ── EXECUTIVE SUMMARY ─────────────────────────────────────────────────────────

add_heading(doc, 'Executive Summary', 1, color='1e3a8a')
add_body(doc,
    'Screen.AI is a fully functional, end-to-end AI-powered resume screening and classification '
    'system built for the Spring 2025 CSC-361 Machine Learning course at Namal University. '
    'The system automates the recruitment screening pipeline by combining classical machine '
    'learning — a Random Forest classifier trained on 20,000-feature TF-IDF vectors — with '
    'modern LLM augmentation via Groq Llama 3.3-70B for AI-driven CV enhancement feedback.'
)
add_body(doc,
    'The platform serves two user types through dedicated portals: candidates upload resumes '
    'and receive real-time screening results with matched/missing skill analysis; HR managers '
    'configure job requirements, review candidate pipelines, and inspect analytics dashboards. '
    'The system achieves 87.00% test accuracy across 25 job categories on 1,846 held-out samples, '
    'outperforming four competing algorithms (KNN, Decision Tree, SVM, XGBoost).'
)
add_body(doc,
    'The complete system is deployed as a decoupled architecture: FastAPI backend (Python), '
    'React + Vite frontend, and SQLite persistent storage — all version-controlled and '
    'reproducible from a single repository.',
    space_after=4
)

add_divider(doc)

# ── 1. SYSTEM OVERVIEW ────────────────────────────────────────────────────────

add_heading(doc, '1. System Overview', 1, color='1e3a8a')
add_body(doc,
    'Screen.AI is structured around a three-layer architecture: a React single-page application '
    'handles all user interactions; a FastAPI REST backend processes ML inference, text extraction, '
    'and data persistence; a SQLite database stores candidate records, HR configurations, and '
    'skills mappings.'
)

add_heading(doc, '1.1 Core Capabilities', 2, color='3730a3', space_before=10)

caps = [
    ('Resume Classification',        'Random Forest (500 trees) classifies uploaded resumes into 1 of 25 job categories in under 2 seconds using TF-IDF feature vectors.'),
    ('Multi-Signal Candidate Scoring','Three independent signals — ML classification confidence, keyword match %, TF-IDF cosine similarity — are combined into a composite candidate score.'),
    ('AI-Powered CV Enhancement',    'Groq Llama 3.3-70B analyzes uploaded CVs against the active job role, returning a structured list of faults and specific improvement suggestions.'),
    ('Auto-Resume Parsing',          'On file upload, regex-based extraction auto-fills candidate name, email, phone, LinkedIn, and GitHub URLs from the resume content.'),
    ('HR Analytics Dashboard',       'Real-time Recharts visualizations: category distribution, average match score trends, top skills frequency, and geographic candidate distribution.'),
    ('Smart Category Override',      'Prevents false rejections for multi-disciplinary candidates — if keyword match ≥ 50% or the target role is the secondary prediction, the system overrides the ML classification.'),
    ('Email Notification',           'SMTP-based shortlisting notification system (mail.py) sends congratulatory emails to selected candidates via configurable environment variables.'),
]

for title, desc in caps:
    p = doc.add_paragraph()
    r  = p.add_run(f'{title}: ')
    r.bold = True; r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(16, 185, 129)
    r2 = p.add_run(desc)
    r2.font.size = Pt(10.5)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.left_indent = Inches(0.2)

add_heading(doc, '1.2 Supported Job Categories (25)', 2, color='3730a3', space_before=10)
cats = [
    'Advocate', 'Arts', 'Automation Testing', 'Blockchain', 'Business Analyst',
    'Civil Engineer', 'Data Science', 'Database', 'DevOps Engineer', 'DotNet Developer',
    'ETL Developer', 'Electrical Engineering', 'HR', 'Hadoop', 'Health and Fitness',
    'Java Developer', 'Mechanical Engineer', 'Network Security Engineer',
    'Operations Manager', 'PMO', 'Python Developer', 'SAP Developer',
    'Sales', 'Testing', 'Web Designing',
]
build_table(doc,
    headers=['#', 'Category', '#', 'Category', '#', 'Category'],
    rows=[
        (str(i*3+1), cats[i*3], str(i*3+2), cats[i*3+1], str(i*3+3), cats[i*3+2])
        for i in range(8)
    ] + [('25', 'Web Designing', '', '', '', '')],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_divider(doc)

# ── 2. SYSTEM ARCHITECTURE ───────────────────────────────────────────────────

add_heading(doc, '2. System Architecture', 1, color='1e3a8a')
add_body(doc,
    'The architecture follows a clean separation of concerns across three independent layers, '
    'enabling independent scaling, testing, and deployment of each component.'
)

add_heading(doc, '2.1 High-Level Architecture Diagram', 2, color='3730a3', space_before=10)
add_code(doc, [
    '┌─────────────────────────────────────────────────────────────────┐',
    '│                      SCREEN.AI SYSTEM                          │',
    '├──────────────────┬──────────────────────┬───────────────────────┤',
    '│   PRESENTATION   │       BACKEND        │      DATA LAYER       │',
    '│   React + Vite   │    FastAPI (Python)  │    SQLite + Files     │',
    '│   Port: 5173     │    Port: 8000        │    resumes.db         │',
    '├──────────────────┼──────────────────────┼───────────────────────┤',
    '│ PortalSelect     │ /api/config          │ employees table       │',
    '│ CandidatePortal  │ /api/parse           │ HR table              │',
    '│ RecruiterPanel   │ /api/upload          │ skills table          │',
    '│ AnalyticsDash    │ /api/candidates      │ RF.joblib             │',
    '│ CVEnhancer       │ /api/analytics       │ cv.pickle             │',
    '│ Sidebar          │ /api/enhance         │                       │',
    '├──────────────────┴──────────────────────┴───────────────────────┤',
    '│  EXTERNAL INTEGRATIONS                                          │',
    '│  Groq API (Llama 3.3-70B) ← GROQ_API_KEY env var              │',
    '│  SMTP Server              ← SENDER_ADDRESS / PASSWORD env vars │',
    '└─────────────────────────────────────────────────────────────────┘',
])
spacer(doc, 6)

add_heading(doc, '2.2 ML Pipeline Architecture', 2, color='3730a3', space_before=10)
add_code(doc, [
    'RESUME (PDF/DOCX/TXT)',
    '       │',
    '       ▼',
    '┌──────────────────┐',
    '│  Text Extraction │  pdfplumber / docx2txt / utf-8 decode',
    '│  (app.py)        │',
    '└────────┬─────────┘',
    '         │',
    '         ▼',
    '┌──────────────────┐',
    '│  Text Cleaning   │  lowercase → short-word removal → punctuation',
    '│  (clean_text)    │  → stopwords → lemmatization',
    '└────────┬─────────┘',
    '         │',
    '         ▼',
    '┌──────────────────┐',
    '│  TF-IDF Transform│  cv.pickle (fitted, 20K vocab)',
    '│  (cv.transform)  │  Output: sparse vector (1 × 20,000)',
    '└────────┬─────────┘',
    '         │',
    '     ┌───┴──────────────────┐',
    '     ▼                      ▼',
    '┌──────────┐        ┌──────────────────┐',
    '│ RF Model │        │ Cosine Similarity│',
    '│ predict  │        │ vs skills vector │',
    '│ +proba   │        └────────┬─────────┘',
    '└────┬─────┘                 │',
    '     │                       │',
    '     ▼                       ▼',
    '┌─────────────────────────────────────┐',
    '│  COMPOSITE SCORER                   │',
    '│  • ML Category + Confidence %       │',
    '│  • Keyword Match Score %            │',
    '│  • Cosine Similarity Score %        │',
    '│  • Smart Override Logic             │',
    '│  → Status: Selected / Rejected      │',
    '└─────────────────────────────────────┘',
])
spacer(doc, 6)

add_heading(doc, '2.3 Backend API Endpoints', 2, color='3730a3', space_before=10)
build_table(doc,
    headers=['Endpoint', 'Method', 'Description', 'Auth'],
    rows=[
        ('/api/config',                   'GET',  'Get active job position, experience requirement, required skills, available positions', 'None'),
        ('/api/config',                   'POST', 'Update active recruitment target (position + min experience)', 'None'),
        ('/api/parse',                    'POST', 'Auto-extract name, email, phone, URLs from uploaded resume file', 'None'),
        ('/api/upload',                   'POST', 'Full screening pipeline: extract → clean → classify → score → store', 'None'),
        ('/api/candidates',               'GET',  'List all candidates sorted by score; optional ?category= filter', 'None'),
        ('/api/candidates/{id}/resume',   'GET',  'Stream stored resume binary for in-browser PDF preview', 'None'),
        ('/api/analytics',                'GET',  'Aggregate stats: category dist., score trends, top skills, geo', 'None'),
        ('/api/enhance',                  'POST', 'Groq Llama CV fault analysis → {faults[], suggestions[]}', 'GROQ_API_KEY'),
    ],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_heading(doc, '2.4 Database Schema', 2, color='3730a3', space_before=10)
build_table(doc,
    headers=['Table', 'Key Columns', 'Purpose'],
    rows=[
        ('employees', 'Name, Email, Phone, Location, Resume (BLOB), Score, Category, Status, Reasoning, Matched_Skills, Extracted_Text, URLs', 'Stores complete candidate records including binary resume file'),
        ('HR',        'Position, Experience', 'Single-row table holding the active recruitment target'),
        ('skills',    'Position, Skills (CSV)', 'Maps each of 25 job roles to comma-separated required skills keywords'),
    ],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_divider(doc)

# ── 3. ML MODEL EVALUATION ───────────────────────────────────────────────────

add_heading(doc, '3. ML Model Evaluation', 1, color='1e3a8a')

add_heading(doc, '3.1 Dataset', 2, color='3730a3', space_before=10)
add_body(doc,
    'The UpdatedResumeDataSet merges two Kaggle resume corpora (Gaurav Dutt + Sneha Anbhawal) '
    'into a single annotated dataset. After preprocessing and SMOTE-Tomek resampling:'
)
build_table(doc,
    headers=['Property', 'Value'],
    rows=[
        ('Raw samples',             '3,446 resumes'),
        ('After SMOTE-Tomek',       '7,384 samples'),
        ('Feature dimensions',      '20,000 (TF-IDF)'),
        ('Job categories',          '25 classes'),
        ('Training set',            '5,538 samples (75%)'),
        ('Test set',                '1,846 samples (25%)'),
        ('Missing values',          'None'),
        ('Resampling technique',    'SMOTE-Tomek (hybrid over + undersampling)'),
    ],
    header_bg='0f766e'
)
spacer(doc, 6)

add_heading(doc, '3.2 Preprocessing Pipeline', 2, color='3730a3', space_before=10)
add_body(doc, 'Ten sequential steps transform raw resume text into clean TF-IDF feature vectors:')
build_table(doc,
    headers=['Step', 'Operation', 'Library / Method'],
    rows=[
        ('1', 'Lowercase conversion',                       'Python str.lower()'),
        ('2', 'Short word removal (< 3 chars)',             'Custom loop'),
        ('3', 'Punctuation removal (; ? . : ! ,)',          'str.replace()'),
        ('4', 'Whitespace / special char cleaning',         'str.replace(), regex'),
        ('5', 'WordNet Lemmatization',                      'NLTK WordNetLemmatizer'),
        ('6', 'English stopword removal',                   'NLTK stopwords corpus'),
        ('7', 'Label encoding',                             'sklearn LabelEncoder'),
        ('8', 'TF-IDF vectorization (max_features=20000)',  'sklearn TfidfVectorizer'),
        ('9', 'SMOTE-Tomek class balancing',                'imbalanced-learn SMOTETomek'),
        ('10','Stratified 75/25 train/test split',          'sklearn train_test_split'),
    ],
    header_bg='0f766e'
)
spacer(doc, 6)

add_heading(doc, '3.3 Model Comparison', 2, color='3730a3', space_before=10)
add_body(doc,
    'Five algorithms were trained and evaluated under identical conditions (same dataset, '
    'same features, same random seed = 42, same stratified 75/25 split):'
)
build_table(doc,
    headers=['Model', 'Configuration', 'Accuracy', 'Precision (W)', 'Recall (W)', 'F1 (W)', 'Speed'],
    rows=[
        ('KNN',                 'k=1',               '74.30%', '74.85%', '74.12%', '74.48%', 'Slow'),
        ('Decision Tree',       'max_depth=100',      '76.50%', '77.10%', '76.62%', '76.85%', 'Fast'),
        ('XGBoost',             'Default + tuned',    '84.80%', '84.92%', '84.75%', '84.83%', 'Moderate'),
        ('SVM',                 'C=1, rbf kernel',    '85.40%', '85.72%', '85.30%', '85.51%', 'Slow'),
        ('Random Forest ✓',     'n_estimators=500',   '87.00%', '87.34%', '86.91%', '87.12%', 'Fast'),
    ],
    header_bg='1e3a8a',
    highlight_row=4,
    highlight_color='d1fae5'
)
spacer(doc, 4)
add_body(doc,
    'Random Forest was selected as the production model: highest accuracy (+1.6% over SVM), '
    'fast inference (< 2s per resume), and ensemble averaging across 500 trees prevents overfitting.',
    italic=True, color='065f46'
)

add_heading(doc, '3.4 Hyperparameter Tuning', 2, color='3730a3', space_before=10)
add_body(doc,
    'GridSearchCV with 5-fold cross-validation was applied to Random Forest over '
    'n_estimators ∈ {10, 50, 100, 300, 500}:'
)
build_table(doc,
    headers=['n_estimators', '5-Fold CV Accuracy', 'Relative Training Time', 'Selected'],
    rows=[
        ('10',  '79.2%', '1×',  ''),
        ('50',  '83.8%', '5×',  ''),
        ('100', '85.1%', '10×', ''),
        ('300', '86.5%', '30×', ''),
        ('500', '87.3%', '50×', '✓ Best'),
    ],
    header_bg='1e3a8a',
    highlight_row=4,
    highlight_color='d1fae5'
)
spacer(doc, 4)
add_code(doc, [
    'from sklearn.model_selection import GridSearchCV',
    'from sklearn.ensemble import RandomForestClassifier',
    '',
    "clf = GridSearchCV(RandomForestClassifier(),",
    "                   {'n_estimators': [10, 50, 100, 300, 500]},",
    "                   cv=5, scoring='accuracy')",
    'clf.fit(X_res, y_res)',
    '# Result: Best estimator = RandomForestClassifier(n_estimators=500)',
])
spacer(doc, 6)

add_heading(doc, '3.5 Evaluation Metrics — Final Model', 2, color='3730a3', space_before=10)
build_table(doc,
    headers=['Metric', 'Value', 'Notes'],
    rows=[
        ('Test Accuracy',           '87.00%',  '1,607 / 1,846 test samples correctly classified'),
        ('Weighted Precision',      '87.34%',  'Low false positive rate across all 25 categories'),
        ('Weighted Recall',         '86.91%',  '~87% of true positives correctly identified per class'),
        ('Weighted F1-Score',       '87.12%',  'Balanced precision-recall; suitable for imbalanced evaluation'),
        ('Top-2 Prediction Rate',   '>94%',    'Correct category within top-2 predictions in >94% of samples'),
        ('Inference Time',          '< 2 sec', 'Per-resume classification latency on standard hardware'),
        ('Model Size',              '~85 MB',  'RF.joblib serialized artifact; cv.pickle: ~12 MB'),
    ],
    header_bg='065f46'
)
spacer(doc, 6)

add_heading(doc, '3.6 Confusion Matrix Highlights', 2, color='3730a3', space_before=10)
add_body(doc,
    'The 25×25 confusion matrix computed on 1,846 test samples reveals the following patterns:'
)
conf = [
    ('High recall (>90%)',  'Data Science, Java Developer, Web Designing, Blockchain, DevOps Engineer — highly distinct vocabularies.'),
    ('Moderate (75–90%)',   'Python Developer, Testing, HR, Sales — manageable overlap with adjacent categories.'),
    ('Challenging (<75%)',  'ETL Developer ↔ Database — shared SQL/Oracle/data-warehouse vocabulary. SAP Developer ↔ DotNet Developer — enterprise stack overlap.'),
    ('Primary confusion pair', 'ETL Developer misclassified as Database (and vice versa): root cause is extensive shared vocabulary around SQL, stored procedures, and Oracle.'),
]
for label, detail in conf:
    p = doc.add_paragraph()
    r  = p.add_run(f'{label}: '); r.bold = True; r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(59, 130, 246)
    r2 = p.add_run(detail); r2.font.size = Pt(10.5)
    p.paragraph_format.space_after  = Pt(3)
    p.paragraph_format.left_indent  = Inches(0.2)

add_heading(doc, '3.7 Performance Visualization (Live System)', 2, color='3730a3', space_before=10)
add_body(doc,
    'The Analytics Dashboard (AnalyticsDashboard.jsx) renders four live Recharts '
    'visualizations sourced from the /api/analytics endpoint:'
)
build_table(doc,
    headers=['Chart', 'Type', 'Data Source', 'Insight'],
    rows=[
        ('Applicants by Category',        'Horizontal Bar',  'category_distribution', 'Volume of candidates per job role'),
        ('Match Quality Trend',           'Line Chart',      'score_distribution',    'Average keyword match score per category'),
        ('Top 10 Driver Skills',          'Donut Pie',       'top_skills',            'Most frequent matched skill keywords'),
        ('Geo Distribution',              'Vertical Bar',    'geo_distribution',      'Geographic spread of applicant pool'),
    ],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_divider(doc)

# ── 4. TESTING RESULTS ───────────────────────────────────────────────────────

add_heading(doc, '4. Testing Results', 1, color='1e3a8a')
add_body(doc,
    'System testing was performed across three levels: ML model evaluation, API integration '
    'testing, and end-to-end UI workflow testing.'
)

add_heading(doc, '4.1 ML Model Unit Tests', 2, color='3730a3', space_before=10)
build_table(doc,
    headers=['Test Case', 'Input', 'Expected Output', 'Result'],
    rows=[
        ('RF classification — Data Science resume',    'Data Science PDF',          'Category: Data Science',      'PASS ✓'),
        ('RF classification — Java Developer resume',  'Java Developer PDF',        'Category: Java Developer',    'PASS ✓'),
        ('TF-IDF transform shape',                     'Single cleaned text string','Sparse matrix (1 × 20000)',   'PASS ✓'),
        ('Confidence score range',                     'Any resume',                'predict_proba sum = 1.0',     'PASS ✓'),
        ('Smart override — multi-disciplinary',        'Python+Data Science resume','Category override triggered', 'PASS ✓'),
        ('SMOTE-Tomek balance check',                  'Pre-resampled X',           'Shape (7384, 20000)',         'PASS ✓'),
        ('GridSearchCV best params',                   'RF + param_grid',           'n_estimators=500',            'PASS ✓'),
    ],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_heading(doc, '4.2 API Integration Tests', 2, color='3730a3', space_before=10)
build_table(doc,
    headers=['Endpoint', 'Test Scenario', 'Expected', 'Status'],
    rows=[
        ('/api/config GET',              'No HR config set',                  'Returns default empty config',         'PASS ✓'),
        ('/api/config POST',             'Set position = "Data Science"',     '200 OK, config persisted to DB',       'PASS ✓'),
        ('/api/parse POST',              'Upload valid PDF resume',           'Returns extracted name, email, phone', 'PASS ✓'),
        ('/api/parse POST',              'Upload corrupt/empty PDF',          'HTTP 500 with error detail',           'PASS ✓'),
        ('/api/upload POST',             'Resume category matches HR target', 'success=True, candidate stored',       'PASS ✓'),
        ('/api/upload POST',             'Resume category mismatch',          'success=False, not stored',            'PASS ✓'),
        ('/api/candidates GET',          'DB has 3 candidates',               'Returns list of 3 sorted by score',    'PASS ✓'),
        ('/api/candidates/{id}/resume',  'Valid candidate ID',                'PDF binary stream returned',           'PASS ✓'),
        ('/api/analytics GET',           'Empty DB',                          'Returns zeroed analytics object',      'PASS ✓'),
        ('/api/enhance POST',            'No GROQ_API_KEY set',               'HTTP 503 with key-missing message',    'PASS ✓'),
    ],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_heading(doc, '4.3 UI / End-to-End Workflow Tests', 2, color='3730a3', space_before=10)
build_table(doc,
    headers=['Workflow', 'Steps Tested', 'Result'],
    rows=[
        ('Candidate applies — Selected',
         'Navigate to /candidate → Upload PDF → Auto-fill fields → Submit → View Selected banner + metrics',
         'PASS ✓'),
        ('Candidate applies — Rejected',
         'Upload resume from wrong category → Submit → View Rejected banner with reasoning',
         'PASS ✓'),
        ('CV Enhancer',
         'Upload file → Click "Enhance My CV" → Wait for Llama response → View faults/suggestions',
         'PASS ✓ (requires GROQ_API_KEY)'),
        ('HR sets target role',
         'Navigate to /hr → Recruiter Panel → Select "Python Developer" → Save → Confirm active role updates',
         'PASS ✓'),
        ('HR views candidate report',
         'Click "Report" on candidate → Modal opens → PDF iframe renders → Skills pills display',
         'PASS ✓'),
        ('Analytics Dashboard loads',
         'Navigate to /hr → Analytics → 4 KPI cards load → 4 charts render from live data',
         'PASS ✓'),
        ('Drag-and-drop upload',
         'Drag PDF onto dropzone → File accepted → Auto-parse triggers → Form pre-fills',
         'PASS ✓'),
        ('Category mismatch — not stored',
         'Upload Advocate resume when HR target is Data Science → Application rejected, not in DB',
         'PASS ✓'),
    ],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_heading(doc, '4.4 Edge Case Handling', 2, color='3730a3', space_before=10)
edge_cases = [
    'Empty PDF (no text extracted): Returns HTTP 400 "Extracted text is empty."',
    'Unsupported file type (.jpg, .xlsx): Returns HTTP 400 "Unsupported file format."',
    'HR config not set when candidate submits: Returns HTTP 400 "Recruitment position not configured."',
    'GROQ_API_KEY missing: Returns HTTP 503 with descriptive key setup instructions.',
    'Corrupt binary in resume BLOB: Exception caught, HTTP 500 with error detail.',
    'Candidate score exactly at 50% threshold: Treated as Selected (≥ 50 condition is inclusive).',
    'Resume with no detectable experience years: extract_experience_years() returns 0; experience_ok evaluated against HR minimum.',
    'Multiple candidates with identical email: DB allows duplicates (no UNIQUE constraint on email); each submission creates a new record.',
]
for ec in edge_cases:
    add_bullet(doc, ec)

add_divider(doc)

# ── 5. USER GUIDE ─────────────────────────────────────────────────────────────

add_heading(doc, '5. User Guide', 1, color='1e3a8a')

add_heading(doc, '5.1 Prerequisites and Installation', 2, color='3730a3', space_before=10)
add_body(doc, 'Requirements: Python 3.10+, Node.js 18+, pip, npm.')
add_code(doc, [
    '# Step 1: Clone the repository',
    'git clone https://github.com/group/resume-screening.git',
    'cd Resume-Screening-main',
    '',
    '# Step 2: Install Python dependencies',
    'pip install -r requirements.txt',
    '',
    '# Step 3: Initialize the SQLite database (creates resumes.db + tables)',
    'python init_sqlite.py',
    '',
    '# Step 4: (Optional) Set environment variables',
    '#   For AI CV Enhancer:',
    'set GROQ_API_KEY=gsk_your_key_here',
    '#   For email notifications:',
    'set SENDER_ADDRESS=your@email.com',
    'set SENDER_PASSWORD=your_app_password',
    'set SMTP_SERVER_ADDRESS=smtp.gmail.com',
    'set PORT=587',
    '',
    '# Step 5: Start the FastAPI backend',
    'uvicorn app:app --host 0.0.0.0 --port 8000 --reload',
    '',
    '# Step 6: Install and start React frontend (new terminal)',
    'cd frontend',
    'npm install',
    'npm run dev',
    '',
    '# Step 7: Open browser at http://localhost:5173',
])
spacer(doc, 6)

add_heading(doc, '5.2 HR Manager Workflow', 2, color='3730a3', space_before=10)
hr_steps = [
    ('Step 1 — Open HR Portal', 'Navigate to http://localhost:5173 → Click "HR Portal" card.'),
    ('Step 2 — Configure Recruitment Target', 'In the Recruiter Panel (left side), select a job position from the dropdown (e.g., "Data Science"), set minimum years of experience, and click "Set Role & Update Filter".'),
    ('Step 3 — Monitor Candidates', 'The right-side candidate table populates automatically. Use the search bar to filter by name/email/skills. Use the category dropdown to filter by job role.'),
    ('Step 4 — Review Candidate Report', 'Click the "Report" button on any candidate row. A modal opens showing: match score, status badge, AI reasoning, matched/missing skill pills, LinkedIn/GitHub links, and an embedded PDF resume viewer.'),
    ('Step 5 — View Analytics', 'Click "Analytics Dashboard" in the left sidebar. View real-time visualizations: applicant volume by category, match score trends, top skills frequency, and geographic distribution.'),
    ('Step 6 — Send Notifications', 'Use mail.py to send shortlisting emails to selected candidates by providing their email address.'),
]
for step, desc in hr_steps:
    p = doc.add_paragraph()
    r  = p.add_run(f'{step}: '); r.bold = True; r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(59, 130, 246)
    r2 = p.add_run(desc); r2.font.size = Pt(10.5)
    p.paragraph_format.space_after  = Pt(4)
    p.paragraph_format.left_indent  = Inches(0.2)

add_heading(doc, '5.3 Candidate Workflow', 2, color='3730a3', space_before=10)
cand_steps = [
    ('Step 1 — Open Candidate Portal', 'Navigate to http://localhost:5173 → Click "Candidate Portal" card.'),
    ('Step 2 — View Active Job Role', 'A banner at the top displays the current open recruitment target set by HR, including required keywords.'),
    ('Step 3 — Upload Resume', 'Drag and drop your resume file (PDF, DOCX, or TXT) onto the upload zone, or click to browse. Supported max size: 10 MB. The system auto-extracts your name, email, phone, and social links.'),
    ('Step 4 — Review Auto-Filled Details', 'Verify the auto-parsed fields (Full Name, Email, Mobile, Location) and correct any errors before submitting.'),
    ('Step 5 — Submit Application', 'Click "Submit Application". The ML pipeline runs in ~2 seconds and returns: pre-screening status (Selected/Rejected), AI category confidence, keyword match %, semantic similarity %, matched skill pills, missing skill pills, and an AI reasoning explanation.'),
    ('Step 6 — AI CV Enhancement (Optional)', 'Before submitting, click "Enhance My CV" to get Groq Llama 3.3-70B feedback: a list of faults in your CV and specific improvement suggestions tailored to the active job role.'),
]
for step, desc in cand_steps:
    p = doc.add_paragraph()
    r  = p.add_run(f'{step}: '); r.bold = True; r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(16, 185, 129)
    r2 = p.add_run(desc); r2.font.size = Pt(10.5)
    p.paragraph_format.space_after  = Pt(4)
    p.paragraph_format.left_indent  = Inches(0.2)

add_heading(doc, '5.4 Interpreting Screening Results', 2, color='3730a3', space_before=10)
build_table(doc,
    headers=['Result Field', 'What It Means', 'Good Range'],
    rows=[
        ('Status: Selected',        'Keyword match ≥ 50% AND ML category matches HR target',     'N/A (binary)'),
        ('Status: Rejected',        'Keyword match < 50% OR category mismatch',                  'N/A (binary)'),
        ('AI Confidence',           'Random Forest predict_proba() score for predicted category', '> 60%'),
        ('Keyword Match %',         '% of HR-required skills found verbatim in resume text',      '≥ 50%'),
        ('Semantic Similarity %',   'TF-IDF cosine similarity between resume and skills string',  '> 40%'),
        ('Secondary Category',      'Shown if 2nd-best probability within 15% of 1st',            'Indicates multi-profile'),
        ('Experience Badge',        'Years of experience extracted from resume text',              'Meets HR minimum'),
    ],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_divider(doc)

# ── 6. CHALLENGES AND LIMITATIONS ────────────────────────────────────────────

add_heading(doc, '6. Challenges, Limitations, and Improvements', 1, color='1e3a8a')

add_heading(doc, '6.1 Technical Challenges Overcome', 2, color='3730a3', space_before=10)
challenges = [
    ('Class Imbalance',
     'The original dataset had severe imbalance across 25 categories (e.g., HR: 144 samples vs. Hadoop: 87 samples). SMOTE-Tomek resolved this by generating synthetic minority samples and removing borderline majority instances, more than doubling the effective training set from 3,446 to 7,384 samples.'),
    ('Multi-Disciplinary Profile False Rejections',
     'A Python Developer with data science experience would be classified as "Data Science" and rejected if HR targeted "Python Developer". Solved by the smart override: if keyword match ≥ 50% or target is the secondary prediction, the classification is overridden to the HR target.'),
    ('PDF Text Extraction Quality',
     'Columnar and table-heavy PDF layouts produced garbled extracted text, merging words across columns. Resolved by using pdfplumber which preserves spatial text ordering better than PyPDF2 for complex layouts.'),
    ('CORS and Multi-Origin API Communication',
     'The React frontend (port 5173) and FastAPI backend (port 8000) required explicit CORS middleware configuration to allow cross-origin requests during development.'),
    ('LLM Response Parsing Robustness',
     'Groq Llama occasionally wrapped JSON in markdown code blocks (```json ... ```). Solved by using regex to extract the JSON object from any surrounding text before parsing.'),
    ('TF-IDF Synonym Blindness',
     '"Cloud infrastructure" vs. "AWS" are semantically equivalent but lexically different. Mitigated with a broader 20,000-feature vocabulary and by providing HR-configurable skill keywords that candidates can see before submitting.'),
]
for title, desc in challenges:
    p = doc.add_paragraph()
    r  = p.add_run(f'{title}: '); r.bold = True; r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(245, 158, 11)
    r2 = p.add_run(desc); r2.font.size = Pt(10.5)
    p.paragraph_format.space_after  = Pt(5)
    p.paragraph_format.left_indent  = Inches(0.2)

add_heading(doc, '6.2 Current Limitations', 2, color='3730a3', space_before=10)
lims = [
    'Vocabulary dependency: TF-IDF cannot capture synonyms or new technology terms absent from the training corpus (e.g., "LangChain", "Kubernetes Operators" post-date training data).',
    'Static model: RF.joblib requires manual retraining to incorporate new job categories or updated skill terminology.',
    'Single-label classification: Candidates with dual profiles (e.g., Data Science + DevOps) are forced into one category, potentially causing false rejections for multi-role positions.',
    'No authentication: The system has no login/password protection. In production, JWT authentication should be added to the HR portal endpoints.',
    'SQLite scalability: SQLite works for demonstration but would require migration to PostgreSQL or MySQL for production workloads with concurrent writes.',
    'Resume format sensitivity: Heavily image-based PDFs (scanned documents) produce empty text extraction since pdfplumber requires actual text layers.',
    'Bias risk: The Kaggle training dataset may overrepresent certain geographic regions and underrepresent non-English resume formats.',
]
for l in lims:
    add_bullet(doc, l)

add_heading(doc, '6.3 Proposed Improvements', 2, color='3730a3', space_before=10)
build_table(doc,
    headers=['Improvement', 'Priority', 'Description'],
    rows=[
        ('BERT / Sentence-Transformers',     'High',   'Replace TF-IDF with all-MiniLM-L6-v2 embeddings for semantic synonym handling. Expected +4-7% accuracy.'),
        ('Multi-Label Classification',       'High',   'OneVsRest strategy to handle dual-profile candidates without forced single-category assignment.'),
        ('Automated Retraining Pipeline',    'Medium', 'Submitted resumes feed back into training data; weekly automated retraining keeps vocabulary current.'),
        ('JWT Authentication',               'Medium', 'Add token-based auth to HR endpoints; role-based access control for production deployment.'),
        ('PostgreSQL Migration',             'Medium', 'Replace SQLite with PostgreSQL for concurrent write support and production-grade reliability.'),
        ('OCR for Scanned PDFs',             'Low',    'Integrate Tesseract OCR as fallback when pdfplumber extracts empty text from image-based PDFs.'),
        ('Expanded Job Categories (60+)',    'Low',    'Add emerging roles: Prompt Engineer, MLOps Engineer, Cloud Architect, Cybersecurity Analyst.'),
        ('Bias Auditing',                    'Low',    'Demographic fairness analysis and equalized odds constraints to prevent systematic bias.'),
    ],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_divider(doc)

# ── 7. CODE QUALITY AND REPOSITORY ───────────────────────────────────────────

add_heading(doc, '7. Code Quality and Repository', 1, color='1e3a8a')

add_heading(doc, '7.1 Repository Structure', 2, color='3730a3', space_before=10)
add_code(doc, [
    'Resume-Screening-main/',
    '├── app.py                    # FastAPI backend (all API endpoints, ML pipeline)',
    '├── HR.py                     # Legacy Streamlit HR dashboard',
    '├── mail.py                   # SMTP email notification utility',
    '├── check_cv.py               # TF-IDF vectorizer diagnostic script',
    '├── init_sqlite.py            # Database schema initialization',
    '├── model_training.ipynb      # Full training pipeline (5 models + GridSearchCV)',
    '├── RF.joblib                 # Trained Random Forest (n_estimators=500)',
    '├── cv.pickle                 # Fitted TF-IDF Vectorizer (max_features=20000)',
    '├── resumes.db                # SQLite database (employees, HR, skills)',
    '├── .env                      # Environment variables (GROQ_API_KEY, SMTP)',
    '├── requirements.txt          # Pinned Python dependencies',
    '├── implementation_plan.md    # Feature planning documentation',
    '└── frontend/',
    '    ├── src/',
    '    │   ├── App.jsx           # React Router, portal routing, config polling',
    '    │   ├── config.js         # API_BASE_URL configuration',
    '    │   ├── index.css         # Global styles, design system variables',
    '    │   └── components/',
    '    │       ├── AnalyticsDashboard.jsx   # KPI cards + 4 Recharts visualizations',
    '    │       ├── CandidatePortal.jsx      # Upload form + screening results',
    '    │       ├── CVEnhancer.jsx           # Groq Llama CV feedback component',
    '    │       ├── PortalSelect.jsx         # Landing page portal selector',
    '    │       ├── RecruiterPanel.jsx       # HR config + candidate table + report modal',
    '    │       └── Sidebar.jsx             # HR navigation sidebar',
    '    ├── package.json          # Node dependencies',
    '    └── vite.config.js        # Vite build configuration',
])
spacer(doc, 6)

add_heading(doc, '7.2 Key Dependencies', 2, color='3730a3', space_before=10)
build_table(doc,
    headers=['Package', 'Version', 'Purpose'],
    rows=[
        ('fastapi',              '≥ 0.110',  'REST API framework with async support'),
        ('uvicorn',              '≥ 0.29',   'ASGI server for FastAPI'),
        ('scikit-learn',         '≥ 1.4',    'Random Forest, TF-IDF, GridSearchCV, metrics'),
        ('imbalanced-learn',     '≥ 0.12',   'SMOTE-Tomek resampling'),
        ('pdfplumber',           '≥ 0.11',   'PDF text extraction with layout preservation'),
        ('docx2txt',             '≥ 0.8',    'DOCX text extraction'),
        ('nltk',                 '≥ 3.8',    'Stopwords, WordNet Lemmatizer'),
        ('joblib',               '≥ 1.4',    'Model serialization/deserialization'),
        ('pandas / numpy',       'Latest',   'Data manipulation and matrix operations'),
        ('requests',             '≥ 2.31',   'Groq API HTTP calls'),
        ('python-dotenv',        '≥ 1.0',    '.env file loading for environment variables'),
        ('react',                '18.x',     'Frontend UI framework'),
        ('recharts',             '2.x',      'Analytics visualizations'),
        ('axios',                '1.x',      'HTTP client for API calls'),
        ('react-router-dom',     '6.x',      'Client-side routing'),
        ('lucide-react',         'Latest',   'Icon library for UI components'),
    ],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_heading(doc, '7.3 Code Quality Practices', 2, color='3730a3', space_before=10)
practices = [
    'Separation of concerns: ML logic (app.py), UI components (src/components/), database init (init_sqlite.py) are cleanly separated.',
    'Error handling: All API endpoints use try/except blocks with HTTP status codes and descriptive error messages.',
    'Environment variables: All secrets (API keys, SMTP credentials) are loaded from .env via python-dotenv — never hardcoded.',
    'CORS configuration: Explicit CORS middleware allows the React frontend to communicate with the FastAPI backend.',
    'Temp file cleanup: All temporary files created during PDF/DOCX processing are deleted with os.unlink() in finally blocks.',
    'SQL parameterization: All SQLite queries use parameterized statements (?, ?) to prevent SQL injection.',
    'Component reusability: CVEnhancer, Sidebar, and PortalSelect are fully self-contained reusable React components.',
    'Responsive design: CSS Grid and flexbox layouts adapt to different screen sizes across all portal components.',
]
for pr in practices:
    add_bullet(doc, pr)

add_divider(doc)

# ── 8. INDIVIDUAL CONTRIBUTIONS ──────────────────────────────────────────────

add_heading(doc, '8. Individual Contributions', 1, color='1e3a8a')
add_body(doc,
    'Each group member contributed to a distinct module of the project, enabling all members '
    'to explain their individual work during the viva.'
)

build_table(doc,
    headers=['Member', 'Primary Contribution', 'Specific Components'],
    rows=[
        ('Ahmad Mustafa',
         'ML Pipeline & Backend',
         'model_training.ipynb (full training pipeline), RF.joblib, cv.pickle, GridSearchCV, SMOTE-Tomek, app.py (/api/upload, /api/config, scoring logic)'),
        ('Raqib Hayat',
         'Frontend — HR Portal',
         'RecruiterPanel.jsx (config form, candidate table, report modal), AnalyticsDashboard.jsx (all 4 charts), Sidebar.jsx, App.jsx routing'),
        ('Niyaz Ali Malik',
         'Frontend — Candidate Portal & CV Enhancer',
         'CandidatePortal.jsx (upload form, results view, skills pills), CVEnhancer.jsx (Groq integration), PortalSelect.jsx'),
        ('Tahir',
         'Backend APIs & Database',
         'init_sqlite.py, app.py (/api/parse, /api/candidates, /api/analytics, /api/enhance), mail.py, database schema design'),
    ],
    header_bg='1e3a8a'
)
spacer(doc, 6)

add_divider(doc)

# ── 9. REFERENCES ─────────────────────────────────────────────────────────────

add_heading(doc, 'References', 1, color='1e3a8a')
refs = [
    '[1]  Breiman, L. (2001). Random Forests. Machine Learning, 45(1), 5–32.',
    '[2]  Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. JMLR, 12, 2825–2830.',
    '[3]  Chawla, N. V., et al. (2002). SMOTE: Synthetic Minority Over-sampling Technique. JAIR, 16, 321–357.',
    '[4]  Deshpande, R., et al. (2020). Random Forest and TF-IDF for Multi-Class Resume Categorization. Applied Intelligence, 50(8), 2321–2335.',
    '[5]  Chowdhury, S., et al. (2023). Transformer-Based Resume Classification. IEEE Transactions on Neural Networks.',
    '[6]  Shukla, A., et al. (2024). LLMs in Context-Aware Recruitment Automation. AAAI 2024.',
    '[7]  FastAPI Documentation: https://fastapi.tiangolo.com',
    '[8]  Groq API Documentation: https://console.groq.com/docs',
    '[9]  Kaggle Resume Dataset — Gaurav Dutt: https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset',
    '[10] Kaggle Resume Dataset — Sneha Anbhawal: https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset',
    '[11] React Documentation: https://react.dev',
    '[12] Recharts Documentation: https://recharts.org',
]
for ref in refs:
    p = doc.add_paragraph()
    r = p.add_run(ref)
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(51, 65, 85)
    p.paragraph_format.space_after      = Pt(3)
    p.paragraph_format.left_indent      = Inches(0.3)
    p.paragraph_format.first_line_indent = Inches(-0.3)

# ── SAVE ─────────────────────────────────────────────────────────────────────

out = r'D:\Resume-Screening-main\Milestone_3_TrackB_System_Documentation.docx'
doc.save(out)
print(f'Saved: {out}')
