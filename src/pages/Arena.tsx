import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  FileText,
  LockKeyhole,
  Play,
  Save,
  Target,
  Trophy,
} from "lucide-react";
import { challenges } from "../content/challenges";
import { useStore } from "../store";
import CodeEditor from "../components/CodeEditor";
import { usePython } from "../usePython";

type PreviewRow = Record<string, string>;

export default function Arena() {
  const { id } = useParams();
  const selected = challenges.find((challenge) => challenge.id === id);
  const { data } = useStore();

  if (id && !selected) {
    return (
      <div className="page">
        <h1>Challenge not found</h1>
        <Link to="/arena">Open Arena</Link>
      </div>
    );
  }

  if (selected) return <CompetitionWorkspace challenge={selected} />;

  const attempts = Object.values(data.challengeScores).reduce((sum, score) => sum + score.attempts, 0);

  return (
    <div className="page arena-page">
      <header className="arena-hero">
        <div>
          <span className="eyebrow">CHALLENGE ARENA · BUILD, ANALYZE, SHIP</span>
          <h1>Practice with real workspaces<span className="blue-dot">.</span></h1>
          <p>
            Competitions are project environments, not quizzes. Inspect data, build an artifact,
            document your reasoning, and publish a reproducible submission.
          </p>
        </div>
        <div className="arena-stats">
          <div><strong>{attempts}</strong><span>published attempts</span></div>
          <div><strong>{Object.keys(data.challengeDrafts).length}</strong><span>saved workspaces</span></div>
        </div>
      </header>

      <div className="arena-grid">
        {challenges.map((challenge) => {
          const score = data.challengeScores[challenge.id];
          const draft = data.challengeDrafts[challenge.id];
          return (
            <Link className="arena-card" to={"/arena/" + challenge.id} key={challenge.id}>
              <div className="arena-card-top">
                <span className={"arena-status " + challenge.status}>
                  {challenge.status === "open" ? "Open competition" : "Practice competition"}
                </span>
                <span><Clock3 size={14} /> {challenge.minutes} min target</span>
              </div>
              <h2>{challenge.title}</h2>
              <p>{challenge.brief}</p>
              <div className="tags">
                {challenge.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}
              </div>
              <div className="arena-card-foot">
                <span>{draft ? "Workspace saved" : challenge.domain + " · " + challenge.difficulty}</span>
                <strong>
                  {score?.attempts ? score.attempts + (score.attempts === 1 ? " submission" : " submissions") : "Open workspace"}
                  <ArrowRight size={14} />
                </strong>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CompetitionWorkspace({ challenge }: { challenge: (typeof challenges)[number] }) {
  const { data, update } = useStore();
  const py = usePython();
  const saved = data.challengeScores[challenge.id];
  const draft = data.challengeDrafts[challenge.id];

  const [source, setSource] = useState(draft?.source || challenge.notebook?.starter || "");
  const [notes, setNotes] = useState(draft?.notes || "");
  const [runPassed, setRunPassed] = useState(Boolean(draft?.runPassed));
  const [dataOpened, setDataOpened] = useState(Boolean(draft?.dataOpened));
  const [dimension, setDimension] = useState(draft?.analysisDimension || "region");
  const [metric, setMetric] = useState(draft?.analysisMetric || "revenue");
  const [chartBuilt, setChartBuilt] = useState(Boolean(draft?.chartBuilt));
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [activeDataset, setActiveDataset] = useState(0);
  const [dataError, setDataError] = useState("");

  const isAnalytics = challenge.id === "analytics-decision-room";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      update((current) => ({
        ...current,
        challengeDrafts: {
          ...current.challengeDrafts,
          [challenge.id]: {
            source,
            notes,
            checklist: [],
            runPassed,
            lastEdited: Date.now(),
            dataOpened,
            analysisMetric: metric,
            analysisDimension: dimension,
            chartBuilt,
          },
        },
      }));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [
    challenge.id,
    source,
    notes,
    runPassed,
    dataOpened,
    metric,
    dimension,
    chartBuilt,
    update,
  ]);

  useEffect(() => {
    if (!challenge.datasets.length) return;
    void loadDataset(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id]);

  async function loadDataset(index: number) {
    const dataset = challenge.datasets[index];
    if (!dataset) return;
    setActiveDataset(index);
    setDataError("");
    try {
      const response = await fetch(import.meta.env.BASE_URL + dataset.path);
      if (!response.ok) throw new Error("Dataset could not be loaded.");
      const text = await response.text();
      const parsed = parseCsv(text);
      setPreviewHeaders(parsed.headers);
      setPreviewRows(parsed.rows);
      setDataOpened(true);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Dataset could not be loaded.");
    }
  }

  useEffect(() => {
    if (isAnalytics) setChartBuilt(false);
  }, [dimension, metric, isAnalytics]);

  const chartData = useMemo(() => {
    if (!isAnalytics || !previewRows.length) return [];
    const totals = new Map<string, number>();
    for (const row of previewRows) {
      const key = row[dimension] || "Unknown";
      const value = Number(row[metric]);
      if (!Number.isFinite(value)) continue;
      totals.set(key, (totals.get(key) || 0) + value);
    }
    return Array.from(totals, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [previewRows, dimension, metric, isAnalytics]);

  const totalMetric = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData],
  );

  async function runNotebook() {
    if (!challenge.notebook) return;
    const passed = await py.run(source, challenge.notebook.tests);
    setRunPassed(passed);
  }

  const requirements = useMemo(() => {
    if (isAnalytics) {
      return [
        { label: "Data inspected", detail: "The supplied CSV loaded in the workspace.", done: dataOpened },
        { label: "Visual analysis built", detail: "A metric has been aggregated into a chart.", done: chartBuilt },
        { label: "Decision insight written", detail: "Your memo contains a useful business interpretation.", done: notes.trim().length >= 80 },
      ];
    }

    if (challenge.notebook) {
      return [
        { label: "Data inspected", detail: "The supplied competition data has been opened.", done: challenge.datasets.length ? dataOpened : true },
        { label: "Notebook verified", detail: "The runnable solution passes the hidden behavior checks.", done: runPassed },
        { label: "Evidence documented", detail: "Your notes explain what worked, failed, and what you would improve.", done: notes.trim().length >= 80 },
      ];
    }

    return [
      { label: "Artifact documented", detail: "Your workspace contains a substantive release/audit artifact.", done: notes.trim().length >= 160 },
      { label: "Evidence language included", detail: "The write-up contains PASS, FAIL, or N/A evidence language.", done: /\b(PASS|FAIL|N\/A)\b/i.test(notes) },
    ];
  }, [challenge.datasets.length, challenge.notebook, dataOpened, isAnalytics, chartBuilt, notes, runPassed]);

  const completedRequirements = requirements.filter((item) => item.done).length;
  const publishReady = completedRequirements === requirements.length;

  function publish() {
    if (!publishReady) return;
    update((current) => {
      const previous = current.challengeScores[challenge.id] || {
        best: 0,
        attempts: 0,
        lastRun: 0,
      };
      return {
        ...current,
        challengeScores: {
          ...current.challengeScores,
          [challenge.id]: {
            best: 100,
            attempts: previous.attempts + 1,
            lastRun: Date.now(),
          },
        },
      };
    });
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: data.reduced ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div className="competition-workspace">
      <header className="competition-topbar">
        <Link className="competition-back" to="/arena" aria-label="Back to Arena">
          <ArrowLeft size={19} />
        </Link>
        <div>
          <span>{challenge.domain}</span>
          <strong>{challenge.title}</strong>
        </div>
        <div className="competition-topbar-actions">
          <span>{saved?.attempts ? saved.attempts + " published" : "Draft"}</span>
          {challenge.notebook && (
            <button type="button" onClick={() => void runNotebook()} disabled={py.busy}>
              <Play size={16} fill="currentColor" />
              {py.busy ? "Running…" : "Run"}
            </button>
          )}
        </div>
      </header>

      <div className={"competition-status-banner " + challenge.status}>
        {challenge.status === "open" ? <Target size={16} /> : <LockKeyhole size={16} />}
        <span>
          {challenge.status === "open"
            ? "Open competition workspace · changes save automatically on this device."
            : "Practice workspace · no external leaderboard or deadline."}
        </span>
      </div>

      <nav className="competition-workspace-nav" aria-label="Competition workspace sections">
        <button type="button" onClick={() => scrollTo("competition-brief")}><FileText size={15} /> Brief</button>
        <button type="button" onClick={() => scrollTo("competition-data")}><Database size={15} /> Data</button>
        <button type="button" onClick={() => scrollTo("competition-work")}><BarChart3 size={15} /> Workspace</button>
        <button type="button" onClick={() => scrollTo("competition-submit")}><Trophy size={15} /> Submit</button>
      </nav>

      <main className="competition-project-layout">
        <aside className="competition-project-brief" id="competition-brief">
          <span className="eyebrow">COMPETITION BRIEF</span>
          <h1>{challenge.title}</h1>
          <p className="competition-project-lead">{challenge.brief}</p>

          <div className="competition-background-copy">
            {challenge.background.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          <div className="competition-brief-meta">
            <span><Clock3 size={14} /> {challenge.minutes} min target</span>
            <span>{challenge.difficulty}</span>
          </div>

          <div className="competition-deliverable compact">
            <strong>Deliverable</strong>
            <p>{challenge.deliverable}</p>
          </div>

          <section className="competition-evaluation-guide">
            <span className="eyebrow">HOW THE WORK IS EVALUATED</span>
            {challenge.rubric.map((item) => (
              <div key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.evidence}</span>
                <b>{item.points} pts</b>
              </div>
            ))}
          </section>
        </aside>

        <div className="competition-project-canvas">
          <section className="competition-canvas-section" id="competition-data">
            <div className="competition-canvas-heading">
              <div>
                <span className="eyebrow">01 · DATA</span>
                <h2>Inspect what you have.</h2>
              </div>
              <span className={dataOpened ? "workspace-state ready" : "workspace-state"}>
                {dataOpened ? "Loaded" : "Not opened"}
              </span>
            </div>

            {challenge.datasets.length ? (
              <>
                <div className="competition-dataset-tabs">
                  {challenge.datasets.map((dataset, index) => (
                    <button
                      type="button"
                      className={activeDataset === index ? "selected" : ""}
                      onClick={() => void loadDataset(index)}
                      key={dataset.name}
                    >
                      <Database size={14} />
                      {dataset.name}
                    </button>
                  ))}
                </div>

                {dataError ? (
                  <p role="alert" className="storage-error">{dataError}</p>
                ) : (
                  <DataPreview
                    headers={previewHeaders}
                    rows={previewRows}
                    dataset={challenge.datasets[activeDataset]}
                  />
                )}
              </>
            ) : (
              <div className="competition-empty-data">
                <Database size={22} />
                <strong>No supplied dataset</strong>
                <span>This challenge is driven by architecture and release evidence.</span>
              </div>
            )}
          </section>

          <section className="competition-canvas-section" id="competition-work">
            <div className="competition-canvas-heading">
              <div>
                <span className="eyebrow">02 · WORKSPACE</span>
                <h2>{isAnalytics ? "Build the analysis." : challenge.notebook ? "Build the solution." : "Build the artifact."}</h2>
              </div>
              <span className="workspace-state">Autosaved</span>
            </div>

            {isAnalytics ? (
              <AnalyticsWorkbench
                headers={previewHeaders}
                rows={previewRows}
                dimension={dimension}
                metric={metric}
                chartBuilt={chartBuilt}
                chartData={chartData}
                totalMetric={totalMetric}
                onDimension={setDimension}
                onMetric={setMetric}
                onBuild={() => setChartBuilt(true)}
              />
            ) : challenge.notebook ? (
              <div className="competition-notebook-workbench">
                <p className="competition-notebook-goal">{challenge.notebook.goal}</p>
                <div className="competition-code-cell">
                  <div className="competition-code-cell-head">
                    <span>Python notebook · saved automatically</span>
                    <button type="button" onClick={() => void runNotebook()} disabled={py.busy}>
                      <Play size={15} fill="currentColor" /> {py.busy ? "Running…" : "Run"}
                    </button>
                  </div>
                  <CodeEditor
                    value={source}
                    onChange={(next) => {
                      setSource(next);
                      setRunPassed(false);
                    }}
                    label="Competition Python source"
                    disabled={py.busy}
                  />
                </div>

                <div className={"competition-output " + (runPassed ? "passed" : py.error ? "failed" : "")}>
                  <div>
                    <strong>{runPassed ? "Behavior checks passed" : py.error ? "Execution needs attention" : py.status}</strong>
                    {py.busy && <button type="button" onClick={() => py.stop()}>Stop</button>}
                  </div>
                  <pre aria-label="Competition Python output">{py.error || py.output}</pre>
                </div>
              </div>
            ) : (
              <div className="competition-document-workbench">
                <div className="competition-document-toolbar">
                  <FileText size={16} />
                  <span>Release / audit workspace</span>
                  <small>Write the artifact here. Use PASS / FAIL / N/A evidence where appropriate.</small>
                </div>
                <textarea
                  aria-label="Competition working document"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Build your audit, architecture note, decision memo, or release evidence here..."
                />
              </div>
            )}

            {(isAnalytics || challenge.notebook) && (
              <label className="competition-insight-editor">
                <span>{isAnalytics ? "Decision memo" : "Evidence notes"}</span>
                <textarea
                  aria-label={isAnalytics ? "Decision memo" : "Evidence notes"}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={
                    isAnalytics
                      ? "What changed? What is driving it? What decision should the business make next?"
                      : "Explain what you built, tested, learned, and what you would improve next."
                  }
                />
              </label>
            )}
          </section>

          <section className="competition-canvas-section competition-submit-panel" id="competition-submit">
            <div className="competition-canvas-heading">
              <div>
                <span className="eyebrow">03 · SUBMIT</span>
                <h2>Publish when the work is reproducible.</h2>
              </div>
              <span className={publishReady ? "workspace-state ready" : "workspace-state"}>
                {completedRequirements}/{requirements.length} ready
              </span>
            </div>

            <div className="competition-readiness-list">
              {requirements.map((item) => (
                <div className={item.done ? "done" : ""} key={item.label}>
                  <span>{item.done ? <CheckCircle2 size={17} /> : String(requirements.indexOf(item) + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="competition-publish-bar">
              <div>
                <strong>{publishReady ? "Ready to publish." : "Keep building the submission."}</strong>
                <span>
                  {publishReady
                    ? "This saves a completed attempt to your local learning record."
                    : "Readiness updates automatically from the work you do above."}
                </span>
              </div>
              <button className="primary" type="button" onClick={publish} disabled={!publishReady}>
                <Save size={16} /> Publish attempt
              </button>
            </div>
          </section>
        </div>
      </main>

      {challenge.launch && (
        <Link className="competition-supporting-lab" to={challenge.launch}>
          Need to rebuild the concept first? Open the supporting Lab <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}

function DataPreview({
  headers,
  rows,
  dataset,
}: {
  headers: string[];
  rows: PreviewRow[];
  dataset: (typeof challenges)[number]["datasets"][number] | undefined;
}) {
  if (!dataset) return null;
  if (!rows.length) {
    return (
      <div className="competition-data-loading">
        <span>Loading {dataset.name}…</span>
      </div>
    );
  }

  return (
    <div className="competition-data-preview">
      <div className="competition-data-preview-meta">
        <div>
          <strong>{dataset.name}</strong>
          <span>{dataset.description}</span>
        </div>
        <span>{dataset.rows} rows · {headers.length} columns</span>
      </div>

      <div className="competition-preview-scroll">
        <table>
          <thead>
            <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((row, index) => (
              <tr key={index}>
                {headers.map((header) => <td key={header}>{row[header]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="competition-schema-details">
        <summary>Variable dictionary</summary>
        <div>
          {dataset.columns.map((column) => (
            <p key={column.name}>
              <code>{column.name}</code>
              <span>{column.description}</span>
            </p>
          ))}
        </div>
      </details>
    </div>
  );
}

function AnalyticsWorkbench({
  headers,
  rows,
  dimension,
  metric,
  chartBuilt,
  chartData,
  totalMetric,
  onDimension,
  onMetric,
  onBuild,
}: {
  headers: string[];
  rows: PreviewRow[];
  dimension: string;
  metric: string;
  chartBuilt: boolean;
  chartData: Array<{ label: string; value: number }>;
  totalMetric: number;
  onDimension: (value: string) => void;
  onMetric: (value: string) => void;
  onBuild: () => void;
}) {
  const dimensions = headers.filter((header) =>
    rows.some((row) => row[header] && !Number.isFinite(Number(row[header]))),
  );
  const metrics = headers.filter((header) =>
    rows.length > 0 && rows.every((row) => row[header] === "" || Number.isFinite(Number(row[header]))),
  );

  const max = Math.max(...chartData.map((item) => item.value), 1);

  return (
    <div className="analytics-workbench">
      <div className="analytics-builder">
        <div>
          <label>
            <span>Group by</span>
            <select value={dimension} onChange={(event) => onDimension(event.target.value)}>
              {(dimensions.length ? dimensions : ["region", "product", "month"]).map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Measure</span>
            <select value={metric} onChange={(event) => onMetric(event.target.value)}>
              {(metrics.length ? metrics : ["revenue", "units", "discount"]).map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="button" onClick={onBuild} disabled={!rows.length}>
          <BarChart3 size={16} /> Build visual
        </button>
      </div>

      {chartBuilt ? (
        <div className="analytics-chart-board">
          <div className="analytics-kpi-strip">
            <div>
              <span>Total {metric}</span>
              <strong>{formatMetric(totalMetric)}</strong>
            </div>
            <div>
              <span>Groups</span>
              <strong>{chartData.length}</strong>
            </div>
            <div>
              <span>Top {dimension}</span>
              <strong>{chartData[0]?.label || "—"}</strong>
            </div>
          </div>

          <div className="analytics-bar-chart" role="img" aria-label={metric + " by " + dimension}>
            {chartData.map((item) => (
              <div className="analytics-bar-row" key={item.label}>
                <span>{item.label}</span>
                <div><i style={{ width: Math.max(4, (item.value / max) * 100) + "%" }} /></div>
                <strong>{formatMetric(item.value)}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="analytics-empty-chart">
          <BarChart3 size={28} />
          <strong>Your visual will appear here.</strong>
          <span>Choose a grouping and measure, then build the chart.</span>
        </div>
      )}
    </div>
  );
}

function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return { headers: [] as string[], rows: [] as PreviewRow[] };
  const headers = lines[0].split(",").map((item) => item.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((item) => item.replace(/^"|"$/g, "").trim());
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
  return { headers, rows };
}

function formatMetric(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}
