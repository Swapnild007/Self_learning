import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Target,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Route,
  RefreshCw,
  NotebookPen,
} from "lucide-react";
import { motion } from "motion/react";
import { courses, chapter, findChapter, chapterRegistry } from "../content/catalog";
import { learningPaths, resolvePath } from "../content/learningPaths";
import { useStore } from "../store";
import { Progress } from "../components/ui";

type HomeTab = "today" | "path" | "review";

export default function Dashboard() {
  const { data } = useStore();
  const [tab, setTab] = useState<HomeTab>("today");

  const recentEntry = data.visited
    .map((id) => findChapter(id))
    .find((entry) => entry !== undefined);

  const featured = recentEntry?.chapter || chapter;
  const featuredCourse = recentEntry?.course || courses.find((course) => course.id === "python")!;
  const read = data.read[featured.id]?.length || 0;
  const pct = Math.round((read / Math.max(1, featured.sections.length)) * 100);
  const assessmentKey = `${featured.assessment.id}-v${featured.assessment.version}`;
  const score = data.scores[assessmentKey];

  const currentPath =
    learningPaths.find((path) => path.courses.includes(featuredCourse.id)) ||
    learningPaths[0];
  const pathCourses = resolvePath(currentPath);

  const reviewQueue = useMemo(
    () =>
      chapterRegistry
        .map((entry) => ({
          ...entry,
          score:
            data.scores[
              `${entry.chapter.assessment.id}-v${entry.chapter.assessment.version}`
            ],
        }))
        .filter((entry) => entry.score !== undefined && entry.score < 100),
    [data.scores],
  );

  const masteryLabel =
    score === 100
      ? "Mastered"
      : score !== undefined
        ? `${score}% assessment`
        : pct === 100
          ? "Ready to practice"
          : `${pct}% read`;

  return (
    <div className="page sorted-home">
      <header className="sorted-home-header">
        <div>
          <span className="eyebrow">YOUR LEARNING SPACE</span>
          <h1>Focus on one useful next step<span className="blue-dot">.</span></h1>
          <p>
            Continue learning, follow your path, or review a weak spot. Everything
            else stays out of the way until you need it.
          </p>
        </div>
        <Link className="button" to="/catalog">
          Explore library <ArrowRight size={16} />
        </Link>
      </header>

      <motion.section
        className="sorted-focus"
        initial={{ opacity: 1, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="sorted-focus-copy">
          <div className="sorted-focus-meta">
            <span>{featuredCourse.title}</span>
            <span>{masteryLabel}</span>
          </div>
          <h2>{featured.title}</h2>
          <p>{featured.introduction}</p>

          <div className="sorted-focus-actions">
            <Link className="button primary" to={`/read/${featured.id}`}>
              <Play size={16} fill="currentColor" />
              {read ? "Resume chapter" : "Start chapter"}
            </Link>
            <Link className="button" to={`/practice?chapter=${featured.id}`}>
              <Target size={16} />
              Practice
            </Link>
          </div>
        </div>

        <div className="sorted-focus-progress">
          <strong>{pct}%</strong>
          <span>reading progress</span>
          <Progress value={pct} label="Current chapter progress" />
          <small>{read} of {featured.sections.length} sections read</small>
        </div>
      </motion.section>

      <section className="sorted-switcher">
        <div className="sorted-tabs" role="tablist" aria-label="Home learning views">
          <button
            role="tab"
            aria-selected={tab === "today"}
            className={tab === "today" ? "selected" : ""}
            onClick={() => setTab("today")}
          >
            Today
          </button>
          <button
            role="tab"
            aria-selected={tab === "path"}
            className={tab === "path" ? "selected" : ""}
            onClick={() => setTab("path")}
          >
            My path
          </button>
          <button
            role="tab"
            aria-selected={tab === "review"}
            className={tab === "review" ? "selected" : ""}
            onClick={() => setTab("review")}
          >
            Review {reviewQueue.length ? `(${reviewQueue.length})` : ""}
          </button>
        </div>

        <div className="sorted-tab-panel" role="tabpanel">
          {tab === "today" && (
            <div className="sorted-today-grid">
              <Link to={`/lab?chapter=${featured.id}`} className="sorted-action-card">
                <FlaskConical />
                <div>
                  <strong>Open Lab</strong>
                  <span>Visualize, explain, or code in one interactive workspace.</span>
                </div>
                <ArrowRight size={17} />
              </Link>

              <Link to={`/practice?chapter=${featured.id}`} className="sorted-action-card">
                <Target />
                <div>
                  <strong>Practice</strong>
                  <span>Check understanding against the current chapter.</span>
                </div>
                <ArrowRight size={17} />
              </Link>

              <Link to="/learning" className="sorted-action-card">
                <NotebookPen />
                <div>
                  <strong>Review progress</strong>
                  <span>See notes, confidence, and mastery evidence together.</span>
                </div>
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

          {tab === "path" && (
            <div className="sorted-path-view">
              <div className="sorted-panel-heading">
                <div>
                  <span className="eyebrow">{currentPath.focus}</span>
                  <h2>{currentPath.title}</h2>
                  <p>{currentPath.description}</p>
                </div>
                <Route size={22} />
              </div>
              <div className="sorted-path-list">
                {pathCourses.map((course, index) => {
                  const ready = course.modules.some((module) => module.chapters.length > 0);
                  return (
                    <Link to={`/course/${course.id}`} key={course.id}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <strong>{course.title}</strong>
                        <small>{ready ? "Lessons available" : "Curriculum mapped"}</small>
                      </div>
                      <ArrowRight size={16} />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "review" && (
            <div className="sorted-review-view">
              {reviewQueue.length ? (
                reviewQueue.map(({ chapter: item, course, score }) => (
                  <Link
                    className="sorted-review-row"
                    key={item.id}
                    to={`/practice?chapter=${item.id}`}
                  >
                    <RefreshCw size={17} />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{course.title}</span>
                    </div>
                    <b>{score}%</b>
                    <ArrowRight size={16} />
                  </Link>
                ))
              ) : (
                <div className="sorted-empty-state">
                  <CheckCircle2 size={28} />
                  <strong>No unfinished assessment attempts.</strong>
                  <p>Your review queue appears only when an assessment needs another pass.</p>
                  <Link to={`/practice?chapter=${featured.id}`}>Try the current assessment →</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
