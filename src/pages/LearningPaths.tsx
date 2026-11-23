import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, Check, Compass, Search, Layers3, Route, Clock3 } from "lucide-react";
import { learningPaths, resolvePath, publishedCoursesInPath } from "../content/learningPaths";
import { useStore } from "../store";
import type { Course } from "../content/schema";

const authoredChapters = (course: Course) => course.modules.flatMap((module) => module.chapters);

export default function LearningPaths() {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const { data } = useStore();
  const chosen = learningPaths.find((path) => path.id === id);
  if (id && !chosen) {
    return <div className="page"><h1>Learning path not found</h1><Link to="/paths">Browse learning paths</Link></div>;
  }
  if (chosen) {
    const steps = resolvePath(chosen);
    const available = publishedCoursesInPath(chosen);
    return (
      <div className="page">
        <Link className="back-link" to="/paths">← All learning paths</Link>
        <header className="path-hero">
          <span className="eyebrow">GUIDED LEARNING JOURNEY · {chosen.focus}</span>
          <h1>{chosen.title}<span className="blue-dot">.</span></h1>
          <p className="lead">{chosen.description}</p>
          <div className="path-meta"><span><Layers3 size={17} /> {steps.length} courses in sequence</span><span><BookOpen size={17} /> {available} with authored chapters</span></div>
          <div className="path-outcome"><strong>What you will work toward</strong><p>{chosen.outcome}</p></div>
        </header>
        <section className="path-timeline" aria-label="Recommended course order">
          <div className="section-heading"><h2>Your course sequence</h2><p>Study at your pace. Chapters open only when authored and reviewed.</p></div>
          {steps.map((course, index) => {
            const chapters = authoredChapters(course);
            const availableNow = chapters.length > 0;
            const sectionTotal = chapters.reduce((sum, item) => sum + item.sections.length, 0);
            const sectionsRead = chapters.reduce((sum, item) => sum + (data.read[item.id]?.length || 0), 0);
            const progress = sectionTotal ? Math.round(100 * sectionsRead / sectionTotal) : 0;
            return (
              <article className="path-step" key={course.id}>
                <div className="path-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
                <div className="path-step-main">
                  <div className="path-step-top"><span className="eyebrow">{course.category}</span><span className={availableNow ? "path-status is-live" : "path-status"}>{availableNow ? "Lessons available" : "Curriculum planned"}</span></div>
                  <h3><Link to={"/course/" + course.id}>{course.title}</Link></h3>
                  <p>{course.description}</p>
                  {availableNow ? <div className="path-step-foot"><span><BookOpen size={15} /> {chapters.length} chapters</span><span><Clock3 size={15} /> {course.minutes} min</span><span><Check size={15} /> {progress}% sections read</span></div> : <p className="path-planned-note">The module outline is available. Lessons and assessments are not yet published.</p>}
                  <Link className="path-step-link" to={"/course/" + course.id}>{availableNow ? "Study this course" : "Explore the curriculum"} <ArrowRight size={16} /></Link>
                </div>
              </article>
            );
          })}
        </section>
        <section className="panel path-integrity">
          <h2>How this learning path works</h2>
          <p>These are recommendations, not mandatory prerequisites. Courses with published chapters include interactive checks and the Python laboratory. Unpublished courses remain clearly marked. We do not count planned lessons as completed learning.</p>
          <Link to="/catalog">Explore the full library <ArrowRight size={16} /></Link>
        </section>
      </div>
    );
  }
  const filtered = learningPaths.filter((path) =>
    [path.title, path.description, path.focus, path.outcome].join(" ").toLowerCase().includes(search.trim().toLowerCase())
  );
  return (
    <div className="page">
      <header className="path-hero">
        <span className="eyebrow">LEARN IN THE RIGHT ORDER</span>
        <h1>Follow a question. Build a skill<span className="blue-dot">.</span></h1>
        <p className="lead">Not sure where to begin? Choose a direction, see the course sequence, and start with real chapters wherever they are ready.</p>
        <div className="path-meta"><span><Route size={17} /> {learningPaths.length} guided paths</span><span><BookOpen size={17} /> Practice-led learning</span><span><Compass size={17} /> No sign-in needed</span></div>
      </header>
      <label className="path-search"><Search size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a path in AI, coding, data, design..." aria-label="Search learning paths" /></label>
      <div className="path-card-grid">
        {filtered.map((path, index) => {
          const available = publishedCoursesInPath(path);
          return (
            <Link className="path-card" key={path.id} to={"/paths/" + path.id}>
              <div className="path-card-top"><span className="path-card-index">{String(learningPaths.indexOf(path) + 1).padStart(2, "0")}</span><span className="eyebrow">{path.focus}</span><ArrowRight size={19} /></div>
              <h2>{path.title}</h2>
              <p>{path.description}</p>
              <div className="path-mini-sequence" aria-label="Course sequence">
                {resolvePath(path).slice(0, 4).map((course) => <span key={course.id} title={course.title}>{course.symbol}</span>)}
                {path.courses.length > 4 && <span>+{path.courses.length - 4}</span>}
              </div>
              <div className="path-card-bottom"><span>{path.courses.length} courses</span><span>{available} ready to study</span></div>
            </Link>
          );
        })}
      </div>
      {!filtered.length && <div className="panel empty"><h2>No paths found</h2><p>Try a different skill or explore all courses.</p><button onClick={() => setSearch("")}>Show all paths</button></div>}
      <div className="path-disclaimer"><strong>Content availability:</strong> Each path includes future curriculum alongside courses with fully authored chapters. Only the latter can be read and assessed today.</div>
    </div>
  );
}
