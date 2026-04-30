import pandas as pd
import pickle
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import nltk
from nltk.corpus import stopwords
import re
import os

# Ensure NLTK resources
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = " ".join([word for word in text.split() if word not in stop_words])
    return text

print("Loading dataset...")
df = pd.read_csv('UpdatedResumeDataSet.csv')

print("Cleaning data...")
df['Cleaned_Resume'] = df['Resume'].apply(lambda x: clean_text(x))

print("Vectorizing...")
cv = TfidfVectorizer(max_features=5000)
X = cv.fit_transform(df['Cleaned_Resume'])

print("Encoding labels...")
le = LabelEncoder()
y = le.fit_transform(df['Category'])

# Save the category mapping for reference in the app
mapping = dict(zip(le.transform(le.classes_), le.classes_))
print(f"Category Mapping: {mapping}")

print("Training Random Forest model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

print("Saving components...")
pickle.dump(cv, open('cv.pickle', 'wb'))
joblib.dump(model, 'RF.joblib')

print("Re-training complete. cv.pickle and RF.joblib updated.")
