import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Compass,
  FlaskConical,
  Medal,
  NotebookPen,
  Play,
  Route,
  Settings2,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { courses, chapter, findChapter, chapterRegistry } from "../content/catalog";
import { learningPaths, resolvePath } from "../content/learningPaths";
import { useStore } from "../store";
import { Progress } from "../components/ui";

function startOfDay(value: number | Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function dayKey(value: number | Date) {
  return new Date(value).toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { data } = useStore();

  const recentEntry = data.visited
    .map((id) => findChapter(id))
    .find((entry) => entry !== undefined);

  const featured = recentEntry?.chapter || chapter;
  const featuredCourse =
    recentEntry?.course || courses.find((course) => course.id === "python")!;

  const sectionsRead = data.read[featured.id]?.length || 0;
  const chapterProgress = Math.round(
    (sectionsRead / Math.max(1, featured.sections.length)) * 100,
  );
  const assessmentKey = `${featured.assessment.id}-v${featured.assessment.version}`;
  const chapterScore = data.scores[assessmentKey];

  const preferredPath =
    learningPaths.find((path) => path.id === data.personal.activePath) ||
    learningPaths[0];
  const pathCourses = resolvePath(preferredPath);

  const now = Date.now();
  const todayStart = startOfDay(now);
  const todayActivity = data.activity.filter((item) => item.at >= todayStart);
  const todayTypes = new Set(todayActivity.map((item) => item.type));

  const daySeries = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const key = dayKey(date);
    const count = data.activity.filter((item) => dayKey(item.at) === key).length;
    return {
      key,
      count,
      label: date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2),
      full: date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    };
  });

  const activeDays = daySeries.filter((day) => day.count > 0).length;
  const weeklyGoal = data.personal.weeklyDays;
  const weeklyPct = Math.min(100, Math.round((activeDays / weeklyGoal) * 100));

  const reviewQueue = chapterRegistry
    .map((entry) => ({
      ...entry,
      score:
        data.scores[
          `${entry.chapter.assessment.id}-v${entry.chapter.assessment.version}`
        ],
    }))
    .filter((entry) => entry.score !== undefined && entry.score < 100)
    .sort((a, b) => (a.score || 0) - (b.score || 0));

  const masteredAssessments = Object.values(data.scores).filter(
    (score) => score === 100,
  ).length;
  const masteredLabs = Object.values(data.labEvidence).filter(
    (evidence) => evidence.best === 100,
  ).length;
  const strongConfidence = Object.values(data.confidence).filter(
    (value) => value === 3,
  ).length;

  const completedChapter = chapterRegistry.some(
    ({ chapter: item }) =>
      (data.read[item.id]?.length || 0) === item.sections.length &&
      item.sections.length > 0,
  );

  const achievements = [
    {
      title: "First learning action",
      detail: "Started building a real learning history.",
      earned: data.activity.length > 0,
      icon: Sparkles,
    },
    {
      title: "Chapter finisher",
      detail: "Read every section in a published chapter.",
      earned: completedChapter,
      icon: BookOpen,
    },
    {
      title: "Assessment master",
      detail: "Reached 100% on an assessment.",
      earned: masteredAssessments > 0,
      icon: Trophy,
    },
    {
      title: "Lab investigator",
      detail: "Mastered a mission through evidence.",
      earned: masteredLabs > 0,
      icon: FlaskConical,
    },
    {
      title: "Weekly rhythm",
      detail: `Reached your ${weeklyGoal}-day learning goal.`,
      earned: activeDays >= weeklyGoal,
      icon: Medal,
    },
  ];

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 18
        ? "Good afternoon"
        : "Good evening";
  const learnerName = data.personal.displayName.trim();

  const todayPlan = [
    {
      title: "Learn one section",
      detail:
        chapterProgress === 100
          ? "Current chapter is fully read. Revisit only if you need it."
          : `${featured.title} · ${sectionsRead}/${featured.sections.length} sections read`,
      done: todayTypes.has("read"),
      to: `/read/${featured.id}`,
      action: chapterProgress === 100 ? "Review chapter" : "Continue",
      icon: BookOpen,
    },
    {
      title: "Run one experiment",
      detail: "Use a mission to predict, manipulate, execute, and inspect evidence.",
      done: todayTypes.has("lab"),
      to: `/lab?chapter=${featured.id}`,
      action: "Open Lab",
      icon: FlaskConical,
    },
    {
      title: "Retrieve from memory",
      detail:
        reviewQueue.length > 0
          ? `Weakest current assessment: ${reviewQueue[0].chapter.title}`
          : "Use the current chapter assessment as retrieval practice.",
      done: todayTypes.has("assessment"),
      to: reviewQueue.length
        ? `/practice?chapter=${reviewQueue[0].chapter.id}`
        : `/practice?chapter=${featured.id}`,
      action: "Practice",
      icon: Target,
    },
  ];

  const completedToday = todayPlan.filter((item) => item.done).length;
  const todayPct = Math.round((completedToday / todayPlan.length) * 100);

  const recommendedCourses = pathCourses.slice(0, 4);

  return (
    <div className="page personal-lms-home">
      <header className="personal-lms-header">
        <div>
          <span className="eyebrow">YOUR PERSONAL LEARNING LMS</span>
          <h1>
            {greeting}{learnerName ? `, ${learnerName}` : ""}<span className="blue-dot">.</span>
          </h1>
          <p>
            Your dashboard adapts to what you actually read, practice, and master.
            No fake streaks. No random recommendations.
          </p>
        </div>
        <Link className="button" to="/settings">
          <Settings2 size={16} /> Personalize
        </Link>
      </header>

      <section className="personal-command-grid">
        <motion.article
          className="personal-continue-card"
          initial={{ opacity: 1, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="personal-continue-top">
            <div>
              <span className="eyebrow">CONTINUE LEARNING</span>
              <span className="personal-course-label">{featuredCourse.title}</span>
            </div>
            <span className="personal-status-chip">
              {chapterScore === 100
                ? "Mastered"
                : chapterScore !== undefined
                  ? `${chapterScore}% assessment`
                  : `${chapterProgress}% read`}
            </span>
          </div>

          <h2>{featured.title}</h2>
          <p>{featured.introduction}</p>

          <div className="personal-continue-actions">
            <Link className="button primary" to={`/read/${featured.id}`}>
              <Play size={16} fill="currentColor" />
              {sectionsRead ? "Resume lesson" : "Start lesson"}
            </Link>
            <Link className="button" to={`/lab?chapter=${featured.id}`}>
              <FlaskConical size={16} /> Open mission
            </Link>
          </div>

          <div className="personal-chapter-progress">
            <Progress value={chapterProgress} label="Current chapter progress" />
            <span>{sectionsRead}/{featured.sections.length} sections</span>
          </div>
        </motion.article>

        <aside className="personal-week-card">
          <div className="personal-ring-wrap">
            <div
              className="personal-week-ring"
              style={{ "--weekly-progress": `${weeklyPct * 3.6}deg` } as CSSProperties}
            >
              <div>
                <strong>{activeDays}</strong>
                <span>of {weeklyGoal} days</span>
              </div>
            </div>
          </div>
          <div>
            <span className="eyebrow">WEEKLY RHYTHM</span>
            <h2>{weeklyPct >= 100 ? "Goal reached" : `${weeklyGoal - activeDays} learning day${weeklyGoal - activeDays === 1 ? "" : "s"} to go`}</h2>
            <p>A day counts only after a real reading, assessment, confidence, or lab action.</p>
          </div>
          <div className="personal-week-strip" aria-label="Last seven learning days">
            {daySeries.map((day) => (
              <div key={day.key} title={`${day.full}: ${day.count} actions`}>
                <span className={day.count ? "active" : ""} data-level={Math.min(day.count, 4)} />
                <small>{day.label}</small>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="personal-today-section">
        <div className="personal-section-heading">
          <div>
            <span className="eyebrow">TODAY'S PLAN</span>
            <h2>Three useful actions. Then stop.</h2>
            <p>Short, deliberate learning beats endless content scrolling.</p>
          </div>
          <div className="personal-today-progress">
            <strong>{completedToday}/{todayPlan.length}</strong>
            <span>completed today</span>
            <Progress value={todayPct} label="Today's learning plan progress" />
          </div>
        </div>

        <div className="personal-plan-grid">
          {todayPlan.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                className={`personal-plan-card ${item.done ? "done" : ""}`}
                to={item.to}
                key={item.title}
              >
                <div className="personal-plan-index">
                  {item.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <Icon size={22} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <span className="personal-plan-action">
                  {item.done ? "Done today" : item.action} <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="personal-middle-grid">
        <article className="personal-path-card">
          <div className="personal-section-heading compact">
            <div>
              <span className="eyebrow">YOUR PATH</span>
              <h2>{preferredPath.title}</h2>
              <p>{preferredPath.description}</p>
            </div>
            <Route size={22} />
          </div>

          <div className="personal-path-steps">
            {recommendedCourses.map((course, index) => {
              const ready = course.modules.some((module) => module.chapters.length > 0);
              return (
                <Link to={`/course/${course.id}`} key={course.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{course.title}</strong>
                    <small>{ready ? "Lessons available" : "Curriculum mapped"}</small>
                  </div>
                  <ArrowRight size={15} />
                </Link>
              );
            })}
          </div>

          <Link className="personal-inline-link" to={`/paths/${preferredPath.id}`}>
            Open full path <ArrowRight size={14} />
          </Link>
        </article>

        <article className="personal-mastery-card">
          <div className="personal-section-heading compact">
            <div>
              <span className="eyebrow">MASTERY SNAPSHOT</span>
              <h2>Evidence, not completion.</h2>
            </div>
            <Target size={22} />
          </div>

          <div className="personal-mastery-grid">
            <div>
              <strong>{masteredAssessments}</strong>
              <span>assessments mastered</span>
            </div>
            <div>
              <strong>{masteredLabs}</strong>
              <span>lab missions mastered</span>
            </div>
            <div>
              <strong>{strongConfidence}</strong>
              <span>sections you can explain</span>
            </div>
            <div>
              <strong>{reviewQueue.length}</strong>
              <span>items needing review</span>
            </div>
          </div>

          {reviewQueue.length > 0 ? (
            <Link
              className="personal-review-callout"
              to={`/practice?chapter=${reviewQueue[0].chapter.id}`}
            >
              <NotebookPen size={18} />
              <div>
                <span>RECOMMENDED REVIEW</span>
                <strong>{reviewQueue[0].chapter.title}</strong>
                <small>{reviewQueue[0].score}% latest assessment</small>
              </div>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <div className="personal-review-empty">
              <CheckCircle2 size={20} />
              <span>No incomplete assessment attempts yet.</span>
            </div>
          )}
        </article>
      </section>

      <section className="personal-achievements">
        <div className="personal-section-heading compact">
          <div>
            <span className="eyebrow">MILESTONES</span>
            <h2>Progress worth noticing.</h2>
          </div>
          <Medal size={22} />
        </div>

        <div className="personal-achievement-row">
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <article className={item.earned ? "earned" : ""} key={item.title}>
                <Icon size={20} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
                {item.earned && <CheckCircle2 size={16} />}
              </article>
            );
          })}
        </div>

        <Link className="personal-explore-link" to="/catalog">
          <Compass size={17} />
          Explore something new without losing your learning path
          <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
