import pickle
import joblib
import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
import warnings

# Suppress the warning while we load it one last time
warnings.filterwarnings("ignore", category=UserWarning)

print(f"Current scikit-learn version: {sklearn.__version__}")

try:
    print("Loading old cv.pickle...")
    cv = pickle.load(open('cv.pickle', 'rb'))
    
    print("Refreshing cv.pickle...")
    # By saving it with the current version, we update the metadata
    with open('cv.pickle', 'wb') as f:
        pickle.dump(cv, f)
    print("Successfully refreshed cv.pickle!")
    
    # Also refresh the model since it depends on cv
    print("Loading model...")
    model = joblib.load('RF.joblib')
    print("Refreshing RF.joblib...")
    joblib.dump(model, 'RF.joblib')
    print("Successfully refreshed RF.joblib!")

except Exception as e:
    print(f"Error during refresh: {e}")
    # If loading fails entirely, we would need to recreate from scratch
    # but based on previous steps, it loads with a warning.
