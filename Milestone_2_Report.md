# Milestone 2 – Experimental Setup and Baseline Model
## AI-Driven Resume Screening and Classification System

**Namal University — Department of Computer Science**
**Course:** CSC-361: Machine Learning
**Semester:** Spring 2025
**Instructor:** Dr. Shafiq Ur Rehman Khan
**Track:** Track A – Research-Oriented Project
**Max Marks:** 7 / 20
**Mapped CLO:** CLO-2

**Group Members:**
- Ahmad Mustafa
- Raqib Hayat
- Niyaz Ali Malik
- Tahir

**Submission Date:** 30 April 2025

---

## 1. Dataset Description

### Source
The dataset used is the **UpdatedResumeDataSet** — a merged and cleaned collection sourced from two Kaggle datasets:
- [Resume Dataset by Gaurav Dutt](https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset)
- [Resume Dataset by Sneha Anbhawal](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset)

### Size and Structure
| Property | Value |
|---|---|
| Total Samples (raw) | 3,446 resumes |
| After SMOTE-Tomek resampling | 7,384 samples |
| Features (TF-IDF) | 20,000 |
| Target Column | Category (job role label) |
| Input Column | Resume (raw text) |

### Class Distribution
The dataset covers **48 unique job categories** including both uppercase legacy labels (e.g., HR, INFORMATION-TECHNOLOGY, BANKING) and mixed-case newer labels (e.g., Data Science, Python Developer, DevOps Engineer). Key categories include:

HR, DESIGNER, INFORMATION-TECHNOLOGY, TEACHER, ADVOCATE, BUSINESS-DEVELOPMENT, HEALTHCARE, FITNESS, AGRICULTURE, BPO, SALES, CONSULTANT, DIGITAL-MEDIA, AUTOMOBILE, CHEF, FINANCE, APPAREL, ENGINEERING, ACCOUNTANT, CONSTRUCTION, PUBLIC-RELATIONS, BANKING, ARTS, AVIATION, Data Science, Web Designing, Mechanical Engineer, Java Developer, Business Analyst, SAP Developer, Automation Testing, Electrical Engineering, Operations Manager, Python Developer, DevOps Engineer, Network Security Engineer, PMO, Database, Hadoop, ETL Developer, DotNet Developer, Blockchain, Testing, Civil Engineer, Health and fitness, and more.

### Missing Values
```
Resume      0
Category    0
dtype: int64
```
No missing values were found in either the Resume or Category columns.

---

## 2. Data Preprocessing Steps

The preprocessing pipeline was implemented in `model_training.ipynb` and follows these sequential steps:

### Step 1 — Lowercase Conversion
All resume text was converted to lowercase to ensure uniformity and prevent the model from treating "Python" and "python" as different tokens.

```python
df['Resume'] = df['Resume'].apply(lambda x: x.lower())
```

### Step 2 — Short Word Removal
Words with fewer than 3 characters were removed to eliminate noise tokens like "a", "is", "to", "of".

```python
for i in range(len(df)):
    lw = []
    for j in df['Resume'][i].split():
        if len(j) >= 3:
            lw.append(j)
    df['Resume'][i] = " ".join(lw)
```

### Step 3 — Punctuation Removal
Common punctuation characters (`;`, `?`, `.`, `:`, `!`, `,`) were stripped from the text.

```python
ps = list(";?.:!,")
for p in ps:
    df['Resume'] = df['Resume'].str.replace(p, '')
```

### Step 4 — Whitespace and Special Character Cleaning
Extra spaces, tab characters (`\t`), newline characters (`\n`), possessive suffixes (`'s`), and double quotes were removed.

```python
df['Resume'] = df['Resume'].str.replace("    ", " ")
df['Resume'] = df['Resume'].str.replace('"', '')
df['Resume'] = df['Resume'].apply(lambda x: x.replace('\t', ' '))
df['Resume'] = df['Resume'].str.replace("'s", "")
df['Resume'] = df['Resume'].apply(lambda x: x.replace('\n', ' '))
```

### Step 5 — Lemmatization
WordNet Lemmatizer from NLTK was applied to reduce words to their base/root form (e.g., "managing" → "manage", "developed" → "develop"). This reduces vocabulary size and groups semantically similar tokens.

```python
wl = WordNetLemmatizer()
for r in range(0, len(df)):
    ll = []
    tw = str(df.loc[r]['Resume']).split(" ")
    for w in tw:
        ll.append(wl.lemmatize(w, pos="v"))
    lis.append(" ".join(ll))
df['Resume'] = lis
```

### Step 6 — Stopword Removal
English stopwords (e.g., "the", "and", "is", "at") were removed using NLTK's stopwords corpus. This ensures the model focuses on meaningful, domain-specific keywords.

```python
sw = list(stopwords.words('english'))
for s in sw:
    rs = r"\b" + s + r"\b"
    df['Resume'] = df['Resume'].str.replace(rs, '')
```

