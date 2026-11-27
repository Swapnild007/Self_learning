import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { findChapter } from "../content/catalog";
import { grade, useStore } from "../store";
import CodeEditor from "../components/CodeEditor";
import { usePython } from "../usePython";
import { Progress } from "../components/ui";
export default function Practice() {
  const [params] = useSearchParams();
  const entry = findChapter(params.get("chapter") || "python-functions");
  return entry ? (
    <AssessmentView
      key={entry.chapter.id}
      assessment={entry.chapter.assessment}
      chapterId={entry.chapter.id}
    />
  ) : (
    <div className="page">
      <h1>Assessment not found</h1>
      <Link to="/catalog">Browse courses</Link>
    </div>
  );
}
import type { Assessment } from "../content/schema";
function AssessmentView({
  assessment,
  chapterId,
}: {
  assessment: Assessment;
  chapterId: string;
}) {
  const scoreKey = `${assessment.id}-v${assessment.version}`;
  const { data, update } = useStore();
  const [choices, setChoices] = useState<Record<string, number[]>>({});
  const [short, setShort] = useState("");
  const codeQuestion = assessment.questions.find((q) => q.kind === "code");
  const [source, setSource] = useState(
    codeQuestion?.kind === "code" ? codeQuestion.starter : "",
  );
  const [hints, setHints] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, boolean> | null>(null);
  const py = usePython();
  async function submit() {
    const answer: Record<string, boolean> = {};
    for (const q of assessment.questions) {
      if (q.kind === "code") answer[q.id] = await py.run(source, q.tests);
      else if (q.kind === "short")
        answer[q.id] = q.accepted.includes(short.trim().toLowerCase());
      else answer[q.id] = grade(choices[q.id] || [], q.answer);
    }
    setResults(answer);
    const score = Math.round(
      (Object.values(answer).filter(Boolean).length /
        assessment.questions.length) *
        100,
    );
    update((d) => ({
      ...d,
      scores: {
        ...d.scores,
        [`${assessment.id}-v${assessment.version}`]: score,
      },
    }));
  }
  const score = results
    ? Math.round(
        (Object.values(results).filter(Boolean).length /
          assessment.questions.length) *
          100,
      )
    : data.scores[scoreKey];
  return (
    <div className="page practice-page">
      <div className="eyebrow">PUT UNDERSTANDING INTO PRACTICE</div>
      <h1>Small checks. Lasting knowledge.</h1>
      <p className="lead">
        Four questions, including a real Python challenge. Retry as often as you
        need.
      </p>
      <div className="assessment-summary panel">
        <div>
          <strong>{assessment.title}</strong>
          <p>
            {score === undefined
              ? "No attempt yet"
              : `Latest score: ${score}% · ${score === 100 ? "Mastered" : "Keep practicing"}`}
          </p>
        </div>
        <Progress value={score || 0} label="Assessment score" />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        {assessment.questions.map((q, index) => (
          <section className="panel question" key={q.id}>
            <span className="eyebrow">
              QUESTION {index + 1} ·{" "}
              {q.kind === "multiple"
                ? "SELECT ALL THAT APPLY"
                : q.kind.toUpperCase()}
            </span>
            <h2>{q.prompt}</h2>
            {(q.kind === "single" || q.kind === "multiple") && (
              <fieldset disabled={py.busy}>
                <legend className="sr-only">{q.prompt}</legend>
                {q.options.map((o, i) => (
                  <label className="answer-option" key={o}>
                    <input
                      type={q.kind === "single" ? "radio" : "checkbox"}
                      name={q.id}
                      checked={(choices[q.id] || []).includes(i)}
                      onChange={() => {
                        setResults(null);
                        setChoices((c) => ({
                          ...c,
                          [q.id]:
                            q.kind === "single"
                              ? [i]
                              : (c[q.id] || []).includes(i)
                                ? c[q.id].filter((x) => x !== i)
                                : [...(c[q.id] || []), i],
                        }));
                      }}
                    />
                    {o}
                  </label>
                ))}
              </fieldset>
            )}
            {q.kind === "short" && (
              <label>
                Keyword
                <input
                  className="short-answer"
                  value={short}
                  disabled={py.busy}
                  onChange={(e) => {
                    setResults(null);
                    setShort(e.target.value);
                  }}
                />
              </label>
            )}
            {q.kind === "code" && (
              <>
                <CodeEditor
                  value={source}
                  onChange={(s) => {
                    setResults(null);
                    setSource(s);
                  }}
                  label="Assessment Python source"
                  disabled={py.busy}
                />
                <p className="muted">
                  Checks include ordinary values, zero calls and a fractional
                  result.
                </p>
              </>
            )}
            <button
              type="button"
              className="text-button"
              aria-expanded={hints.includes(q.id)}
              onClick={() =>
                setHints((h) =>
                  h.includes(q.id) ? h.filter((x) => x !== q.id) : [...h, q.id],
                )
              }
            >
              {hints.includes(q.id) ? "Hide hint" : "Show hint"}
            </button>
            {hints.includes(q.id) && <p className="callout">{q.hint}</p>}
            {results && (
              <div
                className={`feedback ${results[q.id] ? "correct" : "incorrect"}`}
                role="status"
              >
                <strong>{results[q.id] ? "Correct" : "Not quite yet"}</strong>
                <p>
                  {q.kind === "code"
                    ? results[q.id]
                      ? "All behavior checks passed."
                      : py.error || py.status
                    : q.explanation}
                </p>
              </div>
            )}
          </section>
        ))}
        <div className="assessment-actions">
          <button className="primary" disabled={py.busy} type="submit">
            {py.busy ? "Checking with Python…" : "Check my understanding"}
          </button>
          {py.busy && (
            <button type="button" onClick={() => py.stop()}>
              Cancel execution
            </button>
          )}
          <button
            type="button"
            disabled={py.busy}
            onClick={() => {
              setResults(null);
              setChoices({});
              setShort("");
              setSource(
                codeQuestion?.kind === "code" ? codeQuestion.starter : "",
              );
              setHints([]);
              update((d) => {
                const scores = { ...d.scores };
                delete scores[scoreKey];
                return { ...d, scores };
              });
            }}
          >
            Reset attempt
          </button>
          <Link to={`/read/${chapterId}`}>Revisit the chapter</Link>
        </div>
        <p role="status">
          {py.busy
            ? py.status
            : results
              ? `Score: ${score}%. ${score === 100 ? "Assessment mastered." : "Review the feedback and try again."}`
              : ""}
        </p>
      </form>
    </div>
  );
}
