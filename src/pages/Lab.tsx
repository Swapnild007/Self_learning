import { useState } from "react";
import {
  Play,
  RotateCcw,
  Copy,
  Square,
  Terminal,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { starter } from "../content/catalog";
import CodeEditor from "../components/CodeEditor";
import { usePython } from "../usePython";
export default function Lab() {
  const [source, set] = useState(starter);
  const [copied, copy] = useState("Copy");
  const py = usePython();
  return (
    <div className="page">
      <div className="eyebrow">THINK. TRY. UNDERSTAND.</div>
      <h1>Your ideas, executable.</h1>
      <p className="lead">
        A real Python laboratory. A safe place to make mistakes.
      </p>
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
          <CodeEditor value={source} onChange={set} disabled={py.busy} />
          <div className="editor-controls">
            <button
              className="primary"
              onClick={() => void py.run(source)}
              disabled={py.busy}
            >
              <Play size={15} />
              Run Python
            </button>
            {py.busy && (
              <button onClick={() => py.stop()}>
                <Square size={15} />
                Stop
              </button>
            )}
            <button onClick={() => set(starter)} disabled={py.busy}>
              <RotateCcw size={15} />
              Reset
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(source);
                  copy("Copied");
                } catch {
                  copy("Clipboard unavailable");
                }
              }}
            >
              <Copy size={15} />
              {copied}
            </button>
          </div>
        </section>
        <section className="console-panel">
          <div className="editor-bar">
            <strong>
              <Terminal size={17} /> Console
            </strong>
            <span>stdout / stderr</span>
          </div>
          <p className="runtime-status" role="status">
            {py.status}
          </p>
          <pre aria-label="Python output">{py.output}</pre>
          {py.error && (
            <pre className="traceback" role="alert">
              {py.error}
            </pre>
          )}
        </section>
      </div>
      <details className="panel runtime-notes">
        <summary>About this Python environment</summary>
        <p>
          Python executes locally through WebAssembly in a dedicated worker. No
          source code is sent to an application server. The first load downloads
          the bundled Python runtime; it is not guaranteed to work offline until
          browser caching has occurred. Execution stops after 60 seconds; Stop
          destroys the worker, including its in-memory state. Each run has a
          fresh globals dictionary.
        </p>
        <p>
          This is a learning environment, not a security sandbox for hostile
          code. Python can access browser worker APIs and network capabilities.
          Do not paste untrusted scripts or secrets. Input prompts, desktop
          apps, subprocesses and many native packages are unsupported. Output is
          capped at 50,000 characters; a worker limits UI blocking but cannot
          guarantee a memory cap.
        </p>
      </details>
    </div>
  );
}
