import React, { useState } from "react";

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const analyzeCode = async () => {
  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code })
    });

    const data = await response.json();
    setOutput(data.result);
  } catch (err) {
    setOutput("Error connecting to backend");
    console.error(err);
  }
};
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AI-Powered Smart IDE</h1>

      <textarea
        rows="12"
        cols="80"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", fontSize: "16px" }}
      />

      <br /><br />

      <button onClick={analyzeCode} style={{ padding: "10px 20px" }}>
        Analyze Code
      </button>

      <h3>Output:</h3>
      <div
        style={{
          background: "#f4f4f4",
          padding: "10px",
          minHeight: "50px"
        }}
      >
        {output}
      </div>
    </div>
  );
}

export default App;