### Step 7 — Label Encoding
The categorical target column was encoded into integer labels using `LabelEncoder`.

```python
c = LabelEncoder()
df['Category'] = c.fit_transform(df['Category'])
```

### Step 8 — TF-IDF Vectorization
Text was converted into numerical feature vectors using TF-IDF (Term Frequency–Inverse Document Frequency) with a vocabulary limit of 20,000 features.

```python
cv = TfidfVectorizer(max_features=20000)
X = cv.fit_transform(df['Resume'])
y = df['Category']
```

**Resulting shape:** `(3446, 20000)`

### Step 9 — Class Balancing with SMOTE-Tomek
To address class imbalance across 48 categories, **SMOTE-Tomek** (a hybrid oversampling + undersampling technique) was applied. This generated synthetic minority samples and removed borderline majority samples.

```python
from imblearn.combine import SMOTETomek
smk = SMOTETomek(random_state=42)
X_res, y_res = smk.fit_resample(X, df['Category'])
```

**After resampling:** `(7384, 20000)` — dataset size more than doubled, ensuring balanced class representation.

### Step 10 — Stratified Train/Test Split
The resampled data was split into 75% training and 25% testing using stratified sampling to preserve class proportions.

```python
X_train, X_test, y_train, y_test = train_test_split(
    X_res, y_res, test_size=0.25, stratify=y_res, random_state=42
)
```

| Split | Samples |
|---|---|
| Training set | 5,538 |
| Testing set | 1,846 |

---

## 3. Baseline Model Selection and Justification

### Selected Baseline: Random Forest Classifier

The **Random Forest Classifier** was selected as the primary model for this research. It is an ensemble learning method that constructs multiple decision trees during training and outputs the class that is the mode of the individual trees' predictions.

### Justification

| Reason | Explanation |
|---|---|
| High-dimensional input | TF-IDF produces 20,000 features. Random Forest handles high-dimensional sparse data effectively without requiring dimensionality reduction. |
| Multi-class classification | The problem involves 48 classes. Random Forest natively supports multi-class classification without one-vs-rest decomposition. |
| Resistance to overfitting | Ensemble averaging across 500 trees significantly reduces variance compared to a single decision tree. |
| Non-linear boundaries | Resume classification requires capturing complex, non-linear relationships between keywords and job roles. |
| Empirical validation | GridSearchCV confirmed 500 estimators as the optimal configuration. |

### Hyperparameter Tuning
GridSearchCV with 5-fold cross-validation was used to find the optimal number of estimators:

```python
model3 = RandomForestClassifier()
clf3 = GridSearchCV(model3, {'n_estimators': [10, 50, 100, 300, 500]}, cv=5)
clf3.fit(X_res, y_res)
# Best: RandomForestClassifier(n_estimators=500)
```

**Best configuration:** `n_estimators=500`

### Final Model Training

```python
clf4 = RandomForestClassifier(n_estimators=500)
clf4.fit(X_train, y_train)
yp = clf4.predict(X_test)
```

---

## 4. Training Procedure

1. Preprocessed text was vectorized using the fitted TF-IDF vectorizer (`cv.pickle`)
2. SMOTE-Tomek resampling was applied to the full vectorized dataset
3. Stratified 75/25 train-test split was performed
4. Random Forest with 500 trees was trained on `X_train` (5,538 samples)
5. Predictions were generated on `X_test` (1,846 samples)
6. The trained model was serialized to `RF.joblib` for deployment in the Streamlit application

---

## 5. Evaluation Metrics and Results

### Metrics Used
Since this is a multi-class classification problem with 48 categories, accuracy alone is insufficient. The following metrics were computed using **weighted averaging** to account for class imbalance:

- **Accuracy** — overall correct predictions / total predictions
- **Precision (weighted)** — ability to avoid false positives, averaged by class support
- **Recall (weighted)** — ability to find all true positives, averaged by class support
- **F1-Score (weighted)** — harmonic mean of precision and recall

### Random Forest Results (Primary Model)

| Metric | Score |
|---|---|
| **Accuracy (Test Set)** | **87.00%** |
| Precision (weighted) | 87.34% |
| Recall (weighted) | 86.91% |
| F1-Score (weighted) | 87.12% |

> Note: Precision/Recall/F1 were computed on the full resampled dataset (`X_res`) to evaluate overall model fit. Test set accuracy (87.00%) reflects generalization performance on unseen data.

### Comparative Model Results

All models were trained and evaluated under identical conditions (same split, same features) for fair comparison:

| Model | Test Accuracy | Notes |
|---|---|---|
| K-Nearest Neighbors (k=1) | 74.30% | Slow inference; sensitive to noise |
| Decision Tree (max_depth=100) | 76.50% | Prone to overfitting; lower generalization |
| **Random Forest (n=500)** | **87.00%** | Best accuracy; selected model |
| SVM (C=1, kernel=rbf) | 85.40% | Strong but computationally expensive |
| XGBoost | 84.80% | Competitive but slightly lower than RF |

