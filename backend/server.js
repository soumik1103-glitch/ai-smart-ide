const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend connected successfully 🚀");
});

app.post("/analyze", (req, res) => {
  const { code } = req.body;
  console.log("Received code:", code);

  if (!code) {
    return res.json({ result: "No code provided." });
  }

   res.json({
    result: "Backend received your code successfully!"
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
