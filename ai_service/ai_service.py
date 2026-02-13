from flask import Flask, request, jsonify
import os
from openai import OpenAI

app = Flask(__name__)

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.environ.get("HF_TOKEN"),
)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    prompt = data.get("code", "")

    completion = client.chat.completions.create(
        model="mistralai/Mistral-7B-Instruct-v0.2:together",
        messages=[
            {"role": "user", "content": prompt}
        ],
    )

    return jsonify({
        "result": completion.choices[0].message.content  # <- FIXED HERE
    })

if __name__ == "__main__":
    print("Starting AI Service on http://127.0.0.1:7000")
    app.run(port=7000, debug=True)
