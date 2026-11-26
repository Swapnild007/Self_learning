import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Bookmark,
  NotebookPen,
  Brain,
  Target,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { chapterRegistry, courses } from "../content/catalog";
import { useStore } from "../store";
import { Progress } from "../components/ui";

type LearningTab = "progress" | "saved" | "notes";

function confidenceLabel(value: number) {
  if (value >= 2.6) return "Can explain";
  if (value >= 1.6) return "Getting there";
  return value > 0 ? "Needs review" : "No check-ins";
}

export default function Learning() {
  const { data, update } = useStore();
  const [tab, setTab] = useState<LearningTab>("progress");
  const mastered = Object.values(data.scores).filter((score) => score === 100).length;
  const noteCount = Object.values(data.notes).filter((note) => note.trim()).length;
  const enrolledCourses = courses.filter((course) => data.enrolled.includes(course.id));
  const enrolledChapters = chapterRegistry.filter((entry) =>
    data.enrolled.includes(entry.course.id),
  );

  return (
    <div className="page sorted-learning">
      <header className="sorted-learning-header">
        <div>
          <span className="eyebrow">MY LEARNING</span>
          <h1>Your progress, without the clutter<span className="blue-dot">.</span></h1>
          <p>
            Reading, confidence, assessment results, saved chapters, and notes stay
            separate so each signal is easy to understand.
          </p>
        </div>
        <div className="sorted-learning-metrics">
          <div><BookOpen /><strong>{data.visited.length}</strong><span>explored</span></div>
          <div><Brain /><strong>{Object.keys(data.confidence).length}</strong><span>check-ins</span></div>
          <div><CheckCircle2 /><strong>{mastered}</strong><span>mastered</span></div>
          <div><NotebookPen /><strong>{noteCount}</strong><span>notes</span></div>
        </div>
      </header>

      <div className="sorted-course-tabs" role="tablist" aria-label="My learning views">
        <button
          role="tab"
          aria-selected={tab === "progress"}
          className={tab === "progress" ? "selected" : ""}
          onClick={() => setTab("progress")}
        >
          Progress
        </button>
        <button
          role="tab"
          aria-selected={tab === "saved"}
          className={tab === "saved" ? "selected" : ""}
          onClick={() => setTab("saved")}
        >
          Saved {data.bookmarks.length ? `(${data.bookmarks.length})` : ""}
        </button>
        <button
          role="tab"
          aria-selected={tab === "notes"}
          className={tab === "notes" ? "selected" : ""}
          onClick={() => setTab("notes")}
        >
          Notes {noteCount ? `(${noteCount})` : ""}
        </button>
      </div>

      <section className="sorted-learning-panel" role="tabpanel">
        {tab === "progress" && (
          <>
            <div className="sorted-panel-heading">
              <div>
                <span className="eyebrow">LEARNING EVIDENCE</span>
                <h2>Chapter-by-chapter progress</h2>
                <p>Reading, confidence, and assessment evidence remain independent.</p>
              </div>
              <Target size={22} />
            </div>

            <div className="sorted-evidence-table">
              {enrolledChapters.map(({ chapter, course }) => {
                const sectionCount = chapter.sections.length;
                const readCount = data.read[chapter.id]?.length || 0;
                const readPct = Math.round((readCount / Math.max(1, sectionCount)) * 100);
                const confidenceValues = chapter.sections
                  .map((section) => data.confidence[`${chapter.id}:${section.id}`])
                  .filter((value): value is number => typeof value === "number");
                const confidenceAverage = confidenceValues.length
                  ? confidenceValues.reduce((sum, value) => sum + value, 0) /
                    confidenceValues.length
                  : 0;
                const score =
                  data.scores[
                    `${chapter.assessment.id}-v${chapter.assessment.version}`
                  ];

                return (
                  <article key={chapter.id} className="sorted-evidence-row">
                    <div>
                      <span>{course.title}</span>
                      <Link to={`/read/${chapter.id}`}>{chapter.title}</Link>
                    </div>
                    <div>
                      <small>Reading</small>
                      <strong>{readPct}%</strong>
                      <Progress value={readPct} label={`${chapter.title} reading progress`} />
                    </div>
                    <div>
                      <small>Confidence</small>
                      <strong>{confidenceLabel(confidenceAverage)}</strong>
                      <span>{confidenceValues.length}/{sectionCount} sections checked</span>
                    </div>
                    <div>
                      <small>Assessment</small>
                      <strong>
                        {score === undefined
                          ? "Not attempted"
                          : score === 100
                            ? "Mastered"
                            : `${score}%`}
                      </strong>
                      <Link to={`/practice?chapter=${chapter.id}`}>
                        {score === 100 ? "Retake" : "Practice"} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}

              {!enrolledChapters.length && (
                <div className="sorted-empty-state">
                  <BookOpen size={28} />
                  <strong>No learning activity yet.</strong>
                  <p>Start a published chapter and your evidence will appear here.</p>
                  <Link to="/catalog">Explore the library →</Link>
                </div>
              )}
            </div>

            {enrolledCourses.length > 0 && (
              <div className="sorted-active-courses">
                <span className="eyebrow">ACTIVE COURSES</span>
                <div>
                  {enrolledCourses.map((course) => (
                    <Link to={`/course/${course.id}`} key={course.id}>
                      <span>{course.symbol}</span>
                      <strong>{course.title}</strong>
                      <ArrowRight size={15} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === "saved" && (
          <div className="sorted-saved-view">
            <div className="sorted-panel-heading">
              <div>
                <span className="eyebrow">SAVED FOR RETURN</span>
                <h2>Bookmarks and recent learning</h2>
                <p>Use this view only when you want to pick something back up.</p>
              </div>
              <Bookmark size={22} />
            </div>

            <div className="sorted-saved-grid">
              <section>
                <h3>Bookmarks</h3>
                {data.bookmarks.length ? (
                  chapterRegistry
                    .filter((entry) => data.bookmarks.includes(entry.chapter.id))
                    .map(({ chapter, course }) => (
                      <Link className="sorted-saved-row" to={`/read/${chapter.id}`} key={chapter.id}>
                        <div>
                          <span>{course.title}</span>
                          <strong>{chapter.title}</strong>
                        </div>
                        <ArrowRight size={16} />
                      </Link>
                    ))
                ) : (
                  <p className="muted">No bookmarks yet.</p>
                )}
              </section>

              <section>
                <h3>Recently studied</h3>
                {data.visited.length ? (
                  data.visited.map((id) => {
                    const entry = chapterRegistry.find((item) => item.chapter.id === id);
                    return (
                      entry && (
                        <Link className="sorted-saved-row" to={`/read/${id}`} key={id}>
                          <div>
                            <span>{entry.course.title}</span>
                            <strong>{entry.chapter.title}</strong>
                          </div>
                          <ArrowRight size={16} />
                        </Link>
                      )
                    );
                  })
                ) : (
                  <p className="muted">No recent chapters yet.</p>
                )}
              </section>
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className="sorted-notes-view">
            <div className="sorted-panel-heading">
              <div>
                <span className="eyebrow">PERSONAL NOTES</span>
                <h2>Explain it in your own words</h2>
                <p>Notes save automatically on this device.</p>
              </div>
              <NotebookPen size={22} />
            </div>

            <div className="sorted-notes-list">
              {chapterRegistry.map(({ chapter, course }) => (
                <details
                  className="sorted-note-item"
                  key={chapter.id}
                  open={Boolean(data.notes[chapter.id]?.trim())}
                >
                  <summary>
                    <div>
                      <span>{course.title}</span>
                      <strong>{chapter.title}</strong>
                    </div>
                    <small>{data.notes[chapter.id]?.trim() ? "Has notes" : "Empty"}</small>
                  </summary>
                  <label className="notes-label">
                    <span className="sr-only">Notes for {chapter.title}</span>
                    <textarea
                      aria-label={`Notes for ${chapter.title}`}
                      placeholder="Explain the idea, capture a question, or connect it to something you already know…"
                      value={data.notes[chapter.id] || ""}
                      onChange={(event) =>
                        update((current) => ({
                          ...current,
                          notes: {
                            ...current.notes,
                            [chapter.id]: event.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                </details>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
