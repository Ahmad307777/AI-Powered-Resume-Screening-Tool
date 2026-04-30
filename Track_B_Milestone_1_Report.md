# Milestone 1 – Product Planning and System Design
## AI-Driven Resume Screening and Classification System

**Namal University — Department of Computer Science**
**Course:** CSC-361: Machine Learning
**Semester:** Spring 2025
**Instructor:** Dr. Shafiq Ur Rehman Khan
**Track:** Track B – Software-Based AI System
**Max Marks:** 4 / 20
**Mapped CLO:** CLO-1

**Group Members:**
- Ahmad Mustafa
- Raqib Hayat
- Niyaz Ali Malik
- Tahir

**Submission Date:** 01 April 2025

---

## 1. Problem Definition and Target Audience

### 1.1 Problem Statement

The modern recruitment process is overwhelmed by volume. A single job posting at a mid-to-large organization can attract hundreds or thousands of applications within days. HR teams are forced to manually read through each resume to determine relevance — a process that is slow, inconsistent, and prone to unconscious bias. Studies show that recruiters spend an average of 6–10 seconds on an initial resume scan, meaning qualified candidates are frequently overlooked simply due to fatigue or subjective judgment.

There is a clear need for an intelligent, automated system that can:
- Accurately classify resumes into the correct job category
- Score candidates against specific job requirements
- Provide transparent, explainable decisions to HR teams
- Deliver results in real time without manual intervention

This project builds an **AI-powered Resume Screening and Classification System** that uses Natural Language Processing (NLP) and Machine Learning (ML) to automate the initial screening phase of recruitment.

### 1.2 Target Audience

| User Type | Role | Need |
|---|---|---|
| HR Managers / Recruiters | Primary users | Set job requirements, view ranked shortlisted candidates, access AI reasoning |
| Job Applicants / Candidates | Secondary users | Upload resume, receive instant feedback on category match and selection status |
| System Administrators | Technical users | Manage database, retrain model on new data, maintain deployment |

### 1.3 Scope

The system handles:
- Resume upload in PDF, DOCX, and TXT formats
- Automatic text extraction and NLP-based cleaning
- Multi-class classification into 25 job categories
- Skill-based scoring against HR-defined requirements
- Persistent storage of candidate profiles in a database
- A web-based interface accessible without technical knowledge

Out of scope for this version: multilingual resumes, OCR for scanned images, automated email notifications.

---

## 2. System Architecture

### 2.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEB APPLICATION LAYER                    │
│                         (Streamlit UI)                          │
│                                                                 │
│   ┌──────────────────┐          ┌──────────────────────────┐   │
│   │  Candidate Portal │          │      HR Dashboard        │   │
│   │ Upload_Resume.py  │          │        HR.py             │   │
│   └────────┬─────────┘          └────────────┬─────────────┘   │
└────────────┼────────────────────────────────┼─────────────────┘
             │                                │
             ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PROCESSING LAYER                            │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────┐   ┌────────────────┐  │
│  │ Text Extraction  │    │  NLP Cleaning │   │ Skill Matcher  │  │
│  │ PyPDF2/docx2txt  │───▶│  NLTK/regex  │──▶│ Keyword Match  │  │
│  └─────────────────┘    └──────┬───────┘   └───────┬────────┘  │
│                                │                   │            │
│                                ▼                   │            │
│                    ┌───────────────────────┐       │            │
│                    │   ML CORE             │       │            │
│                    │  TF-IDF Vectorizer    │       │            │
│                    │  (cv.pickle)          │       │            │
│                    │         +             │       │            │
│                    │  Random Forest Model  │       │            │
│                    │  (RF.joblib)          │       │            │
│                    └───────────┬───────────┘       │            │
│                                │                   │            │
│                                ▼                   ▼            │
│                    ┌───────────────────────────────────────┐    │
│                    │   Decision Engine                     │    │
│                    │   Category Prediction + Score %       │    │
│                    │   Selected / Rejected + Reasoning     │    │
│                    └───────────────────┬───────────────────┘    │
└────────────────────────────────────────┼────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│                                                                 │
│   ┌──────────────────────────────────────────────────────┐     │
│   │              SQLite Database (resumes.db)             │     │
│   │   HR Table │ Employees Table │ Skills Table           │     │
│   └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYTICS LAYER                              │
│              pages/Dashboard.py  │  pages/Show_Resumes.py       │
│         Plotly Charts │ Metrics │ Category Breakdown            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Descriptions

