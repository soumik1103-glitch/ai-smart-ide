const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // make sure installed: npm i node-fetch@2

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Simple GET route to check backend
app.get("/", (req, res) => {
  res.send("Backend is live! Use POST /analyze to talk to AI.");
});

app.post("/analyze", async (req, res) => {
  const userCode = req.body.code;
  console.log("Received code:", userCode);

  try {
    // Use localhost instead of 127.0.0.1 on Windows if 127.0.0.1 fails
   const response = await fetch("http://127.0.0.1:7000/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: userCode }),
});


    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("AI service error:", err.message || err);
    res.status(500).json({ result: "Python AI service not reachable" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
