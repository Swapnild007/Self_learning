import type { CSSProperties } from "react";
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
  Code2,
  Layers3,
  Brain,
} from "lucide-react";
import { courses } from "../content/catalog";
import { useStore } from "../store";
import { Progress } from "../components/ui";

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
    <div className="page ng-course-page">
      <Link to="/catalog" className="back-link">
        ← Knowledge library
      </Link>

      <section className="ng-course-hero">
        <div className="ng-course-identity">
          <div className={`ng-course-symbol ${course.color}`}>
            <span>{course.symbol}</span>
          </div>

          <div>
            <div className="ng-course-kicker">
              <span>{course.category}</span>
              <span>•</span>
              <span>{course.level}</span>
              <span>•</span>
              <span>{chapters.length ? "Authored learning available" : "Curriculum blueprint"}</span>
            </div>
            <h1>{course.title}</h1>
            <p className="lead">{course.description}</p>

            <div className="tags ng-course-tags">
              {course.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            {firstChapter ? (
              <div className="ng-course-actions">
                <Link
                  className="button primary"
                  to={`/read/${firstChapter.id}`}
                  onClick={() =>
                    update((current) => ({
                      ...current,
                      enrolled: Array.from(
                        new Set([...current.enrolled, course.id]),
                      ),
                    }))
                  }
                >
                  {progress ? "Resume learning" : "Start learning"}{" "}
                  <ArrowRight size={17} />
                </Link>
                <Link className="button" to={`/practice?chapter=${firstChapter.id}`}>
                  <Target size={16} />
                  Practice
                </Link>
                <Link className="button" to="/visuals">
                  <FlaskConical size={16} />
                  Visual studio
                </Link>
              </div>
            ) : (
              <div className="ng-blueprint-note">
                <Layers3 size={18} />
                <span>
                  The curriculum is mapped, but lessons and assessments are not
                  published yet. Nothing here is counted as completed learning.
                </span>
              </div>
            )}
          </div>
        </div>

        <aside className="ng-course-status">
          <span className="eyebrow">COURSE SIGNALS</span>

          <div className="ng-course-progress-ring">
            <div
              style={{ "--course-progress": `${progress * 3.6}deg` } as CSSProperties}
            >
              <strong>{progress}%</strong>
              <span>read</span>
            </div>
          </div>

          <div className="ng-course-signal-list">
            <div>
              <BookOpen size={16} />
              <span>
                <strong>{chapters.length}</strong>
                authored chapters
              </span>
            </div>
            <div>
              <Brain size={16} />
              <span>
                <strong>{confidenceText}</strong>
                self-confidence
              </span>
            </div>
            <div>
              <Target size={16} />
              <span>
                <strong>{mastered}/{chapters.length}</strong>
                assessments mastered
              </span>
            </div>
            <div>
              <Clock3 size={16} />
              <span>
                <strong>{course.minutes || "—"}</strong>
                {course.minutes ? "estimated minutes" : "minutes once authored"}
              </span>
            </div>
          </div>

          {firstChapter && (
            <>
              <Progress value={progress} label="Course reading progress" />
              <small>
                Reading, self-confidence, and assessment mastery are tracked separately.
              </small>
            </>
          )}
        </aside>
      </section>

      <section className="ng-course-contract">
        <div className="ng-card-heading">
          <div>
            <span className="eyebrow">LEARNING CONTRACT</span>
            <h2>What this course should enable you to do</h2>
            <p>
              Outcomes are capabilities, not marketing claims. You should be able to
              demonstrate them through explanations, exercises, and projects.
            </p>
          </div>
          <Check size={22} />
        </div>

        <div className="ng-outcome-grid">
          {course.outcomes.map((outcome, index) => (
            <article key={outcome}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="ng-course-learning-loop">
        <div>
          <BookOpen />
          <strong>Understand</strong>
          <span>Read the mental model and worked examples.</span>
        </div>
        <div>
          <Brain />
          <strong>Recall</strong>
          <span>Explain the idea without looking and record confidence.</span>
        </div>
        <div>
          <FlaskConical />
          <strong>Experiment</strong>
          <span>Change variables and observe what the model predicts.</span>
        </div>
        <div>
          <Code2 />
          <strong>Apply</strong>
          <span>Use the browser lab where the topic supports runnable code.</span>
        </div>
        <div>
          <Target />
          <strong>Prove</strong>
          <span>Assessment evidence is what counts toward mastery.</span>
        </div>
      </div>

      <div className="ng-course-foundation-grid">
        <section className="panel">
          <span className="eyebrow">BEFORE YOU BEGIN</span>
          <h2>Prerequisite knowledge</h2>
          {course.prerequisites.length ? (
            <ul className="ng-prereq-list">
              {course.prerequisites.map((prerequisite) => (
                <li key={prerequisite}>
                  <Check size={15} />
                  {prerequisite}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No formal prerequisites are listed. Start with the first available
              chapter or inspect the curriculum map before deciding where to begin.
            </p>
          )}
        </section>

        <section className="panel">
          <span className="eyebrow">ACADEMIC INTEGRITY</span>
          <h2>How content is treated</h2>
          <p>
            Published chapters contain original explanations, explicit assumptions,
            worked examples, and assessments. Planned syllabus topics remain visibly
            separate and are never counted as completed learning or certification.
          </p>
          <p className="muted">{course.editor}</p>
        </section>
      </div>

      <section className="syllabus panel ng-course-map">
        <div className="section-title">
          <div>
            <span className="eyebrow">CURRICULUM MAP</span>
            <h2>Course syllabus</h2>
          </div>
          <BookOpen size={22} />
        </div>

        {course.id === "python" ? (
          <>
            <p className="muted">
              32-chapter roadmap across six levels. Published chapters are
              interactive and assessable; planned chapters remain roadmap items.
            </p>
            {pythonSyllabus.map((level) => (
              <div className="ng-course-level" key={level.id}>
                <h3>{level.title}</h3>
                <div className="ng-course-level-list">
                  {level.chapters.map((item) => {
                    const published = chapters.find(
                      (candidate) => candidate.title === item.title,
                    );
                    return published ? (
                      <Link
                        className="syllabus-row ng-ready-row"
                        to={`/read/${published.id}`}
                        key={item.number}
                      >
                        <span>{String(item.number).padStart(2, "0")}</span>
                        <strong>{item.title}</strong>
                        <span>{published.minutes} min</span>
                        <span className="ng-ready-chip">Ready</span>
                        <ArrowRight size={18} />
                      </Link>
                    ) : (
                      <div
                        className="syllabus-row"
                        key={item.number}
                        aria-label={`${item.title}, planned`}
                      >
                        <span>{String(item.number).padStart(2, "0")}</span>
                        <strong>{item.title}</strong>
                        <span>Planned</span>
                        <span className="ng-planned-chip">Blueprint</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        ) : course.modules.length ? (
          course.modules.map((module) => (
            <div className="ng-course-level" key={module.id}>
              <h3>{module.title}</h3>
              <div className="ng-course-level-list">
                {module.chapters.map((item) => (
                  <Link
                    className="syllabus-row ng-ready-row"
                    to={`/read/${item.id}`}
                    key={item.id}
                  >
                    <span>
                      {String(
                        chapters.findIndex((candidate) => candidate.id === item.id) + 1,
                      ).padStart(2, "0")}
                    </span>
                    <strong>{item.title}</strong>
                    <span>{item.minutes} min</span>
                    <span className="ng-ready-chip">Ready</span>
                    <ArrowRight size={18} />
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="muted">
            The syllabus below is a course blueprint. Written lessons, exercises,
            and assessments are not yet available.
          </p>
        )}

        {course.id !== "python" && roadmap.length > 0 && (
          <div className="planned-curriculum">
            <h3>
              {course.modules.length
                ? "Next chapters under development"
                : "Planned learning modules"}
            </h3>
            <p className="muted">
              These are curriculum topics, not published or assessed lessons. They
              will open only when the original teaching material is ready.
            </p>
            {roadmap.map((module, index) => (
              <div className="planned-module" key={module.title}>
                <div className="planned-module-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h4>{module.title}</h4>
                  <small>In development</small>
                </div>
                <ul>
                  {module.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {course.references.length > 0 && (
        <section className="panel ng-course-references">
          <span className="eyebrow">SOURCE TRAIL</span>
          <h2>Course references</h2>
          <p className="muted">
            References support deeper study and help distinguish teaching examples
            from external source material.
          </p>
          <ul>
            {course.references.map((reference) => (
              <li key={reference.id}>
                <a href={reference.url} target="_blank" rel="noreferrer">
                  {reference.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