| Component | Technology | Responsibility |
|---|---|---|
| Candidate Portal | Streamlit (Upload_Resume.py) | Resume upload, result display |
| HR Dashboard | Streamlit (HR.py) | Job requirement setting, candidate ranking |
| Text Extraction | PyPDF2, docx2txt | Extract raw text from PDF/DOCX/TXT |
| NLP Cleaning | NLTK, regex | Lowercase, stopword removal, special char stripping |
| TF-IDF Vectorizer | scikit-learn | Convert cleaned text to numerical feature vectors |
| Random Forest Model | scikit-learn | Predict job category from feature vector |
| Skill Matcher | Custom Python | Score candidate against HR-defined required skills |
| Decision Engine | Custom Python | Combine ML prediction + score into Selected/Rejected |
| Database | SQLite (resumes.db) | Persist HR requirements, candidate profiles, skills |
| Analytics | Plotly, pandas | Visualize application trends and metrics |

### 2.3 Data Flow

1. Candidate uploads resume (PDF/DOCX/TXT)
2. Text is extracted from the file
3. Text is cleaned: lowercase → remove special chars → remove stopwords
4. Cleaned text is transformed by TF-IDF vectorizer (`cv.pickle`)
5. Feature vector is passed to Random Forest model (`RF.joblib`)
6. Model predicts job category (one of 25 classes)
7. Skill match score is computed against HR's required skills
8. Decision logic: score ≥ 50% → Selected, else → Rejected
9. Result + reasoning stored in SQLite database
10. HR dashboard displays ranked candidates sorted by score

---

## 3. ML Paradigm Identification

### 3.1 Paradigm: Supervised Learning — Multi-Class Classification

This system uses **Supervised Learning**, specifically a **Multi-Class Classification** approach.

### 3.2 Justification

| Aspect | Explanation |
|---|---|
| Labeled training data | The dataset contains 3,446 resumes each labeled with a specific job category (e.g., "Python Developer", "Data Science", "HR"). This labeled structure is the defining characteristic of supervised learning. |
| Discrete output classes | The model must assign each resume to exactly one of 25 predefined job categories — a classic multi-class classification problem. |
| No unsupervised alternative | Clustering (unsupervised) would group resumes by similarity but cannot assign meaningful job category labels without ground truth. |
| No regression needed | The target variable is categorical (job role), not continuous, ruling out regression. |
| Deep learning not required | The dataset size (3,446 samples) is insufficient to train deep neural networks effectively. Ensemble methods like Random Forest achieve comparable accuracy with far less data and compute. |

### 3.3 Algorithm Selection Rationale

The **Random Forest Classifier** was chosen as the primary algorithm:

- Handles high-dimensional sparse feature spaces (TF-IDF produces thousands of features)
- Naturally supports multi-class classification without modification
- Resistant to overfitting through ensemble averaging of 500 decision trees
- Provides feature importance scores for interpretability
- Achieves 87% accuracy on this dataset — highest among all evaluated algorithms

### 3.4 Feature Extraction: TF-IDF

Since the input is raw text, a feature extraction step is required before ML. **TF-IDF (Term Frequency–Inverse Document Frequency)** was selected because:

- It quantifies the importance of each word relative to the entire corpus
- It down-weights common words (e.g., "work", "team") and up-weights domain-specific terms (e.g., "kubernetes", "tensorflow")
- It produces a sparse numerical matrix compatible with scikit-learn classifiers
- It is computationally efficient for the dataset size

---

## 4. Dataset Planning

### 4.1 Dataset Source

Two publicly available Kaggle datasets were merged to form the training corpus:

| Dataset | Source | Link |
|---|---|---|
| Resume Dataset | Gaurav Dutt | kaggle.com/datasets/gauravduttakiit/resume-dataset |
| Resume Dataset | Sneha Anbhawal | kaggle.com/datasets/snehaanbhawal/resume-dataset |

The merged dataset is stored as `UpdatedResumeDataSet.csv`.

### 4.2 Dataset Description

| Property | Value |
|---|---|
| Total samples | 3,446 resumes |
| Number of categories | 25 job roles |
| File format | CSV (two columns: Resume, Category) |
| Language | English |
| Average resume length | ~300–800 words after cleaning |

### 4.3 Category Distribution

The 25 job categories covered:

Advocate, Arts, Automation Testing, Blockchain, Business Analyst, Civil Engineer, Data Science, Database, DevOps Engineer, DotNet Developer, ETL Developer, Electrical Engineering, HR, Hadoop, Health and Fitness, Java Developer, Mechanical Engineer, Network Security Engineer, Operations Manager, PMO, Python Developer, SAP Developer, Sales, Testing, Web Designing.

### 4.4 Preprocessing Needs

