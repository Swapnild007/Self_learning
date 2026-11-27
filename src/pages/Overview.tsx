import { pythonSyllabus } from "../content/pythonSyllabus";
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
  const chapters = course.modules.flatMap((m) => m.chapters);
  const ch = chapters[0];
  const readSections = chapters.reduce((sum, c) => sum + (data.read[c.id]?.length || 0), 0);
  const totalSections = chapters.reduce((sum, c) => sum + c.sections.length, 0);
  const progress = totalSections ? Math.round((readSections / totalSections) * 100) : 0;
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
                <Clock3 size={17} /> {course.minutes} estimated minutes · {chapters.length} chapters
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
                {progress ? "Resume learning" : "Start learning"}{" "}
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
            <p>No prior programming experience required.</p>
          )}
        </section>
        <section className="panel">
          <h2>Editorial approach</h2>
          <p>
            Clear explanations, explicit assumptions and worked examples. This course uses original educational content, practical examples and assessments. It is not an accredited certification.
          </p>
        </section>
      </div>
      <section className="syllabus panel">
        <div className="section-title">
          <h2>Course syllabus</h2>
          <BookOpen size={22} />
        </div>
        {course.id === "python" ? (
          <>
            <p className="muted">32-chapter roadmap across six levels. Draft chapters are readable; planned chapters are not yet published or counted as completed learning.</p>
            {pythonSyllabus.map((level) => (
              <div key={level.id}>
                <h3>{level.title}</h3>
                {level.chapters.map((item) => {
                  const published = chapters.find((c) => c.title === item.title);
                  return published ? (
                    <Link className="syllabus-row" to={`/read/${published.id}`} key={item.number}>
                      <span>{String(item.number).padStart(2, "0")}</span>
                      <strong>{item.title}</strong>
                      <span>{published.minutes} min</span>
                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    <div className="syllabus-row" key={item.number} aria-label={`${item.title}, planned`}>
                      <span>{String(item.number).padStart(2, "0")}</span>
                      <strong>{item.title}</strong>
                      <span>Planned</span>
                      <span aria-hidden="true">·</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </>
        ) : course.modules.length ? (
          course.modules.map((m) => (
            <div key={m.id}>
              <h3>{m.title}</h3>
              {m.chapters.map((c, index) => (
                <Link className="syllabus-row" to={`/read/${c.id}`} key={c.id}>
                  <span>{String(chapters.findIndex((x) => x.id === c.id) + 1).padStart(2, "0")}</span>
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
