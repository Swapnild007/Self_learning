import { Link } from "react-router-dom";
import { BookOpen, Bookmark, NotebookPen, Brain, Target, CheckCircle2 } from "lucide-react";
import { chapterRegistry, courses } from "../content/catalog";
import { useStore } from "../store";
import CourseCard from "../components/CourseCard";
import { Progress } from "../components/ui";

function confidenceLabel(value: number) {
  if (value >= 2.6) return "Can explain";
  if (value >= 1.6) return "Getting there";
  return value > 0 ? "Needs review" : "No check-ins";
}

export default function Learning() {
  const { data, update } = useStore();
  const mastered = Object.values(data.scores).filter((score) => score === 100).length;
  const notes = Object.values(data.notes).filter((note) => note.trim()).length;

  return (
    <div className="page ng-learning-page">
      <header className="ng-learning-header">
        <div>
          <span className="eyebrow">MY LEARNING RECORD</span>
          <h1>Evidence of what you understand<span className="blue-dot">.</span></h1>
          <p className="lead">
            Reading, confidence, notes, and assessment results stay separate so
            progress never pretends to be mastery.
          </p>
        </div>
        <div className="ng-learning-summary" aria-label="Learning summary">
          <div><BookOpen /><strong>{data.visited.length}</strong><span>chapters explored</span></div>
          <div><Brain /><strong>{Object.keys(data.confidence).length}</strong><span>confidence check-ins</span></div>
          <div><CheckCircle2 /><strong>{mastered}</strong><span>assessments mastered</span></div>
          <div><NotebookPen /><strong>{notes}</strong><span>chapters with notes</span></div>
        </div>
      </header>

      <div className="section-heading">
        <div>
          <h2>Your active courses</h2>
          <p>Courses appear here after you start learning.</p>
        </div>
        <Link to="/catalog">Explore library →</Link>
      </div>

      <div className="course-grid">
        {courses
          .filter((course) => data.enrolled.includes(course.id))
          .map((course) => <CourseCard key={course.id} course={course} />)}
      </div>

      <section className="ng-learning-evidence">
        <div className="ng-card-heading">
          <div>
            <span className="eyebrow">LEARNING EVIDENCE</span>
            <h2>Chapter-by-chapter understanding</h2>
            <p>Reading progress, self-confidence, and assessment evidence are shown independently.</p>
          </div>
          <Target size={22} />
        </div>

        <div className="ng-evidence-list">
          {chapterRegistry
            .filter((entry) => data.enrolled.includes(entry.course.id))
            .map(({ chapter, course }) => {
              const sectionCount = chapter.sections.length;
              const readCount = data.read[chapter.id]?.length || 0;
              const readPct = Math.round((readCount / Math.max(1, sectionCount)) * 100);
              const confidenceValues = chapter.sections
                .map((section) => data.confidence[`${chapter.id}:${section.id}`])
                .filter((value): value is number => typeof value === "number");
              const confidenceAverage = confidenceValues.length
                ? confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length
                : 0;
              const score =
                data.scores[`${chapter.assessment.id}-v${chapter.assessment.version}`];

              return (
                <article className="ng-evidence-row" key={chapter.id}>
                  <div className="ng-evidence-title">
                    <span>{course.title}</span>
                    <Link to={`/read/${chapter.id}`}>{chapter.title}</Link>
                  </div>

                  <div className="ng-evidence-signal">
                    <span>Reading</span>
                    <strong>{readPct}%</strong>
                    <Progress value={readPct} label={`${chapter.title} reading progress`} />
                  </div>

                  <div className="ng-evidence-signal">
                    <span>Self-confidence</span>
                    <strong>{confidenceLabel(confidenceAverage)}</strong>
                    <small>{confidenceValues.length}/{sectionCount} sections checked</small>
                  </div>

                  <div className="ng-evidence-signal">
                    <span>Assessment</span>
                    <strong>{score === undefined ? "Not attempted" : score === 100 ? "Mastered" : `${score}%`}</strong>
                    <Link to={`/practice?chapter=${chapter.id}`}>
                      {score === 100 ? "Retake" : "Practice"} →
                    </Link>
                  </div>
                </article>
              );
            })}
        </div>
      </section>

      <div className="ng-two-column ng-learning-secondary">
        <section className="panel">
          <Bookmark />
          <h2>Saved for return</h2>
          {data.bookmarks.length ? (
            chapterRegistry
              .filter((entry) => data.bookmarks.includes(entry.chapter.id))
              .map(({ chapter }) => (
                <p key={chapter.id}>
                  <Link to={`/read/${chapter.id}`}>{chapter.title} →</Link>
                </p>
              ))
          ) : (
            <p>Bookmark a chapter from its reading toolbar to build a personal return list.</p>
          )}

          <h3>Recently studied</h3>
          {data.visited.length ? (
            data.visited.map((id) => {
              const entry = chapterRegistry.find((item) => item.chapter.id === id);
              return (
                entry && (
                  <p key={id}>
                    <Link to={`/read/${id}`}>{entry.chapter.title} →</Link>
                  </p>
                )
              );
            })
          ) : (
            <p>No chapters opened yet.</p>
          )}
        </section>

        <section className="panel ng-notes-panel">
          <NotebookPen />
          <h2>Personal notes</h2>
          <p className="muted">
            Notes are for your own explanations, questions, and connections—not copied lesson text.
          </p>
          {chapterRegistry.map(({ chapter }) => (
            <label key={chapter.id} className="notes-label">
              {chapter.title}
              <textarea
                aria-label={`Notes for ${chapter.title}`}
                placeholder="Explain it in your own words, capture a question, or connect it to something you already know…"
                value={data.notes[chapter.id] || ""}
                onChange={(event) =>
                  update((current) => ({
                    ...current,
                    notes: { ...current.notes, [chapter.id]: event.target.value },
                  }))
                }
              />
            </label>
          ))}
          <p role="status" className="muted">Saved automatically on this device.</p>
        </section>
      </div>
    </div>
  );
}
