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
  Layers3,
  Gauge,
  Brain,
  ShieldCheck,
} from "lucide-react";
import { courses } from "../content/catalog";
import { useStore } from "../store";
import {
  chapterEvidence,
  courseMastery,
  courseNextChapter,
  hasMission,
} from "../learningEngine";
import { Progress } from "../components/ui";

type CourseTab = "overview" | "curriculum" | "mastery" | "resources";

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
  const nextChapter = courseNextChapter(course, data);
  const nextEvidence = nextChapter ? chapterEvidence(nextChapter, data) : null;
  const mastery = courseMastery(course, data);
  const firstMission = chapters.find((item) => hasMission(item.id));
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

  const roadmap = courseRoadmaps[course.id] || [];

  function stateChip(item: typeof chapters[number]) {
    const evidence = chapterEvidence(item, data);
    return (
      <span className={`course-state-chip state-${evidence.state}`}>
        {evidence.label}
      </span>
    );
  }

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

            {nextChapter && nextEvidence && (
              <div className="course-next-action">
                <div>
                  <span className="eyebrow">NEXT BEST ACTION</span>
                  <strong>{nextChapter.title}</strong>
                  <p>{nextEvidence.action.reason}</p>
                </div>
                <Link
                  className="button primary"
                  to={nextEvidence.action.to}
                  onClick={() =>
                    update((current) => ({
                      ...current,
                      enrolled: Array.from(new Set([...current.enrolled, course.id])),
                    }))
                  }
                >
                  {nextEvidence.action.label}
                  <ArrowRight size={17} />
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
            <div><dt>Published</dt><dd>{chapters.length} chapters</dd></div>
            <div><dt>Confidence</dt><dd>{confidenceText}</dd></div>
            <div><dt>Mastered</dt><dd>{mastery.mastered}/{mastery.total}</dd></div>
            <div><dt>Review</dt><dd>{mastery.review}</dd></div>
          </dl>
        </aside>
      </section>

      <div className="sorted-course-tabs" role="tablist" aria-label="Course sections">
        {(["overview", "curriculum", "mastery", "resources"] as CourseTab[]).map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "selected" : ""}
            onClick={() => setTab(item)}
          >
            {item === "mastery" ? "Mastery" : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
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

        {tab === "mastery" && (
          <div className="course-mastery-view">
            <div className="sorted-panel-heading">
              <div>
                <span className="eyebrow">EVIDENCE-BASED MASTERY</span>
                <h2>What should happen next?</h2>
                <p>
                  Reading, confidence, experiments, and assessment evidence determine
                  the recommendation. Nothing is locked; the learner keeps control.
                </p>
              </div>
              <Gauge size={22} />
            </div>

            <div className="course-mastery-summary">
              <div><strong>{mastery.mastered}</strong><span>mastered</span></div>
              <div><strong>{mastery.review}</strong><span>needs review</span></div>
              <div><strong>{mastery.inProgress}</strong><span>in progress</span></div>
              <div><strong>{mastery.total}</strong><span>published chapters</span></div>
            </div>

            <div className="course-mastery-list">
              {chapters.map((item, index) => {
                const evidence = chapterEvidence(item, data);
                return (
                  <article key={item.id} className={`course-mastery-row state-${evidence.state}`}>
                    <span className="course-mastery-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="course-mastery-copy">
                      <div>
                        <strong>{item.title}</strong>
                        {stateChip(item)}
                      </div>
                      <p>{evidence.action.reason}</p>
                    </div>
                    <div className="course-mastery-evidence">
                      <span><BookOpen size={14} /> {evidence.readPct}% read</span>
                      <span><Brain size={14} /> {evidence.confidenceChecked}/{item.sections.length} checks</span>
                      <span><Target size={14} /> {evidence.score === undefined ? "No score" : `${evidence.score}%`}</span>
                      {evidence.hasLab && (
                        <span><FlaskConical size={14} /> {evidence.labBest === undefined ? "Lab not run" : `${evidence.labBest}% lab`}</span>
                      )}
                    </div>
                    <Link to={evidence.action.to}>
                      {evidence.action.label} <ArrowRight size={14} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {tab === "curriculum" && (
          <div className="sorted-curriculum">
            <div className="sorted-panel-heading">
              <div>
                <span className="eyebrow">COURSE MAP</span>
                <h2>Course syllabus</h2>
                <p>Published lessons show learner state; future curriculum stays separate.</p>
              </div>
              <Layers3 size={22} />
            </div>

            {course.id === "python" ? (
              pythonSyllabus.map((level) => (
                <details className="sorted-module" key={level.id} open={level.chapters.some((item) => chapters.some((published) => published.title === item.title))}>
                  <summary>
                    <strong>{level.title}</strong>
                    <span>{level.chapters.length} chapters</span>
                  </summary>
                  <div>
                    {level.chapters.map((item) => {
                      const published = chapters.find((candidate) => candidate.title === item.title);
                      return published ? (
                        <Link className="sorted-curriculum-row ready" to={chapterEvidence(published, data).action.to} key={item.number}>
                          <span>{String(item.number).padStart(2, "0")}</span>
                          <strong>{item.title}</strong>
                          <small>{published.minutes} min</small>
                          {stateChip(published)}
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
                    {module.chapters.map((item, index) => {
                      const evidence = chapterEvidence(item, data);
                      return (
                        <Link className="sorted-curriculum-row ready" to={evidence.action.to} key={item.id}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <strong>{item.title}</strong>
                          <small>{item.minutes} min</small>
                          {stateChip(item)}
                          <ArrowRight size={16} />
                        </Link>
                      );
                    })}
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
                {firstMission ? (
                  <Link to={`/lab?chapter=${firstMission.id}`}>
                    <FlaskConical />
                    <div>
                      <strong>Interactive Lab</strong>
                      <span>Predict, manipulate, execute, and inspect evidence.</span>
                    </div>
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <div className="course-resource-note">
                    <ShieldCheck size={18} />
                    <span>No dedicated experiment mission is published for this course yet.</span>
                  </div>
                )}
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
