# ai_service.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import sys
import os
import traceback

app = Flask(__name__)
CORS(app)

# Dummy ML bug predictor (replace with your trained model)
def predict_bug(code, language):
    # Simple example: if code contains "==" return warning
    if "==" in code:
        return "⚠️ Possible equality comparison issue"
    return "No obvious bug found"

# Safe Python execution
def execute_python(code, user_input=""):
    try:
        # Write code to temp file
        with open("temp_code.py", "w", encoding="utf-8") as f:
            f.write(code)

        # Run code using subprocess
        result = subprocess.run(
            [sys.executable, "temp_code.py"],
            input=user_input.encode("utf-8"),
            capture_output=True,
            timeout=5  # seconds
        )
        output = result.stdout.decode("utf-8")
        errors = result.stderr.decode("utf-8")
        return output + errors
    except Exception as e:
        return str(e)
    finally:
        if os.path.exists("temp_code.py"):
            os.remove("temp_code.py")

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        code = data.get("code", "")
        language = data.get("language", "python")
        user_input = data.get("user_input", "")

        bug_prediction = predict_bug(code, language)

        # LLM explanation (dummy for now)
        llm_explanation = f"Here is the analysis of your {language} code:\n\n{code}"

        # Execute code if Python
        execution_result = ""
        if language == "python":
            execution_result = execute_python(code, user_input)
        else:
            execution_result = f"Execution not supported yet for {language}"

        return jsonify({
            "bug_prediction": bug_prediction,
            "llm_explanation": llm_explanation,
            "execution_result": execution_result
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "bug_prediction": "",
            "llm_explanation": "Error analyzing code",
            "execution_result": str(e)
        })

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "")
    # Dummy response
    reply = f"AI says: I received your message: {message}"
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)  # ← Changed from 5000 to 8000