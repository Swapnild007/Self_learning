import { useParams, Link } from "react-router-dom";
import { ArrowRight, Check, Clock3, BookOpen } from "lucide-react";
import { courses } from "../content/catalog";
import { useStore } from "../store";
import { Progress } from "../components/ui";
export default function Overview() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);
  const { data, update } = useStore();
  if (!course)
    return (
      <div className="page">
        <h1>Course not found</h1>
        <Link to="/catalog">Browse courses</Link>
      </div>
    );
  const ch = course.modules[0]?.chapters[0];
  const progress = ch
    ? Math.round(((data.read[ch.id]?.length || 0) / ch.sections.length) * 100)
    : 0;
  return (
    <div className="page">
      <Link to="/catalog" className="back-link">
        ← All courses
      </Link>
      <div className="overview-grid">
        <div>
          <div className="eyebrow">
            {course.category} / {course.level}
          </div>
          <h1>{course.title}</h1>
          <p className="lead">{course.description}</p>
          <div className="tags">
            {course.skills.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <p className="muted">{course.editor}</p>
          <div className="section-heading">
            <h2>What you’ll learn</h2>
          </div>
          <ul className="objectives">
            {course.outcomes.map((x) => (
              <li key={x}>
                <Check size={18} />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <aside className="panel enrollment">
          <div className={`course-art ${course.color}`}>
            <span className="course-symbol">{course.symbol}</span>
          </div>
          <span className="pill">{course.status}</span>
          {ch ? (
            <>
              <p>
                <Clock3 size={17} /> {course.minutes} minutes · 1 substantial
                sample chapter
              </p>
              <Progress value={progress} label="Course reading progress" />
              <p>{progress}% read · Assessment required for mastery</p>
              <Link
                className="button primary"
                to={`/read/${ch.id}`}
                onClick={() =>
                  update((d) => ({
                    ...d,
                    enrolled: Array.from(new Set([...d.enrolled, course.id])),
                  }))
                }
              >
                {progress ? "Resume learning" : "Begin sample chapter"}{" "}
                <ArrowRight size={17} />
              </Link>
            </>
          ) : (
            <p>
              Curriculum is in preparation. Enrollment opens when real chapters
              are available.
            </p>
          )}
        </aside>
      </div>
      <div className="bottom-grid">
        <section className="panel">
          <h2>Before you begin</h2>
          {course.prerequisites.length ? (
            <ul>
              {course.prerequisites.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : (
            <p>Prerequisites will be published with the curriculum.</p>
          )}
        </section>
        <section className="panel">
          <h2>Editorial approach</h2>
          <p>
            Clear explanations, explicit assumptions and worked examples. The
            sample is original educational content; it is not a certification or
            accredited qualification.
          </p>
        </section>
      </div>
      <section className="syllabus panel">
        <div className="section-title">
          <h2>Course syllabus</h2>
          <BookOpen size={22} />
        </div>
        {course.modules.length ? (
          course.modules.map((m) => (
            <div key={m.id}>
              <h3>{m.title}</h3>
              {m.chapters.map((c) => (
                <Link className="syllabus-row" to={`/read/${c.id}`} key={c.id}>
                  <span>01</span>
                  <strong>{c.title}</strong>
                  <span>{c.minutes} min</span>
                  <ArrowRight size={18} />
                </Link>
              ))}
            </div>
          ))
        ) : (
          <p>No lessons published yet.</p>
        )}
      </section>
      {course.references.length > 0 && (
        <section className="panel">
          <h2>Course references</h2>
          <ul>
            {course.references.map((r) => (
              <li key={r.id}>
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
