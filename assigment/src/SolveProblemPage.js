import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Split from "react-split";
import MonacoEditor from "@monaco-editor/react";
import "./SolveProblemPage.css";

function SolveProblemPage({ problems, userInfo }) {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const problem = problems.find((p) => String(p.id) === String(problemId)) || {};

  // State for verdict of each test case (null=not run, true=pass, false=fail)
  const [testCaseResults, setTestCaseResults] = useState([null, null, null, null, null]);
  const [tab, setTab] = useState("description");
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("python");
  const [customInput, setCustomInput] = useState("");
  const [runMessage, setRunMessage] = useState("");
  const [customOutput, setCustomOutput] = useState("");

  const example = problem.example || { input: "1 2", output: "3" };

  // Run official test cases (toolbar run)
  const handleRun = () => {
    const simulated = Array(5)
      .fill(0)
      .map(() => Math.random() > 0.5);
    setTestCaseResults(simulated);
    setRunMessage("Code evaluated. Green = pass, Red = fail.");
    setTab("testcases");
  };

  // Run custom input ONLY
  const handleRunCustom = () => {
    if (customInput.trim().length > 0) {
      setCustomOutput(
        "(Simulated Output): " + customInput.split("").reverse().join("")
      );
    } else {
      setCustomOutput("");
    }
  };

  const handleSubmit = () => {
    setRunMessage("Submission sent! Results will be shown after evaluation.");
    // Optionally: call handleRun() or do real backend submit
  };

  return (
    <div className="solve-problem-page-root">
      <Split
        className="split-panel"
        sizes={[46, 54]}
        minSize={320}
        gutterSize={6}
        cursor="col-resize"
      >
        {/* LEFT PANEL */}
        <div className="left-question-panel">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="arrow">←</span> Back
          </button>
          <h2>{problem.title}</h2>
          <div className={`difficulty-badge ${problem.difficulty?.toLowerCase()}`}>
            {problem.difficulty}
          </div>
          <div className="panel-tabs">
            <button className={tab === "description" ? "active" : ""} onClick={() => setTab("description")}>Description</button>
            <button className={tab === "examples" ? "active" : ""} onClick={() => setTab("examples")}>Examples</button>
            <button className={tab === "testcases" ? "active" : ""} onClick={() => setTab("testcases")}>Test Cases</button>
            <button className={tab === "custom" ? "active" : ""} onClick={() => setTab("custom")}>Custom Input</button>
          </div>

          <div className="panel-tabpane">
            {tab === "description" && (
              <div className="question-description">{problem.description || "No description yet."}</div>
            )}
            {tab === "examples" && (
              <div>
                <strong>Example Input:</strong>
                <pre>{example.input}</pre>
                <strong>Example Output:</strong>
                <pre>{example.output}</pre>
              </div>
            )}
            {tab === "testcases" && (
              <div style={{ marginTop: 10 }}>
                <div className="testcase-boxes">
                  {testCaseResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`testcase-box ${
                        result === null ? "idle" : result ? "pass" : "fail"
                      }`}
                      title={result === null ? "Not evaluated" : result ? "Passed" : "Failed"}
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
                <div style={{ color: "#888", fontStyle: "italic", marginTop: 10 }}>
                  Test cases are hidden and will be evaluated automatically upon submission.<br />
                  Each box shows Pass/Fail after evaluation.
                </div>
              </div>
            )}
            {tab === "custom" && (
              <div>
                <label htmlFor="custom-input"><strong>Custom Input:</strong></label>
                <textarea
                  id="custom-input"
                  className="custom-input-area"
                  rows="6"
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  placeholder="Enter your own test input here"
                />
                <button
                  className="run-btn"
                  style={{ marginTop: 12, marginBottom: 8, minWidth: 120 }}
                  onClick={handleRunCustom}
                  type="button"
                >
                  Run Custom Input
                </button>
                {customOutput && (
                  <div
                    style={{
                      marginTop: 10,
                      background: "#f3f2fc",
                      borderRadius: 6,
                      fontSize: "1em",
                      color: "#4c3488",
                      padding: "9px 14px",
                      border: "1px solid #d3caf3",
                      fontWeight: 500
                    }}
                  >
                    <b>Custom Output:</b>
                    <pre style={{ margin: 0 }}>{customOutput}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-editor-panel">
          <div className="editor-toolbar">
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <button className="run-btn" onClick={handleRun}>Run</button>
            <button className="submit-btn" style={{ marginLeft: 8 }} onClick={handleSubmit}>Submit</button>
          </div>
          <MonacoEditor
            height="410px"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(val) => setCode(val)}
            options={{
              fontSize: 15,
              minimap: { enabled: false }
            }}
          />
          {runMessage && (
            <div className="output-panel" style={{ marginTop: 12 }}>
              {runMessage}
            </div>
          )}
        </div>
      </Split>
    </div>
  );
}

export default SolveProblemPage;
