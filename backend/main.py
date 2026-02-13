from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
import joblib
import requests
import os
import sys

# Add ai_service path so Python can find your ML model and helper modules
sys.path.append(os.path.join(os.path.dirname(__file__), "../ai_service"))

# Load your ML model from ai_service folder
bug_model_path = os.path.join(os.path.dirname(__file__), "../ai_service/bug_model.pkl")
bug_model = joblib.load(bug_model_path)

# Load API key from .env
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "../ai_service/.env"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Request schema
class CodeRequest(BaseModel):
    code: str
    action: str  # "run", "ml", "llm"

# ML prediction function
def ml_predict(code: str):
    # Replace with your model logic
    # Demo: mark lines > 80 chars as warnings
    bugs = []
    for idx, line in enumerate(code.split("\n")):
        if len(line) > 80:
            bugs.append({"line": idx + 1, "issue": "Line too long"})
    return bugs

# LLM explanation function
def llm_explain(code: str):
    if not OPENAI_API_KEY:
        return "No API key found for LLM."
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": f"Explain this code:\n{code}"}],
    }
    response = requests.post("https://api.openai.com/v1/chat/completions", json=data, headers=headers)
    return response.json()["choices"][0]["message"]["content"]

# Code execution function (Python only)
def execute_code(code: str):
    try:
        result = subprocess.run(
            ["python", "-c", code],
            capture_output=True,
            text=True,
            timeout=5
        )
        return {"stdout": result.stdout, "stderr": result.stderr}
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Execution timed out"}

@app.post("/process-code")
def process_code(request: CodeRequest):
    if request.action == "run":
        return execute_code(request.code)
    elif request.action == "ml":
        return {"bugs": ml_predict(request.code)}
    elif request.action == "llm":
        return {"explanation": llm_explain(request.code)}
    else:
        return {"error": "Invalid action"}
