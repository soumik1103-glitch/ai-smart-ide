import React, { useState } from "react";
import Editor from "@monaco-editor/react";

function App() {
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const analyzeCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, user_input: userInput })
      });
      const data = await response.json();
      setOutput(data);
    } catch (error) {
      console.error(error);
      setOutput({
        bug_prediction: "",
        llm_explanation: "Error connecting to backend",
        execution_result: ""
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "10px 20px", background: "#1e1e1e", color: "white" }}>
        <h2>AI-Powered Smart IDE</h2>
      </header>

      <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <textarea
          placeholder="Enter input for your program (if any)..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{ width: "100%", height: "60px", padding: "6px" }}
        ></textarea>

        <button onClick={analyzeCode} style={{ padding: "6px 12px", alignSelf: "flex-start" }}>
          Analyze Code
        </button>
      </div>

      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
        />
      </div>

      <div style={{ padding: "10px", background: "#f4f4f4" }}>
        {loading && <p>Analyzing code...</p>}

        {output && (
          <div style={{ marginTop: "10px" }}>
            <h3>ML Bug Prediction:</h3>
            <p style={{ color: output.bug_prediction.includes("⚠️") ? "red" : "green" }}>
              {output.bug_prediction}
            </p>

            <h3>LLM Explanation:</h3>
            <pre
              style={{
                background: "white",
                padding: "10px",
                border: "1px solid #ddd",
                maxHeight: "200px",
                overflowY: "auto"
              }}
            >
              {output.llm_explanation}
            </pre>

            <h3>Execution Output:</h3>
            <pre
              style={{
                background: "#eee",
                padding: "10px",
                border: "1px solid #ddd",
                maxHeight: "200px",
                overflowY: "auto"
              }}
            >
              {output.execution_result}
            </pre>
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <h3>AI Chat:</h3>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ddd",
              padding: "10px",
              background: "#f9f9f9"
            }}
          >
            {chatHistory.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: "8px" }}>
                <b>{msg.role}:</b> {msg.content}
              </div>
            ))}
          </div>
          <textarea
            placeholder="Ask AI about your code..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{ width: "100%", height: "60px", marginTop: "10px" }}
          ></textarea>
          <button
            onClick={async () => {
              const userMessage = chatInput;
              setChatHistory([...chatHistory, { role: "User", content: userMessage }]);
              setChatInput("");

              const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
              });
              const data = await response.json();
              setChatHistory((prev) => [...prev, { role: "AI", content: data.reply }]);
            }}
            style={{ padding: "6px 12px", marginTop: "5px" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
