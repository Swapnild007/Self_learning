import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Circle, Code2, ListChecks, RotateCcw } from "lucide-react";
import { findChapter } from "../content/catalog";
import { grade, useStore } from "../store";
import CodeEditor from "../components/CodeEditor";
import { usePython } from "../usePython";
import { Progress } from "../components/ui";
import type { Assessment } from "../content/schema";

export default function Practice() {
  const [params] = useSearchParams();
  const entry = findChapter(params.get("chapter") || "python-functions");
  return entry ? (
    <AssessmentView
      key={entry.chapter.id}
      assessment={entry.chapter.assessment}
      chapterId={entry.chapter.id}
      chapterTitle={entry.chapter.title}
    />
  ) : (
    <div className="page">
      <h1>Assessment not found</h1>
      <Link to="/catalog">Browse courses</Link>
    </div>
  );
}

function AssessmentView({
  assessment,
  chapterId,
  chapterTitle,
}: {
  assessment: Assessment;
  chapterId: string;
  chapterTitle: string;
}) {
  const scoreKey = `${assessment.id}-v${assessment.version}`;
  const { data, update } = useStore();
  const [choices, setChoices] = useState<Record<string, number[]>>({});
  const [short, setShort] = useState("");
  const codeQuestion = assessment.questions.find((question) => question.kind === "code");
  const [source, setSource] = useState(
    codeQuestion?.kind === "code" ? codeQuestion.starter : "",
  );
  const [hints, setHints] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, boolean> | null>(null);
  const py = usePython();

  const answered = useMemo(
    () =>
      assessment.questions.filter((question) => {
        if (question.kind === "code") return source.trim() !== question.starter.trim();
        if (question.kind === "short") return short.trim().length > 0;
        return (choices[question.id] || []).length > 0;
      }).length,
    [assessment.questions, choices, short, source],
  );

  async function submit() {
    const answer: Record<string, boolean> = {};
    for (const question of assessment.questions) {
      if (question.kind === "code") answer[question.id] = await py.run(source, question.tests);
      else if (question.kind === "short")
        answer[question.id] = question.accepted.includes(short.trim().toLowerCase());
      else answer[question.id] = grade(choices[question.id] || [], question.answer);
    }
    setResults(answer);
    const nextScore = Math.round(
      (Object.values(answer).filter(Boolean).length /
        assessment.questions.length) *
        100,
    );
    update((current) => ({
      ...current,
      scores: { ...current.scores, [scoreKey]: nextScore },
    }));
  }

  const score = results
    ? Math.round(
        (Object.values(results).filter(Boolean).length /
          assessment.questions.length) *
          100,
      )
    : data.scores[scoreKey];

  function scrollToQuestion(id: string) {
    document.getElementById(`question-${id}`)?.scrollIntoView({
      behavior: data.reduced ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div className="page sorted-practice">
      <header className="sorted-practice-header">
        <div>
          <span className="eyebrow">PRACTICE · {chapterTitle}</span>
          <h1>{assessment.title}</h1>
          <p>Answer everything at your pace, use hints only when needed, then check the full attempt once.</p>
        </div>
        <div className="sorted-practice-score">
          <strong>{score === undefined ? "—" : `${score}%`}</strong>
          <span>{score === 100 ? "Mastered" : score === undefined ? "No attempt yet" : "Latest score"}</span>
        </div>
      </header>

      <div className="sorted-practice-progress">
        <div>
          <span>{answered} of {assessment.questions.length} answered</span>
          <span>{score === undefined ? "Not submitted" : `Latest score: ${score}% · ${score === 100 ? "Mastered" : "Keep practicing"}`}</span>
        </div>
        <Progress
          value={Math.round((answered / Math.max(1, assessment.questions.length)) * 100)}
          label="Questions answered"
        />
      </div>

      <div className="sorted-practice-layout">
        <aside className="sorted-question-nav" aria-label="Question navigator">
          <span className="eyebrow">QUESTIONS</span>
          {assessment.questions.map((question, index) => {
            const hasAnswer =
              question.kind === "code"
                ? source.trim() !== question.starter.trim()
                : question.kind === "short"
                  ? short.trim().length > 0
                  : (choices[question.id] || []).length > 0;
            return (
              <button key={question.id} type="button" onClick={() => scrollToQuestion(question.id)}>
                {hasAnswer ? <Check size={15} /> : <Circle size={15} />}
                <span>Question {index + 1}</span>
                {results && <b className={results[question.id] ? "correct" : "incorrect"}>{results[question.id] ? "✓" : "×"}</b>}
              </button>
            );
          })}
          <Link to={`/read/${chapterId}`}>Revisit chapter →</Link>
        </aside>

        <form
          className="sorted-question-stack"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          {assessment.questions.map((question, index) => (
            <section className="sorted-question" id={`question-${question.id}`} key={question.id}>
              <div className="sorted-question-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>
                    {question.kind === "multiple"
                      ? "SELECT ALL THAT APPLY"
                      : question.kind === "code"
                        ? "RUNNABLE CODE"
                        : question.kind.toUpperCase()}
                  </small>
                  <h2>{question.prompt}</h2>
                </div>
                {question.kind === "code" && <Code2 size={20} />}
                {question.kind !== "code" && <ListChecks size={20} />}
              </div>

              {(question.kind === "single" || question.kind === "multiple") && (
                <fieldset disabled={py.busy}>
                  <legend className="sr-only">{question.prompt}</legend>
                  <div className="sorted-answer-list">
                    {question.options.map((option, optionIndex) => (
                      <label className="answer-option" key={option}>
                        <input
                          type={question.kind === "single" ? "radio" : "checkbox"}
                          name={question.id}
                          checked={(choices[question.id] || []).includes(optionIndex)}
                          onChange={() => {
                            setResults(null);
                            setChoices((current) => ({
                              ...current,
                              [question.id]:
                                question.kind === "single"
                                  ? [optionIndex]
                                  : (current[question.id] || []).includes(optionIndex)
                                    ? current[question.id].filter((item) => item !== optionIndex)
                                    : [...(current[question.id] || []), optionIndex],
                            }));
                          }}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {question.kind === "short" && (
                <label className="sorted-short-answer">
                  <span>Keyword</span>
                  <input
                    aria-label="Keyword"
                    className="short-answer"
                    value={short}
                    disabled={py.busy}
                    onChange={(event) => {
                      setResults(null);
                      setShort(event.target.value);
                    }}
                  />
                </label>
              )}

              {question.kind === "code" && (
                <>
                  <CodeEditor
                    value={source}
                    onChange={(nextSource) => {
                      setResults(null);
                      setSource(nextSource);
                    }}
                    label="Assessment Python source"
                    disabled={py.busy}
                  />
                  <p className="muted">
                    The code is checked against this chapter's expected behavior in your browser.
                  </p>
                </>
              )}

              <div className="sorted-question-tools">
                <button
                  type="button"
                  className="text-button"
                  aria-expanded={hints.includes(question.id)}
                  onClick={() =>
                    setHints((current) =>
                      current.includes(question.id)
                        ? current.filter((item) => item !== question.id)
                        : [...current, question.id],
                    )
                  }
                >
                  {hints.includes(question.id) ? "Hide hint" : "Show hint"}
                </button>
              </div>

              {hints.includes(question.id) && <p className="callout">{question.hint}</p>}

              {results && (
                <div
                  className={`feedback ${results[question.id] ? "correct" : "incorrect"}`}
                  role="status"
                >
                  <strong>{results[question.id] ? "Correct" : "Not quite yet"}</strong>
                  <p>
                    {question.kind === "code"
                      ? results[question.id]
                        ? "All behavior checks passed."
                        : py.error || py.status
                      : question.explanation}
                  </p>
                </div>
              )}
            </section>
          ))}

          <div className="sorted-submit-bar">
            <div>
              <strong>Ready to check the full attempt?</strong>
              <span>{answered}/{assessment.questions.length} questions currently answered</span>
            </div>
            <button className="primary" disabled={py.busy} type="submit">
              {py.busy ? "Checking with Python…" : "Check my understanding"}
            </button>
            {py.busy && <button type="button" onClick={() => py.stop()}>Cancel execution</button>}
            <button
              type="button"
              disabled={py.busy}
              onClick={() => {
                setResults(null);
                setChoices({});
                setShort("");
                setSource(codeQuestion?.kind === "code" ? codeQuestion.starter : "");
                setHints([]);
                update((current) => {
                  const scores = { ...current.scores };
                  delete scores[scoreKey];
                  return { ...current, scores };
                });
              }}
            >
              <RotateCcw size={15} /> Reset attempt
            </button>
          </div>

          <p role="status" className="sorted-score-status">
            {py.busy
              ? py.status
              : results
                ? `Score: ${score}%. ${score === 100 ? "Assessment mastered." : "Review the feedback and try again."}`
                : ""}
          </p>
        </form>
      </div>
    </div>
  );
}
