import pickle
import joblib
import pandas as pd
import re
from nltk.corpus import stopwords
import nltk

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    sw = set(stopwords.words('english'))
    text = " ".join([word for word in text.split() if word not in sw])
    return text

print("Loading components...")
cv = pickle.load(open('cv.pickle', 'rb'))
model = joblib.load('RF.joblib')

test_resume = """
Data Scientist with experience in Python, SQL, and Machine Learning. 
Developed predictive models and performed data analysis using Pandas and Scikit-learn.
"""

print("Cleaning test resume...")
cleaned = clean_text(test_resume)

print("Transforming...")
X = cv.transform([cleaned])

print("Predicting...")
pred = model.predict(X)

dict_category = {0: 'Advocate', 1: 'Arts', 2: 'Automation Testing', 3: 'Blockchain', 4: 'Business Analyst', 5: 'Civil Engineer', 6: 'Data Science', 7: 'Database', 8: 'DevOps Engineer', 9: 'DotNet Developer', 10: 'ETL Developer', 11: 'Electrical Engineering', 12: 'HR', 13: 'Hadoop', 14: 'Health and fitness', 15: 'Java Developer', 16: 'Mechanical Engineer', 17: 'Network Security Engineer', 18: 'Operations Manager', 19: 'PMO', 20: 'Python Developer', 21: 'SAP Developer', 22: 'Sales', 23: 'Testing', 24: 'Web Designing'}

print(f"Prediction ID: {pred[0]}")
print(f"Predicted Category: {dict_category[pred[0]]}")

if dict_category[pred[0]] == 'Data Science':
    print("SUCCESS: Fix verified!")
else:
    print(f"DEBUG: Predicted {dict_category[pred[0]]} instead of Data Science. Check mapping.")
