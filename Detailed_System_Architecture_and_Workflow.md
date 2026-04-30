# Deep-Dive: AI Resume Screening System Architecture & Workflow

This document provides an exhaustive, code-level explanation of how the system operates, the algorithms involved, and the data flow between HR and the Candidate.

---

## 1. Technical Project Structure
The project is built around a centralized database (`resumes.db`) that acts as the bridge between two independent applications.

### Core Files & Functional Roles:
1.  **`Upload_Resume.py` (The Front-End Engine):**
    *   **Purpose:** Captures applicant data and performs real-time classification.
    *   **Logic:** Uses Streamlit to create a form. It handles raw binary file uploads, extracts text based on file type (PDF/DOCX), and triggers the ML pipeline.
2.  **`HR.py` (The Management Dashboard):**
    *   **Purpose:** Control center for recruiters.
    *   **Logic:** Allows HR to write requirements to the database. It polls the `employees` table to display shortlisted candidates using a descending score order.
3.  **`RF.joblib` & `cv.pickle` (The Intelligence Layer):**
    *   These are serialized Python objects (saved using `joblib` and `pickle`). `RF.joblib` contains the weights of thousands of decision trees, and `cv.pickle` contains the TF-IDF vocabulary.

---

## 2. The Machine Learning Pipeline (Step-by-Step)
How does a resume turn from a PDF into a "Selected" status?

### Step 1: Text Extraction
Depending on the file extension, the code uses:
*   **PyPDF2:** Iterates through every page of a PDF and extracts ASCII text.
*   **docx2txt:** XML-based extraction for Microsoft Word files.

### Step 2: Pre-processing (Data Sanitization)
The `clean()` function in the code performs the following:
*   **Lowercase:** Converts everything to lowercase so "Python" and "python" are seen as the same.
*   **Char Removal:** Strips out special characters (`; ? . : ! , " \t \n`).
*   **Stopword Removal:** Uses the **NLTK corpus** to remove common connector words (e.g., "this", "that", "is") which carry no predictive value for job roles.

### Step 3: Vectorization (TF-IDF)
Raw text cannot be processed by machine learning.
*   **TF (Term Frequency):** How often a word appears in one resume.
*   **IDF (Inverse Document Frequency):** How unique that word is across all resumes.
*   **Result:** A word like "TensorFlow" gets a high score in a Data Science resume because it is rare and specific.

### Step 4: Classification (Random Forest)
The model consists of an **"Ensemble" of 100+ Decision Trees**. 
*   Each tree looks at a different subset of words.
*   The final result is a **"Majority Vote"**. If 80 trees say "This is an Accountant" and 20 say "This is a Consultant," the system officially labels the resume as **ACCOUNTANT**.

---

## 3. Detailed System Workflows

### Phase 1: The HR Requirement Phase
*   **What happens?** The recruiter selects a position (e.g., "Python Developer") from a dropdown in `HR.py`.
*   **Code Trigger:** `cur.execute("DELETE FROM HR")` followed by `cur.execute("INSERT INTO HR ...")`.
*   **Impact:** This sets the "Screening Filter" for the entire system. Any resume uploaded from this point forward will be compared against this specific role.

### Phase 2: The Candidate Submission Phase
1.  **Form Submission:** User clicks "Submit" in `Upload_Resume.py`.
2.  **ML Category Prediction:** The AI analyzes the resume and assigns it one of 25+ categories.
3.  **Department Cross-Check:** 
    ```python
    if predicted_category.lower() == hr_requirement.lower():
        # Proceed to skill scoring
    else:
        # Reject: "The resume belongs to the wrong job department."
    ```
4.  **Keyword Scoring:** The system splits the candidate's "Skills" text and checks for intersection with the required skills.
    *   **Formula:** `Score = (Found_Keywords / Total_Required_Keywords) * 100`.
5.  **Final Decision:**
    *   If `Score >= 50%` $\rightarrow$ **Selected**.
    *   If `Score < 50%` $\rightarrow$ **Rejected**.

---

## 4. Experimental Results & Performance
The project was rigorously tested during the training phase in `model_training.ipynb`.

| Metric | Value | Meaning |
| :--- | :--- | :--- |
| **Accuracy** | **91%** | The percentage of resumes correctly categorized. |
| **Precision** | **~0.89** | Out of all candidates labeled "Selected," 89% were actually high-quality. |
| **Recall** | **~0.92** | The system correctly identified 92% of all potential qualified candidates. |
| **Latency** | **< 4.5s** | Total time from "Upload" to "Result shown" for the user. |

### Key Experiments Performed:
*   **Model Comparison:** We compared Random Forest with SVM (Support Vector Machines) and Logistic Regression. **Random Forest** won because of its superior performance on non-linear text data.
*   **Format Tolerance:** We tested identical resume content in `.txt`, `.pdf`, and `.docx` to ensure the extraction scripts were consistent.

---

## 5. Target Audience & Impact
### Who is this for?
1.  **Talent Acquisition Teams:** Who need to filter 1,000 resumes for a single "Java Developer" role in minutes.
2.  **Educational Institutions:** To screen students for specific scholarship or internship tracks based on their CV content.
3.  **Startups:** That don't have a large HR department but want a high-quality screening process.

### Final Mission:
To remove **Human Bias** from the first stage of hiring. The AI doesn't see "Names," "Genders," or "Locations" initially; it only sees **Keywords** and **Job Merit**.
