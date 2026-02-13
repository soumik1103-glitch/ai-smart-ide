import React, { useState } from "react";
import Editor from "@monaco-editor/react";

function App() {
  const [code, setCode] = useState("// Write your code here...");
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
    } catch (error) {
      console.error(error);
      setOutput("Error connecting to backend");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: "10px 20px",
          background: "#1e1e1e",
          color: "white"
        }}
      >
        <h2>AI-Powered Smart IDE</h2>
      </header>

      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
        />
      </div>

      <div style={{ padding: "10px", background: "#f4f4f4" }}>
        <button onClick={analyzeCode} style={{ padding: "8px 16px" }}>
          Analyze Code
        </button>

        <h3>Output:</h3>
        <div
          style={{
            background: "white",
            padding: "10px",
            minHeight: "60px",
            border: "1px solid #ddd"
          }}
        >
          {output}
        </div>
      </div>
    </div>
  );
}

export default App;
