import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Play,
  RotateCcw,
  Copy,
  Square,
  Terminal,
  ArrowUpRight,
  ChartColumn,
  Brain,
  Code2,
} from "lucide-react";
import { starter } from "../content/catalog";
import CodeEditor from "../components/CodeEditor";
import { usePython } from "../usePython";
import VisualStudio from "./VisualStudio";
import LivingLab from "./LivingLab";

type LabMode = "visual" | "explain" | "code";

function CodeWorkspace() {
  const [source, setSource] = useState(starter);
  const [copied, setCopied] = useState("Copy");
  const py = usePython();

  return (
    <div className="unified-code-workspace">
      <div className="lab-context">
        <span className="mini-symbol">Py</span>
        <div>
          <strong>Functions & reporting rules</strong>
          <p>Change the inputs. Predict the result. Then test your thinking.</p>
        </div>
        <Link to="/read/python-functions">
          Read the chapter <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="lab-grid">
        <section className="editor-panel">
          <div className="editor-bar">
            <strong>practice.py</strong>
            <span>Python · Pyodide</span>
          </div>
          <CodeEditor value={source} onChange={setSource} disabled={py.busy} />
          <div className="editor-controls">
            <button className="primary" onClick={() => void py.run(source)} disabled={py.busy}>
              <Play size={15} /> Run Python
            </button>
            {py.busy && (
              <button onClick={() => py.stop()}>
                <Square size={15} /> Stop
              </button>
            )}
            <button onClick={() => setSource(starter)} disabled={py.busy}>
              <RotateCcw size={15} /> Reset
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(source);
                  setCopied("Copied");
                } catch {
                  setCopied("Clipboard unavailable");
                }
              }}
            >
              <Copy size={15} /> {copied}
            </button>
          </div>
        </section>

        <section className="console-panel">
          <div className="editor-bar">
            <strong><Terminal size={17} /> Console</strong>
            <span>stdout / stderr</span>
          </div>
          <p className="runtime-status" role="status">{py.status}</p>
          <pre aria-label="Python output">{py.output}</pre>
          {py.error && <pre className="traceback" role="alert">{py.error}</pre>}
        </section>
      </div>

      <details className="panel runtime-notes">
        <summary>About this Python environment</summary>
        <p>
          Python executes locally through WebAssembly in a dedicated worker. No
          source code is sent to an application server. Execution stops after
          120 seconds, output is capped, and this remains a learning environment
          rather than a hostile-code security sandbox.
        </p>
      </details>
    </div>
  );
}

export default function Lab() {
  const [params, setParams] = useSearchParams();
  const rawMode = params.get("mode");
  const mode: LabMode =
    rawMode === "visual" || rawMode === "explain" || rawMode === "code"
      ? rawMode
      : "code";

  function choose(next: LabMode) {
    setParams(next === "code" ? {} : { mode: next });
  }

  return (
    <div className="page unified-lab">
      <header className="unified-lab-header">
        <div>
          <span className="eyebrow">INTERACTIVE LAB</span>
          <h1>One lab. Three ways to understand<span className="blue-dot">.</span></h1>
          <p>
            Visualize a concept, explain it in your own words, or test it with
            executable code. These are modes of the same learning tool—not separate apps.
          </p>
        </div>
      </header>

      <div className="unified-lab-tabs" role="tablist" aria-label="Lab modes">
        <button
          role="tab"
          aria-selected={mode === "visual"}
          className={mode === "visual" ? "selected" : ""}
          onClick={() => choose("visual")}
        >
          <ChartColumn size={18} />
          <span><strong>Visualize</strong><small>See relationships change</small></span>
        </button>
        <button
          role="tab"
          aria-selected={mode === "explain"}
          className={mode === "explain" ? "selected" : ""}
          onClick={() => choose("explain")}
        >
          <Brain size={18} />
          <span><strong>Explain</strong><small>Test your mental model</small></span>
        </button>
        <button
          role="tab"
          aria-selected={mode === "code"}
          className={mode === "code" ? "selected" : ""}
          onClick={() => choose("code")}
        >
          <Code2 size={18} />
          <span><strong>Code</strong><small>Run real Python locally</small></span>
        </button>
      </div>

      <section className="unified-lab-content" role="tabpanel">
        {mode === "visual" && <VisualStudio />}
        {mode === "explain" && <LivingLab />}
        {mode === "code" && <CodeWorkspace />}
      </section>
    </div>
  );
}
