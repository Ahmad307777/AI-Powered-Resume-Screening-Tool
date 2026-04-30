# AI Resume Screening: Project Briefing Guide

This document provides a comprehensive overview of how the AI Resume Screening project works, from the code logic to the machine learning training.

---

## 1. Project structure & File Roles
The project is built using a modular Python architecture. Here is what each file does:

*   **`HR.py`**: The Recruiter's Dashboard. This is where HR sets the "target role" (e.g., Data Science) and views candidate rankings.
*   **`Upload_Resume.py`**: The Candidate Portal. This is the front-facing website where applicants upload their CVs and receive instant AI feedback.
*   **`model_training.ipynb`**: The Research Lab. A Jupyter Notebook used to clean the dataset, compare different algorithms, and export the final model.
*   **`RF.joblib`**: The "Brain". This is the trained Random Forest model that identifies job categories.
*   **`cv.pickle`**: The "Vocabulary". It contains the TF-IDF vectorizer that turns words into numbers the AI can understand.
*   **`resumes.db`**: The "Archive". A SQLite database that stores candidate info, resume files, and AI scores.
*   **`Research_Report.md`**: The academic documentation of the whole project.

---

## 2. Tools & Technologies (The "Tech Stack")
*   **Language:** Python 3.x
*   **Web Framework:** **Streamlit** (Turns Python scripts into interactive web apps).
*   **Machine Learning:** **Scikit-learn** (Used for the Random Forest algorithm).
*   **NLP (Natural Language Processing):** **NLTK** (Used for text cleaning and removing stopwords like "the", "and").
*   **Data Handling:** **Pandas** and **NumPy**.
*   **Database:** **SQLite** (Stores relational data).
*   **File Parsing:** **PyPDF2** (for PDFs) and **docx2txt** (for Word documents).

---

## 3. Dataset & AI Model
*   **The Dataset:** We used over **2,400+ real-world resumes** sourced from **Kaggle**. The resumes are split into 25+ distinct categories (e.g., Accountant, Advocate, Python Developer, HR, etc.).
*   **The Model:** We chose the **Random Forest Classifier**. 
    *   **Why?** It is an "Ensemble" model, meaning it combines many decision trees to make a single, highly accurate prediction. It handles large amounts of text data very well without "overfitting" (trying too hard to memorize).
*   **Feature Extraction (TF-IDF):** This is the magic that turns text into math. It gives higher weights to unique skills (like "Python" or "Machine Learning") and lower weights to common words (like "Work" or "Team").

---

## 4. How it Works (The Workflow)

### Stage A: HR Sets the Target
1. HR opens `HR.py`.
2. They select a **Job Category** (e.g., "Data Science") and a **Minimum Experience**.
3. This requirement is saved to the `resumes.db` database.

### Stage B: Candidate Uploads Resume
1. The candidate visits the portal via `Upload_Resume.py`.
2. They enter their Name, Email, and upload a file (PDF/DOCX).
3. **Extraction:** Python extracts the raw text from the file.
4. **Cleaning:** The system removes symbols, extra spaces, and "stopwords."
5. **Prediction:** The "Brain" (`RF.joblib`) analyzes the text and predicts the job category (e.g., "This looks like a Data Scientist's resume").

### Stage C: The Logic & Scoring
1. **Category Check:** If the AI's predicted category matches what the HR selected, the resume is accepted into the database.
2. **Skill Scoring:** The system checks for specific keywords matched against the job role. It calculates a percentage (e.g., "75% match").
3. **Correction Layer:** We added a "Hybrid" layer—if a resume has strong technical keywords (like "AWS" or "SQL") but the AI is unsure, the code forces it into the "Information Technology" category to avoid errors.

---

## 5. Results & Experiments
*   **Accuracy:** **91%**. This means in 9 out of 10 cases, the AI identifies the job role perfectly.
*   **Speed:** **< 5 seconds**. Traditional screening takes 10 minutes per person; our AI does it in less than 5 seconds.
*   **Experiments:** We tested the system by feeding it completely unrelated resumes (e.g., an Artist applying for a Java role) and confirmed that the AI successfully rejected them with a "Category Mismatch" error.

---

## 6. Target Audience
1.  **HR Teams & Recruiters:** To save thousands of hours manually reading thousands of resumes.
2.  **Job Seekers:** To get instant, honest feedback on whether their resume is "readable" by modern AI systems.
3.  **Medium-to-Large Organizations:** Companies that receive hundreds of applications daily.
4.  **Academic Researchers:** As a case study on applying NLP to solve human resource bottlenecks.
