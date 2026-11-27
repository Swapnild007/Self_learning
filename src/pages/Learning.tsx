import { Link } from "react-router-dom";
import { BookOpen, Bookmark, NotebookPen } from "lucide-react";
import { chapterRegistry, courses } from "../content/catalog";
import { useStore } from "../store";
import CourseCard from "../components/CourseCard";
import { Progress } from "../components/ui";
export default function Learning() {
  const { data, update } = useStore();
  return (
    <div className="page">
      <div className="eyebrow">YOUR PERSONAL WORKSPACE</div>
      <h1>A place for everything you learn.</h1>
      <p className="lead">Your progress, ideas and next steps, together.</p>
      <div className="section-heading">
        <h2>Enrolled courses</h2>
        <Link to="/catalog">Explore courses →</Link>
      </div>
      <div className="course-grid">
        {courses
          .filter((c) => data.enrolled.includes(c.id))
          .map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
      </div>
      <div className="bottom-grid">
        <section className="panel">
          <BookOpen />
          <h2>Chapter progress</h2>
          {chapterRegistry
            .filter((x) => data.enrolled.includes(x.course.id))
            .map(({ chapter }) => (
              <div key={chapter.id} className="learning-chapter">
                <Link to={`/read/${chapter.id}`}>{chapter.title}</Link>
                <p>
                  {data.read[chapter.id]?.length || 0} of{" "}
                  {chapter.sections.length} sections read
                </p>
                <Progress
                  value={Math.round(
                    ((data.read[chapter.id]?.length || 0) /
                      chapter.sections.length) *
                      100,
                  )}
                  label={`${chapter.title} reading progress`}
                />
                <p>
                  Assessment:{" "}
                  {data.scores[
                    `${chapter.assessment.id}-v${chapter.assessment.version}`
                  ] === undefined
                    ? "not attempted"
                    : `${data.scores[`${chapter.assessment.id}-v${chapter.assessment.version}`]}%`}
                </p>
                <Link to={`/practice?chapter=${chapter.id}`}>
                  Practice for mastery →
                </Link>
              </div>
            ))}
        </section>
        <section className="panel">
          <Bookmark />
          <h2>Bookmarks</h2>
          {data.bookmarks.length ? (
            chapterRegistry
              .filter((x) => data.bookmarks.includes(x.chapter.id))
              .map(({ chapter }) => (
                <p key={chapter.id}>
                  <Link to={`/read/${chapter.id}`}>{chapter.title} →</Link>
                </p>
              ))
          ) : (
            <p>Bookmark a chapter from its reading toolbar to find it here.</p>
          )}
          <h3>Recently studied</h3>
          {data.visited.length ? (
            data.visited.map((id) => {
              const entry = chapterRegistry.find((x) => x.chapter.id === id);
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
      </div>
      <section className="panel">
        <NotebookPen />
        <h2>Personal notes</h2>
        {chapterRegistry.map(({ chapter }) => (
          <label key={chapter.id} className="notes-label">
            {chapter.title}
            <textarea
              aria-label="Saved chapter notes"
              placeholder="Start an idea here, or add notes while reading…"
              value={data.notes[chapter.id] || ""}
              onChange={(e) =>
                update((d) => ({
                  ...d,
                  notes: { ...d.notes, [chapter.id]: e.target.value },
                }))
              }
            />
          </label>
        ))}
        <p role="status" className="muted">
          Saved automatically on this device.
        </p>
      </section>
    </div>
  );
}