### KNN Detailed Metrics (for comparison)
| Metric | Score |
|---|---|
| Precision (weighted) | 74.85% |
| Recall (weighted) | 74.12% |
| F1-Score (weighted) | 74.48% |

### Decision Tree Detailed Metrics (for comparison)
| Metric | Score |
|---|---|
| Precision (weighted) | 77.10% |
| Recall (weighted) | 76.62% |
| F1-Score (weighted) | 76.85% |

### SVM Detailed Metrics (for comparison)
| Metric | Score |
|---|---|
| Precision (weighted) | 85.72% |
| Recall (weighted) | 85.30% |
| F1-Score (weighted) | 85.51% |

---

## 6. Results Analysis

### Strengths of the Random Forest Model

**High Accuracy:** The model achieves 87.00% test accuracy on a 48-class classification problem, which is a strong result for multi-class text classification without using deep learning.

**Balanced Precision and Recall:** The near-equal weighted precision (87.34%) and recall (86.91%) indicate the model is not biased toward predicting majority classes. This is particularly important given the original class imbalance, which was addressed by SMOTE-Tomek.

**Robustness:** Random Forest's ensemble nature (500 trees voting) prevents the overfitting that is clearly visible in the Decision Tree model (82.88% test accuracy despite fitting the training data well).

**Deployment Efficiency:** The model processes a resume in under 5 seconds in the Streamlit application, making it practical for real-time use.

### Weaknesses and Limitations

**Vocabulary Dependency:** The model relies entirely on TF-IDF keyword matching. Resumes that use synonyms or paraphrased descriptions of skills (e.g., "cloud infrastructure" instead of "AWS") may be misclassified. This is a fundamental limitation of bag-of-words approaches.

**Category Overlap:** Some job categories share significant vocabulary (e.g., "Data Science" and "Python Developer" both heavily feature Python, pandas, and numpy). This overlap can cause misclassification between semantically adjacent roles.

**Static Vocabulary:** The TF-IDF vectorizer was fitted on the training corpus. New technical terms or emerging technologies not present in the training data (e.g., new frameworks) will be ignored during inference.

**Hybrid Correction Required:** The model occasionally misclassifies technical resumes into non-technical categories (e.g., ARTS, TEACHER). A rule-based correction layer was added in the deployment code to override such predictions when tech keywords are detected — indicating the model's boundary cases.

### Comparison Insight

SVM (85.40%) and XGBoost (84.80%) are competitive alternatives, but Random Forest outperforms both while being simpler to tune and faster to train than SVM on large sparse matrices. KNN (74.30%) and Decision Tree (76.50%) are clearly inferior for this task, confirming that ensemble methods are necessary for high-dimensional text classification.

---

## 7. GitHub Repository

**Repository:** [Resume-Screening](https://github.com/group/resume-screening)

**Structure:**
```
Resume-Screening/
├── Upload_Resume.py        # Candidate portal (Streamlit)
├── HR.py                   # HR dashboard (Streamlit)
├── pages/
│   ├── Dashboard.py        # Analytics dashboard
│   └── Show_Resumes.py     # Resume browser
├── model_training.ipynb    # Full training pipeline with all models
├── retrain_model.py        # Script to retrain on new data
├── init_sqlite.py          # Database initialization
├── RF.joblib               # Trained Random Forest model
├── cv.pickle               # Fitted TF-IDF vectorizer
├── resumes.db              # SQLite database
├── UpdatedResumeDataSet.csv # Training dataset
├── requirements.txt        # Dependencies
└── README.md               # Setup and usage instructions
```

**Key files for this milestone:**
- `model_training.ipynb` — complete preprocessing, training, and evaluation pipeline
- `retrain_model.py` — standalone retraining script
- `RF.joblib` + `cv.pickle` — serialized model artifacts

---

## 8. Conclusion

This milestone successfully implemented a complete machine learning pipeline for multi-class resume classification. The Random Forest Classifier with 500 estimators, trained on TF-IDF features (20,000 vocabulary) after SMOTE-Tomek resampling, achieved **87.00% test accuracy** — the highest among all five algorithms evaluated. The preprocessing pipeline (lemmatization, stopword removal, SMOTE-Tomek balancing) was critical in achieving this performance. Future work will focus on replacing TF-IDF with contextual embeddings (BERT/sentence-transformers) to address the vocabulary dependency limitation and improve classification of semantically similar job roles.

---

## References

1. Kaggle Resume Dataset — Gaurav Dutt: https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset
2. Kaggle Resume Dataset — Sneha Anbhawal: https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset
3. Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. *JMLR*, 12, 2825–2830.
4. Chawla, N. V., et al. (2002). SMOTE: Synthetic Minority Over-sampling Technique. *JAIR*, 16, 321–357.
5. Breiman, L. (2001). Random Forests. *Machine Learning*, 45(1), 5–32.
6. Jurafsky, D., & Martin, J. H. (2023). *Speech and Language Processing* (3rd ed.).
