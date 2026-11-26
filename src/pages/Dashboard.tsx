import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Target,
  BookOpen,
  Bookmark,
  CheckCircle2,
  FlaskConical,
  Code2,
  Route,
  RefreshCw,
  Clock3,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "motion/react";
import {
  courses,
  chapter,
  findChapter,
  chapterRegistry,
} from "../content/catalog";
import {
  learningPaths,
  publishedCoursesInPath,
  resolvePath,
} from "../content/learningPaths";
import { useStore } from "../store";
import { Progress } from "../components/ui";

export default function Dashboard() {
  const { data } = useStore();

  const recentEntry = data.visited
    .map((id) => findChapter(id))
    .find((entry) => entry !== undefined);

  const featured = recentEntry?.chapter || chapter;
  const featuredCourse = recentEntry?.course || courses.find((course) => course.id === "python")!;
  const read = data.read[featured.id]?.length || 0;
  const pct = Math.round((read / Math.max(1, featured.sections.length)) * 100);
  const assessmentKey = `${featured.assessment.id}-v${featured.assessment.version}`;
  const assessmentScore = data.scores[assessmentKey];

  const mastered = Object.values(data.scores).filter((score) => score === 100).length;
  const authoredCourses = courses.filter((course) =>
    course.modules.some((module) => module.chapters.length > 0),
  ).length;
  const noteCount = Object.values(data.notes).filter((note) => note.trim().length > 0).length;

  const reviewQueue = chapterRegistry
    .map((entry) => ({
      ...entry,
      score:
        data.scores[
          `${entry.chapter.assessment.id}-v${entry.chapter.assessment.version}`
        ],
    }))
    .filter((entry) => entry.score !== undefined && entry.score < 100)
    .slice(0, 3);

  const recommendedPath =
    learningPaths.find((path) => path.courses.includes(featuredCourse.id)) ||
    learningPaths[0];
  const pathCourses = resolvePath(recommendedPath);

  const masteryLabel =
    assessmentScore === 100
      ? "Mastered"
      : assessmentScore !== undefined
        ? `${assessmentScore}% assessment`
        : pct === 100
          ? "Ready to practice"
          : `${pct}% read`;

  return (
    <div className="page nextgen-home">
      <section className="ng-welcome">
        <div>
          <span className="eyebrow">YOUR LEARNING COCKPIT</span>
          <h1>
            Learn by doing, not by scrolling<span className="blue-dot">.</span>
          </h1>
          <p>
            Continue one real concept, test your understanding, change the variables,
            and build something with it.
          </p>
        </div>
        <div className="ng-trust-strip" aria-label="Learning model">
          <span><CheckCircle2 size={16} /> Real progress only</span>
          <span><Target size={16} /> Mastery over completion</span>
          <span><BookOpen size={16} /> Local-first workspace</span>
        </div>
      </section>

      <div className="ng-hero-grid">
        <motion.section
          className="ng-focus-card"
          initial={{ opacity: 1, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="ng-focus-copy">
            <div className="ng-focus-topline">
              <span className="eyebrow">CONTINUE WHERE YOUR BRAIN LEFT OFF</span>
              <span className="ng-state-pill">{masteryLabel}</span>
            </div>
            <span className="ng-course-name">{featuredCourse.title}</span>
            <h2>{featured.title}</h2>
            <p>{featured.introduction}</p>

            <div className="ng-focus-actions">
              <Link className="button primary" to={`/read/${featured.id}`}>
                <Play size={16} fill="currentColor" />
                {read ? "Resume learning" : "Start chapter"}
                <ArrowRight size={17} />
              </Link>
              <Link className="button ng-secondary-button" to={`/practice?chapter=${featured.id}`}>
                <Target size={16} />
                Test understanding
              </Link>
            </div>

            <div className="ng-progress-line">
              <Progress value={pct} label="Current chapter reading progress" />
              <div>
                <strong>{pct}%</strong>
                <span>{featured.minutes} min · {featured.sections.length} active sections</span>
              </div>
            </div>
          </div>

          <div className="ng-focus-visual" aria-hidden="true">
            <div
              className="ng-progress-orb"
              style={{ "--progress": `${pct * 3.6}deg` } as React.CSSProperties}
            >
              <div>
                <strong>{pct}%</strong>
                <span>chapter</span>
              </div>
            </div>
            <div className="ng-orbit-label one">read</div>
            <div className="ng-orbit-label two">explain</div>
            <div className="ng-orbit-label three">practice</div>
          </div>
        </motion.section>

        <aside className="ng-mastery-card">
          <div className="ng-card-heading">
            <div>
              <span className="eyebrow">MASTERY PULSE</span>
              <h2>What is actually sticking?</h2>
            </div>
            <Target size={22} />
          </div>

          <div className="ng-mastery-number">
            <strong>{mastered}</strong>
            <span>assessments mastered</span>
          </div>

          <div className="ng-signal-grid">
            <div>
              <strong>{authoredCourses}</strong>
              <span>courses with real lessons</span>
            </div>
            <div>
              <strong>{data.visited.length}</strong>
              <span>chapters explored</span>
            </div>
            <div>
              <strong>{noteCount}</strong>
              <span>chapters with notes</span>
            </div>
            <div>
              <strong>{data.bookmarks.length}</strong>
              <span>saved for return</span>
            </div>
          </div>

          <Link className="ng-inline-link" to="/learning">
            Open learning record <ArrowUpRight size={15} />
          </Link>
        </aside>
      </div>

      <section className="ng-learning-loop" aria-labelledby="learning-loop-title">
        <div className="ng-section-intro">
          <div>
            <span className="eyebrow">ACTIVE LEARNING LOOP</span>
            <h2 id="learning-loop-title">One concept. Five ways to make it yours.</h2>
          </div>
          <p>
            Reading is only the first pass. The workspace deliberately moves you
            from recognition to recall, experimentation, application, and proof.
          </p>
        </div>

        <div className="ng-mode-grid">
          <Link to={`/read/${featured.id}`} className="ng-mode-card">
            <span className="ng-mode-index">01</span>
            <BookOpen />
            <strong>Understand</strong>
            <p>Build the mental model with examples, diagrams, and explicit assumptions.</p>
            <span>Open chapter <ArrowRight size={15} /></span>
          </Link>

          <Link to="/visuals" className="ng-mode-card">
            <span className="ng-mode-index">02</span>
            <FlaskConical />
            <strong>Experiment</strong>
            <p>Change variables and watch the concept react instead of memorising a static chart.</p>
            <span>Open visual studio <ArrowRight size={15} /></span>
          </Link>

          <Link to="/living-lab" className="ng-mode-card">
            <span className="ng-mode-index">03</span>
            <Lightbulb />
            <strong>Explain back</strong>
            <p>Put the idea into your own words and expose weak understanding early.</p>
            <span>Open explain-back lab <ArrowRight size={15} /></span>
          </Link>

          <Link to="/lab" className="ng-mode-card">
            <span className="ng-mode-index">04</span>
            <Code2 />
            <strong>Build</strong>
            <p>Move from reading code to changing it, breaking it, and observing real output.</p>
            <span>Open code lab <ArrowRight size={15} /></span>
          </Link>

          <Link to={`/practice?chapter=${featured.id}`} className="ng-mode-card">
            <span className="ng-mode-index">05</span>
            <CheckCircle2 />
            <strong>Prove it</strong>
            <p>Use independent questions and runnable checks to turn confidence into evidence.</p>
            <span>Take assessment <ArrowRight size={15} /></span>
          </Link>
        </div>
      </section>

      <div className="ng-two-column">
        <section className="ng-path-panel">
          <div className="ng-card-heading">
            <div>
              <span className="eyebrow">YOUR NEXT HORIZON</span>
              <h2>{recommendedPath.title}</h2>
              <p>{recommendedPath.description}</p>
            </div>
            <Route size={24} />
          </div>

          <div className="ng-path-rail" aria-label="Recommended learning sequence">
            {pathCourses.map((course, index) => {
              const available = course.modules.some((module) => module.chapters.length > 0);
              return (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className={`ng-path-node ${available ? "is-ready" : ""}`}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{course.title}</strong>
                    <small>{available ? "Lessons available" : "Curriculum mapped"}</small>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              );
            })}
          </div>

          <div className="ng-path-footer">
            <span>
              {publishedCoursesInPath(recommendedPath)} of {recommendedPath.courses.length} courses have authored lessons
            </span>
            <Link to={`/paths/${recommendedPath.id}`}>
              View full path <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section className="ng-review-panel">
          <div className="ng-card-heading">
            <div>
              <span className="eyebrow">REVIEW QUEUE</span>
              <h2>Strengthen weak spots.</h2>
            </div>
            <RefreshCw size={22} />
          </div>

          {reviewQueue.length ? (
            <div className="ng-review-list">
              {reviewQueue.map(({ chapter: item, course, score }) => (
                <Link
                  key={item.id}
                  to={`/practice?chapter=${item.id}`}
                  className="ng-review-item"
                >
                  <div>
                    <span>{course.title}</span>
                    <strong>{item.title}</strong>
                  </div>
                  <b>{score}%</b>
                </Link>
              ))}
            </div>
          ) : (
            <div className="ng-review-empty">
              <CheckCircle2 size={28} />
              <strong>No unfinished assessment attempts.</strong>
              <p>
                Your review queue will appear when an assessment has been attempted
                but not yet mastered.
              </p>
              <Link to={`/practice?chapter=${featured.id}`}>
                Try the current assessment <ArrowRight size={15} />
              </Link>
            </div>
          )}

          <div className="ng-review-meta">
            <Clock3 size={15} />
            <span>Review signals come from your real assessment results—not a fabricated streak score.</span>
          </div>
        </section>
      </div>

      <section className="ng-explore-strip">
        <div>
          <span className="eyebrow">EXPLORE WITHOUT LOSING DIRECTION</span>
          <h2>36 subjects mapped. Only authored learning is marked ready.</h2>
          <p>
            Browse the full curriculum without pretending unfinished course outlines
            are completed lessons.
          </p>
        </div>
        <div className="ng-explore-actions">
          <Link className="button primary" to="/catalog">
            Explore knowledge library <ArrowRight size={16} />
          </Link>
          <Link className="button" to="/paths">
            Browse guided paths
          </Link>
        </div>
      </section>
    </div>
  );
}
