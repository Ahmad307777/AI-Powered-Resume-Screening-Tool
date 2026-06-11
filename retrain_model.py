import pandas as pd
import pickle
import joblib
import re
import warnings
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import nltk
from nltk.corpus import stopwords

warnings.filterwarnings('ignore')
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = " ".join([w for w in text.split() if w not in stop_words])
    return text

print("Loading UpdatedResumeDataSet.csv...")
df = pd.read_csv('UpdatedResumeDataSet.csv')
print(f"Total rows: {len(df)}, Categories: {df['Category'].nunique()}")

print("Cleaning text...")
df['Cleaned_Resume'] = df['Resume'].apply(clean_text)

print("Encoding labels...")
le = LabelEncoder()
df['Label'] = le.fit_transform(df['Category'])

print("Vectorizing...")
cv = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), sublinear_tf=True)
X = cv.fit_transform(df['Cleaned_Resume'])
y = df['Label'].values

print("Training RandomForestClassifier...")
model = RandomForestClassifier(n_estimators=200, random_state=42, class_weight='balanced')
model.fit(X, y)

print("Saving models...")
pickle.dump(cv, open('cv.pickle', 'wb'))
joblib.dump(model, 'RF.joblib')

print("\ndict_category = {")
for i, cls in enumerate(le.classes_):
    print(f"    {i}: '{cls}',")
print("}")
print("Done.")
