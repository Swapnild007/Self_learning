import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Circle,
  Clock3,
  Code2,
  Database,
  FileText,
  LockKeyhole,
  Medal,
  Play,
  Save,
  Target,
  Trophy,
} from "lucide-react";
import { challenges } from "../content/challenges";
import { useStore } from "../store";
import CodeEditor from "../components/CodeEditor";
import { usePython } from "../usePython";

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

  const mastered = Object.values(data.challengeScores).filter((score) => score.best === 100).length;
  const attempts = Object.values(data.challengeScores).reduce((sum, score) => sum + score.attempts, 0);

  return (
    <div className="page arena-page">
      <header className="arena-hero">
        <div>
          <span className="eyebrow">CHALLENGE ARENA · APPLY WHAT YOU KNOW</span>
          <h1>Build under competition conditions<span className="blue-dot">.</span></h1>
          <p>
            Open a brief, inspect the data, work inside a saved notebook, run your solution,
            complete the publishing checklist, and improve your personal best.
          </p>
        </div>
        <div className="arena-stats">
          <div><strong>{attempts}</strong><span>submissions</span></div>
          <div><strong>{mastered}</strong><span>perfect scores</span></div>
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
                <span>
                  {draft ? "Draft saved" : challenge.domain + " · " + challenge.difficulty}
                </span>
                <strong>{score ? "Best " + score.best + "%" : "Open workspace"} <ArrowRight size={14} /></strong>
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

  const [source, setSource] = useState(
    draft?.source || challenge.notebook?.starter || "",
  );
  const [notes, setNotes] = useState(draft?.notes || "");
  const [checklist, setChecklist] = useState<string[]>(draft?.checklist || []);
  const [runPassed, setRunPassed] = useState(Boolean(draft?.runPassed));
  const [evidence, setEvidence] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      update((current) => ({
        ...current,
        challengeDrafts: {
          ...current.challengeDrafts,
          [challenge.id]: {
            source,
            notes,
            checklist,
            runPassed,
            lastEdited: Date.now(),
          },
        },
      }));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [challenge.id, source, notes, checklist, runPassed, update]);

  const score = useMemo(
    () =>
      challenge.rubric.reduce(
        (sum, item) => sum + (evidence[item.label] ? item.points : 0),
        0,
      ),
    [challenge.rubric, evidence],
  );

  const allChecklist = challenge.checklist.every((item) => checklist.includes(item));
  const notebookReady = challenge.notebook ? runPassed : true;
  const publishReady = allChecklist && notebookReady && notes.trim().length > 0;

  async function runNotebook() {
    if (!challenge.notebook) return;
    const passed = await py.run(source, challenge.notebook.tests);
    setRunPassed(passed);
  }

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
            best: Math.max(previous.best, score),
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
    <div className="page competition-workspace">
      <header className="competition-topbar">
        <Link className="competition-back" to="/arena" aria-label="Back to Arena">
          <ArrowLeft size={19} />
        </Link>
        <div>
          <span>Competition</span>
          <strong>{challenge.title}</strong>
        </div>
        <div className="competition-topbar-actions">
          <span><Trophy size={14} /> Best {saved?.best ?? 0}%</span>
          {challenge.notebook && (
            <button type="button" onClick={() => void runNotebook()} disabled={py.busy}>
              <Play size={16} fill="currentColor" />
              {py.busy ? "Running…" : "Run code"}
            </button>
          )}
        </div>
      </header>

      <div className={"competition-status-banner " + challenge.status}>
        {challenge.status === "open" ? <Target size={16} /> : <LockKeyhole size={16} />}
        <span>
          {challenge.status === "open"
            ? "Open practice competition · your draft is saved in this browser."
            : "Practice competition · no external leaderboard or deadline."}
        </span>
      </div>

      <nav className="competition-workspace-nav" aria-label="Competition workspace sections">
        <button type="button" onClick={() => scrollTo("competition-brief")}><FileText size={15} /> Brief</button>
        <button type="button" onClick={() => scrollTo("competition-data")}><Database size={15} /> Data</button>
        {challenge.notebook && (
          <button type="button" onClick={() => scrollTo("competition-notebook")}><Code2 size={15} /> Code</button>
        )}
        <button type="button" onClick={() => scrollTo("competition-submit")}><Trophy size={15} /> Submit</button>
      </nav>

      <section className="competition-publish-checklist">
        <div>
          <span className="eyebrow">CHECKLIST BEFORE PUBLISHING</span>
          <h2>Make the submission reproducible.</h2>
        </div>
        <div className="competition-checklist-items">
          {challenge.checklist.map((item) => {
            const checked = checklist.includes(item);
            return (
              <button
                key={item}
                type="button"
                className={checked ? "checked" : ""}
                onClick={() =>
                  setChecklist((current) =>
                    checked ? current.filter((entry) => entry !== item) : [...current, item],
                  )
                }
              >
                {checked ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="competition-section" id="competition-brief">
        <div className="competition-section-heading">
          <FileText size={20} />
          <div>
            <span className="eyebrow">BACKGROUND</span>
            <h1>{challenge.title}</h1>
          </div>
        </div>
        <div className="competition-background-copy">
          {challenge.background.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="competition-brief-callout">
          <strong>Competition challenge</strong>
          <p>{challenge.brief}</p>
          <span><Clock3 size={14} /> Target session: {challenge.minutes} minutes</span>
        </div>
      </section>

      <section className="competition-section" id="competition-data">
        <div className="competition-section-heading">
          <Database size={20} />
          <div>
            <span className="eyebrow">THE DATA</span>
            <h2>{challenge.datasets.length ? "Available workspace files" : "No dataset required"}</h2>
          </div>
        </div>

        {challenge.datasets.length ? (
          <div className="competition-dataset-stack">
            {challenge.datasets.map((dataset) => (
              <article className="competition-dataset-card" key={dataset.name}>
                <div className="competition-dataset-title">
                  <div>
                    <code>{dataset.name}</code>
                    <strong>{dataset.description}</strong>
                  </div>
                  <a
                    href={import.meta.env.BASE_URL + dataset.path}
                    download
                    className="text-button"
                  >
                    Open CSV
                  </a>
                </div>
                <p>{dataset.rows} rows</p>
                <div className="competition-data-table" role="table" aria-label={dataset.name + " variables"}>
                  <div className="competition-data-row head" role="row">
                    <strong role="columnheader">Variable</strong>
                    <strong role="columnheader">Description</strong>
                  </div>
                  {dataset.columns.map((column) => (
                    <div className="competition-data-row" role="row" key={column.name}>
                      <code role="cell">{column.name}</code>
                      <span role="cell">{column.description}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">This competition is based on architecture and evidence rather than a supplied dataset.</p>
        )}
      </section>

      {challenge.notebook && (
        <section className="competition-section competition-notebook" id="competition-notebook">
          <div className="competition-section-heading">
            <Code2 size={20} />
            <div>
              <span className="eyebrow">NOTEBOOK</span>
              <h2>Build and run your solution</h2>
            </div>
          </div>
          <p className="competition-notebook-goal">{challenge.notebook.goal}</p>

          <div className="competition-cell-toolbar">
            <button type="button" onClick={() => scrollTo("competition-data")}><Database size={15} /> Explore data</button>
            <span><Code2 size={15} /> Python cell</span>
            <button type="button" onClick={() => scrollTo("competition-submit")}><FileText size={15} /> Add evidence</button>
            <span><BarChart3 size={15} /> Output follows code</span>
          </div>

          <div className="competition-code-cell">
            <div className="competition-code-cell-head">
              <span>Python · saved automatically</span>
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
              <strong>{runPassed ? "Checks passed" : py.error ? "Execution needs attention" : py.status}</strong>
              {py.busy && <button type="button" onClick={() => py.stop()}>Stop</button>}
            </div>
            <pre aria-label="Competition Python output">{py.error || py.output}</pre>
          </div>
        </section>
      )}

      <section className="competition-section" id="competition-submit">
        <div className="competition-section-heading">
          <Trophy size={20} />
          <div>
            <span className="eyebrow">SUBMISSION</span>
            <h2>Publish evidence, not just an answer.</h2>
          </div>
        </div>

        <div className="competition-deliverable">
          <strong>Deliverable</strong>
          <p>{challenge.deliverable}</p>
        </div>

        <div className="arena-rubric-list">
          {challenge.rubric.map((item) => {
            const checked = Boolean(evidence[item.label]);
            return (
              <button
                type="button"
                className={checked ? "checked" : ""}
                onClick={() => setEvidence((current) => ({ ...current, [item.label]: !checked }))}
                key={item.label}
              >
                {checked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.evidence}</span>
                </div>
                <b>{item.points} pts</b>
              </button>
            );
          })}
        </div>

        <label className="arena-evidence-notes">
          <span>Evidence notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="What did you build, test, measure, learn, and what would you improve next?"
          />
        </label>

        <div className="competition-submit-readiness">
          <div>
            <span>Checklist</span>
            <strong>{checklist.length}/{challenge.checklist.length}</strong>
          </div>
          <div>
            <span>Notebook</span>
            <strong>{challenge.notebook ? (runPassed ? "Passed" : "Not passed") : "N/A"}</strong>
          </div>
          <div>
            <span>Rubric score</span>
            <strong>{score}/100</strong>
          </div>
          <div>
            <span>Personal best</span>
            <strong>{saved?.best ?? 0}%</strong>
          </div>
        </div>

        <div className="competition-publish-bar">
          <div>
            <strong>{publishReady ? "Submission is ready." : "Complete the checklist before publishing."}</strong>
            <span>
              {challenge.notebook && !runPassed
                ? "Run the notebook until its hidden behavior checks pass."
                : !allChecklist
                  ? "Confirm every publishing requirement."
                  : !notes.trim()
                    ? "Add evidence notes."
                    : "Ready to save this scored attempt."}
            </span>
          </div>
          <button className="primary" type="button" onClick={publish} disabled={!publishReady}>
            <Save size={16} /> Publish attempt
          </button>
        </div>
      </section>

      {challenge.launch && (
        <Link className="competition-supporting-lab" to={challenge.launch}>
          Need to rebuild the concept first? Open the supporting Lab <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
