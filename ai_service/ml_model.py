import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import os

# Sample training data
code_snippets = [
    "print('hello world')",      # clean
    "x = 1/0",                   # bug
    "a = 5",                      # clean
    "undefinedVar = 3"            # bug
]
labels = [0, 1, 0, 1]  # 1 = bug, 0 = clean

# Train vectorizer + model
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(code_snippets)
model = LogisticRegression()
model.fit(X, labels)

# Save model
model_path = os.path.join(os.path.dirname(__file__), "bug_model.pkl")
joblib.dump((model, vectorizer), model_path)

print("bug_model.pkl created successfully!")

# Function to use in service
def predict_bug(code: str) -> str:
    X = vectorizer.transform([code])
    pred = model.predict(X)[0]
    return "Potential bug detected " if pred == 1 else "No obvious bug found"
