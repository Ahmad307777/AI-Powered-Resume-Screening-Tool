import pickle
import sys
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer

try:
    with open('cv.pickle', 'rb') as f:
        cv = pickle.load(f)
    print(f"Type: {type(cv)}")
    if hasattr(cv, 'vocabulary_'):
        print(f"Vocabulary size: {len(cv.vocabulary_)}")
    else:
        print("Vocabulary not found.")
    if hasattr(cv, 'idf_'):
        print("TfidfVectorizer is fitted with IDF weights.")
    elif isinstance(cv, TfidfVectorizer):
        print("TfidfVectorizer is NOT fitted with IDF weights.")
    elif isinstance(cv, CountVectorizer):
        print("Object is a CountVectorizer.")
    else:
        print("Object is not a TfidfVectorizer or CountVectorizer.")
except Exception as e:
    print(f"Error: {e}")
