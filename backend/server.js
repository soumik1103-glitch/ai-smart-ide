// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // npm i node-fetch@2

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend live. Use POST /analyze and /chat");
});

app.post("/analyze", async (req, res) => {
  const { code, language, user_input } = req.body;
  try {
    const response = await fetch("http://localhost:7000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, user_input })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("AI service error:", err.message || err);
    res.status(500).json({ 
      bug_prediction: "", 
      llm_explanation: "Python AI service not reachable", 
      execution_result: "" 
    });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("http://localhost:7000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ reply: "Python AI chat service not reachable" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