| Issue | Preprocessing Step |
|---|---|
| Mixed case text | Lowercase conversion |
| Punctuation and symbols | Regex-based removal of non-alphabetic characters |
| Common noise words | NLTK English stopword removal |
| Inflected word forms | WordNet Lemmatization (managing → manage) |
| Short noise tokens | Remove words with fewer than 3 characters |
| Class imbalance | SMOTE-Tomek oversampling/undersampling |
| Categorical labels | LabelEncoder integer mapping |
| Raw text to numbers | TF-IDF vectorization (5,000 features) |

### 4.5 Data Quality Notes

- No missing values in either the Resume or Category columns
- Some duplicate category naming exists (e.g., "ARTS" vs "Arts") — resolved by label encoding
- Resume text quality varies: some contain structured sections (Skills, Experience) while others are free-form paragraphs

---

## 5. Technical Planning

### 5.1 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Language | Python 3.11 | Core development language |
| Web Framework | Streamlit | Interactive web UI for HR and candidates |
| ML Library | scikit-learn | TF-IDF, Random Forest, LabelEncoder, metrics |
| NLP | NLTK | Stopwords, lemmatization, tokenization |
| PDF Parsing | PyPDF2 | Extract text from PDF resumes |
| DOCX Parsing | docx2txt | Extract text from Word documents |
| Data Processing | pandas, numpy | Dataset manipulation and feature engineering |
| Visualization | Plotly | Interactive charts in analytics dashboard |
| Database | SQLite (via sqlite3) | Lightweight persistent storage |
| Model Serialization | joblib, pickle | Save and load trained model artifacts |
| Class Balancing | imbalanced-learn | SMOTE-Tomek resampling |
| Model Training | Jupyter Notebook | Exploratory training and algorithm comparison |

### 5.2 Expected Technical Challenges

| Challenge | Description | Mitigation Strategy |
|---|---|---|
| Text extraction quality | Stylized PDFs with columns, tables, or images may produce garbled or incomplete text extraction | Use PyPDF2 for standard PDFs; add docx2txt fallback; validate extracted content length before processing |
| Class imbalance | Some job categories have significantly more training samples than others, biasing the model | Apply SMOTE-Tomek resampling to balance class distribution before training |
| Vocabulary mismatch | Resumes using synonyms or paraphrased skills (e.g., "cloud infrastructure" vs "AWS") may be misclassified | Add a rule-based hybrid correction layer on top of ML predictions for known edge cases |
| Category overlap | Adjacent job roles (e.g., Data Science vs Python Developer) share significant vocabulary | Use TF-IDF sublinear scaling and increase vocabulary size to better distinguish overlapping categories |
| Model loading latency | Loading RF.joblib on every request would cause slow response times | Use @st.cache_resource to load model once at startup and reuse across all sessions |
| SQLite thread safety | Streamlit runs in multi-threaded mode which can cause SQLite locking errors | Use check_same_thread=False on SQLite connection |
| Scalability | SQLite is not suitable for high-concurrency production deployments | Migrate to PostgreSQL or MySQL for production; SQLite is sufficient for academic demonstration |
| Unseen job categories | Resumes for job roles not in the training set will be misclassified | Display predicted category with confidence note; plan for periodic model retraining with new data |

### 5.3 Development Plan

| Phase | Tasks |
|---|---|
| Phase 1 — Data & Model | Dataset collection, preprocessing pipeline, model training, evaluation |
| Phase 2 — Backend | Database schema design, SQLite setup, query layer |
| Phase 3 — Frontend | Streamlit candidate portal, HR dashboard, analytics page |
| Phase 4 — Integration | Connect ML model to UI, wire database reads/writes, end-to-end testing |
| Phase 5 — Refinement | Add hybrid correction layer, improve UI, performance testing |

---

## 6. Conclusion

This milestone establishes the complete product plan for the AI Resume Screening System. The problem is clearly defined — automating the manual resume screening process for HR teams using supervised ML. The system architecture covers all layers from the web UI through the ML core to the database. The supervised multi-class classification paradigm using Random Forest and TF-IDF is well-justified for this task. The dataset is identified, its preprocessing needs are documented, and the full technology stack with realistic technical challenges and mitigation strategies is planned. The project is ready to proceed to implementation in Milestone 2.

---

## References

1. Kaggle Resume Dataset — Gaurav Dutt: https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset
2. Kaggle Resume Dataset — Sneha Anbhawal: https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset
3. Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. *JMLR*, 12, 2825–2830.
4. Streamlit Documentation: https://docs.streamlit.io
5. Breiman, L. (2001). Random Forests. *Machine Learning*, 45(1), 5–32.
6. Bird, S., Klein, E., & Loper, E. (2009). *Natural Language Processing with Python*. O'Reilly Media.
