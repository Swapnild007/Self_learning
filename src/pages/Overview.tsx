import { useState, type CSSProperties } from "react";
import { pythonSyllabus } from "../content/pythonSyllabus";
import { courseRoadmaps } from "../content/courseRoadmaps";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Clock3,
  BookOpen,
  Target,
  FlaskConical,
  Brain,
  Layers3,
} from "lucide-react";
import { courses } from "../content/catalog";
import { useStore } from "../store";
import { Progress } from "../components/ui";

type CourseTab = "overview" | "curriculum" | "resources";

export default function Overview() {
  const { id } = useParams();
  const course = courses.find((candidate) => candidate.id === id);
  const { data, update } = useStore();

  if (!course) {
    return (
      <div className="page">
        <h1>Course not found</h1>
        <Link to="/catalog">Browse courses</Link>
      </div>
    );
  }

  const chapters = course.modules.flatMap((module) => module.chapters);
  const firstChapter = chapters[0];
  const [tab, setTab] = useState<CourseTab>(firstChapter ? "overview" : "curriculum");

  const readSections = chapters.reduce(
    (sum, item) => sum + (data.read[item.id]?.length || 0),
    0,
  );
  const totalSections = chapters.reduce(
    (sum, item) => sum + item.sections.length,
    0,
  );
  const progress = totalSections
    ? Math.round((readSections / totalSections) * 100)
    : 0;

  const confidenceValues = chapters.flatMap((item) =>
    item.sections
      .map((section) => data.confidence[`${item.id}:${section.id}`])
      .filter((value): value is number => typeof value === "number"),
  );
  const confidenceAverage = confidenceValues.length
    ? confidenceValues.reduce((sum, value) => sum + value, 0) /
      confidenceValues.length
    : 0;
  const confidenceText =
    confidenceAverage >= 2.6
      ? "Can explain"
      : confidenceAverage >= 1.6
        ? "Getting there"
        : confidenceAverage > 0
          ? "Needs review"
          : "Not checked";

  const mastered = chapters.filter(
    (item) =>
      data.scores[
        `${item.assessment.id}-v${item.assessment.version}`
      ] === 100,
  ).length;
  const roadmap = courseRoadmaps[course.id] || [];

  return (
    <div className="page sorted-course-page">
      <Link to="/catalog" className="back-link">← Knowledge library</Link>

      <section className="sorted-course-hero">
        <div className="sorted-course-main">
          <div className={`sorted-course-hero-icon ${course.color}`}>
            {course.symbol}
          </div>
          <div>
            <div className="sorted-course-meta">
              <span>{course.category}</span>
              <span>{course.level}</span>
              <span>{firstChapter ? "Lessons available" : "Curriculum blueprint"}</span>
            </div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="tags">
              {course.skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
            {firstChapter && (
              <div className="sorted-course-actions">
                <Link
                  className="button primary"
                  to={`/read/${firstChapter.id}`}
                  onClick={() =>
                    update((current) => ({
                      ...current,
                      enrolled: Array.from(new Set([...current.enrolled, course.id])),
                    }))
                  }
                >
                  {progress ? "Resume learning" : "Start learning"}
                  <ArrowRight size={17} />
                </Link>
                <Link className="button" to={`/practice?chapter=${firstChapter.id}`}>
                  <Target size={16} /> Practice
                </Link>
              </div>
            )}
          </div>
        </div>

        <aside className="sorted-course-snapshot">
          <div
            className="sorted-course-ring"
            style={{ "--course-progress": `${progress * 3.6}deg` } as CSSProperties}
          >
            <div><strong>{progress}%</strong><span>read</span></div>
          </div>
          <dl>
            <div><dt>Chapters</dt><dd>{chapters.length}</dd></div>
            <div><dt>Confidence</dt><dd>{confidenceText}</dd></div>
            <div><dt>Mastered</dt><dd>{mastered}/{chapters.length}</dd></div>
            <div><dt>Time</dt><dd>{course.minutes || "—"} min</dd></div>
          </dl>
        </aside>
      </section>

      <div className="sorted-course-tabs" role="tablist" aria-label="Course sections">
        <button
          role="tab"
          aria-selected={tab === "overview"}
          className={tab === "overview" ? "selected" : ""}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>
        <button
          role="tab"
          aria-selected={tab === "curriculum"}
          className={tab === "curriculum" ? "selected" : ""}
          onClick={() => setTab("curriculum")}
        >
          Curriculum
        </button>
        <button
          role="tab"
          aria-selected={tab === "resources"}
          className={tab === "resources" ? "selected" : ""}
          onClick={() => setTab("resources")}
        >
          Resources
        </button>
      </div>

      <section className="sorted-course-panel" role="tabpanel">
        {tab === "overview" && (
          <div className="sorted-course-overview">
            <section>
              <span className="eyebrow">WHAT YOU WILL BE ABLE TO DO</span>
              <h2>Learning outcomes</h2>
              <div className="sorted-outcomes">
                {course.outcomes.map((outcome, index) => (
                  <div key={outcome}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside>
              <span className="eyebrow">BEFORE YOU BEGIN</span>
              <h2>Prerequisites</h2>
              {course.prerequisites.length ? (
                <ul>
                  {course.prerequisites.map((item) => (
                    <li key={item}><Check size={15} /> {item}</li>
                  ))}
                </ul>
              ) : (
                <p>No formal prerequisites are listed.</p>
              )}

              {firstChapter && (
                <div className="sorted-course-progress-box">
                  <BookOpen size={18} />
                  <div>
                    <strong>Your course progress</strong>
                    <span>{progress}% of published sections read</span>
                  </div>
                  <Progress value={progress} label="Course reading progress" />
                </div>
              )}
            </aside>
          </div>
        )}

        {tab === "curriculum" && (
          <div className="sorted-curriculum">
            <div className="sorted-panel-heading">
              <div>
                <span className="eyebrow">COURSE MAP</span>
                <h2>Course syllabus</h2>
                <p>Published lessons and future curriculum remain clearly separated.</p>
              </div>
              <Layers3 size={22} />
            </div>

            {course.id === "python" ? (
              pythonSyllabus.map((level) => (
                <details className="sorted-module" key={level.id} open={level.chapters.some((item) => chapters.some((chapter) => chapter.title === item.title))}>
                  <summary>
                    <strong>{level.title}</strong>
                    <span>{level.chapters.length} chapters</span>
                  </summary>
                  <div>
                    {level.chapters.map((item) => {
                      const published = chapters.find((candidate) => candidate.title === item.title);
                      return published ? (
                        <Link className="sorted-curriculum-row ready" to={`/read/${published.id}`} key={item.number}>
                          <span>{String(item.number).padStart(2, "0")}</span>
                          <strong>{item.title}</strong>
                          <small>{published.minutes} min</small>
                          <b>Ready</b>
                          <ArrowRight size={16} />
                        </Link>
                      ) : (
                        <div className="sorted-curriculum-row" key={item.number}>
                          <span>{String(item.number).padStart(2, "0")}</span>
                          <strong>{item.title}</strong>
                          <small>Planned</small>
                          <b>Blueprint</b>
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))
            ) : course.modules.length ? (
              course.modules.map((module) => (
                <details className="sorted-module" open key={module.id}>
                  <summary>
                    <strong>{module.title}</strong>
                    <span>{module.chapters.length} chapters</span>
                  </summary>
                  <div>
                    {module.chapters.map((item, index) => (
                      <Link className="sorted-curriculum-row ready" to={`/read/${item.id}`} key={item.id}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{item.title}</strong>
                        <small>{item.minutes} min</small>
                        <b>Ready</b>
                        <ArrowRight size={16} />
                      </Link>
                    ))}
                  </div>
                </details>
              ))
            ) : null}

            {course.id !== "python" && roadmap.length > 0 && (
              <div className="planned-curriculum">
                <h3>{course.modules.length ? "Next modules" : "Planned learning modules"}</h3>
                {roadmap.map((module, index) => (
                  <details className="planned-module sorted-module" key={module.title}>
                    <summary>
                      <strong>{String(index + 1).padStart(2, "0")} · {module.title}</strong>
                      <span>In development</span>
                    </summary>
                    <ul>{module.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
                  </details>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "resources" && (
          <div className="sorted-resources">
            <section>
              <span className="eyebrow">LEARNING TOOLS</span>
              <h2>Use the right mode for the task</h2>
              <div className="sorted-resource-links">
                <Link to="/visuals"><FlaskConical /><div><strong>Visual studio</strong><span>Change variables and inspect relationships.</span></div><ArrowRight size={16} /></Link>
                <Link to="/lab"><BookOpen /><div><strong>Code lab</strong><span>Run and modify browser-based Python.</span></div><ArrowRight size={16} /></Link>
                <Link to="/living-lab"><Brain /><div><strong>Explain-back lab</strong><span>Test whether you can explain the concept simply.</span></div><ArrowRight size={16} /></Link>
              </div>
            </section>

            <aside>
              <span className="eyebrow">REFERENCES</span>
              <h2>Source trail</h2>
              {course.references.length ? (
                <ul>
                  {course.references.map((reference) => (
                    <li key={reference.id}>
                      <a href={reference.url} target="_blank" rel="noreferrer">
                        {reference.title} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No external references are attached to this course yet.</p>
              )}
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
