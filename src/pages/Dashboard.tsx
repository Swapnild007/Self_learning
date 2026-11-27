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
import { chapterEvidence } from "../learningEngine";
import { Progress } from "../components/ui";

function startOfDay(value: number | Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function dayKey(value: number | Date) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Dashboard() {
  const { data } = useStore();

  const preferredPath =
    learningPaths.find((path) => path.id === data.personal.activePath) ||
    learningPaths[0];
  const pathCourses = resolvePath(preferredPath);
  const firstPlayablePathEntry = pathCourses
    .flatMap((course) =>
      course.modules.flatMap((module) =>
        module.chapters.map((item) => ({ chapter: item, course })),
      ),
    )
    .find(Boolean);

  const latestActivityEntry = [...data.activity]
    .sort((a, b) => b.at - a.at)
    .map((item) => findChapter(item.subject))
    .find((entry) => entry !== undefined);

  const recentEntry = data.visited
    .map((id) => findChapter(id))
    .find((entry) => entry !== undefined);

  const featured =
    latestActivityEntry?.chapter ||
    recentEntry?.chapter ||
    firstPlayablePathEntry?.chapter ||
    chapter;
  const featuredCourse =
    latestActivityEntry?.course ||
    recentEntry?.course ||
    firstPlayablePathEntry?.course ||
    courses.find((course) => course.id === "python")!;

  const sectionsRead = data.read[featured.id]?.length || 0;
  const chapterProgress = Math.round(
    (sectionsRead / Math.max(1, featured.sections.length)) * 100,
  );
  const assessmentKey = `${featured.assessment.id}-v${featured.assessment.version}`;
  const chapterScore = data.scores[assessmentKey];
  const featuredEvidence = chapterEvidence(featured, data);

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

  const lowConfidence = chapterRegistry
    .flatMap((entry) =>
      entry.chapter.sections
        .map((section) => ({
          ...entry,
          section,
          confidence: data.confidence[`${entry.chapter.id}:${section.id}`],
        }))
        .filter((item) => item.confidence === 1),
    );

  const reviewPriority =
    reviewQueue.length > 0
      ? {
          kind: "assessment" as const,
          title: reviewQueue[0].chapter.title,
          detail: `${reviewQueue[0].score}% latest assessment`,
          to: `/practice?chapter=${reviewQueue[0].chapter.id}`,
        }
      : lowConfidence.length > 0
        ? {
            kind: "confidence" as const,
            title: lowConfidence[0].section.title,
            detail: `${lowConfidence[0].chapter.title} · marked needs another pass`,
            to: `/read/${lowConfidence[0].chapter.id}`,
          }
        : null;

  const missionChapters = new Set([
    "python-functions",
    "llm-foundations",
    "llm-embeddings",
    "llm-attention",
    "llm-rag",
  ]);
  const relatedMission =
    (missionChapters.has(featured.id) && featured.id) ||
    pathCourses
      .flatMap((course) => course.modules.flatMap((module) => module.chapters))
      .find((item) => missionChapters.has(item.id))?.id ||
    "python-functions";
  const relatedMissionEntry = findChapter(relatedMission);

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

  const earnedAchievements = achievements.filter((item) => item.earned);
  const nextAchievement = achievements.find((item) => !item.earned);
  const visibleAchievements = [
    ...earnedAchievements,
    ...(nextAchievement ? [nextAchievement] : []),
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
      detail: relatedMissionEntry
        ? `${relatedMissionEntry.chapter.title} · evidence-backed mission`
        : "Predict, manipulate, execute, and inspect evidence.",
      done: todayTypes.has("lab"),
      to: `/lab?chapter=${relatedMission}`,
      action: "Open Lab",
      icon: FlaskConical,
    },
    {
      title: reviewPriority?.kind === "confidence" ? "Strengthen a weak spot" : "Retrieve from memory",
      detail: reviewPriority
        ? `${reviewPriority.title} · ${reviewPriority.detail}`
        : "Use the current chapter assessment as retrieval practice.",
      done:
        reviewPriority?.kind === "confidence"
          ? todayTypes.has("confidence")
          : todayTypes.has("assessment"),
      to: reviewPriority?.to || `/practice?chapter=${featured.id}`,
      action: reviewPriority?.kind === "confidence" ? "Revisit" : "Practice",
      icon: Target,
    },
  ];

  const completedToday = todayPlan.filter((item) => item.done).length;
  const todayPct = Math.round((completedToday / todayPlan.length) * 100);

  const featuredPathIndex = pathCourses.findIndex(
    (course) => course.id === featuredCourse.id,
  );
  const firstPlayableCourseIndex = pathCourses.findIndex((course) =>
    course.modules.some((module) => module.chapters.length > 0),
  );
  const pathAnchor =
    featuredPathIndex >= 0
      ? featuredPathIndex
      : Math.max(0, firstPlayableCourseIndex);
  const visiblePathCount = Math.min(5, Math.max(2, data.goal));
  const pathStart = Math.max(
    0,
    Math.min(pathAnchor, Math.max(0, pathCourses.length - visiblePathCount)),
  );
  const recommendedCourses = pathCourses.slice(
    pathStart,
    pathStart + visiblePathCount,
  );

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
            <span className={`personal-status-chip state-${featuredEvidence.state}`}>
              {featuredEvidence.label}
            </span>
          </div>

          <h2>{featured.title}</h2>
          <p>{featured.introduction}</p>

          <div className="personal-next-reason">
            <span>NEXT BEST ACTION</span>
            <strong>{featuredEvidence.action.label}</strong>
            <p>{featuredEvidence.action.reason}</p>
          </div>

          <div className="personal-continue-actions">
            <Link className="button primary" to={featuredEvidence.action.to}>
              <Play size={16} fill="currentColor" />
              {featuredEvidence.action.label}
            </Link>
            {featuredEvidence.action.to !== `/read/${featured.id}` && (
              <Link className="button" to={`/read/${featured.id}`}>
                <BookOpen size={16} /> Open lesson
              </Link>
            )}
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
            <h2>Three moves for today.</h2>
            <p>A focused session: understand, experiment, retrieve.</p>
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
            {recommendedCourses.map((course) => {
              const ready = course.modules.some((module) => module.chapters.length > 0);
              return (
                <Link to={`/course/${course.id}`} key={course.id}>
                  <span>{String(pathCourses.findIndex((item) => item.id === course.id) + 1).padStart(2, "0")}</span>
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
              <strong>{reviewQueue.length + lowConfidence.length}</strong>
              <span>review signals</span>
            </div>
          </div>

          {reviewPriority ? (
            <Link
              className="personal-review-callout"
              to={reviewPriority.to}
            >
              <NotebookPen size={18} />
              <div>
                <span>RECOMMENDED REVIEW</span>
                <strong>{reviewPriority.title}</strong>
                <small>{reviewPriority.detail}</small>
              </div>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <div className="personal-review-empty">
              <CheckCircle2 size={20} />
              <span>No weak assessment or low-confidence item is waiting.</span>
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
          <div className="personal-milestone-count">
            <strong>{earnedAchievements.length}</strong>
            <span>of {achievements.length} earned</span>
          </div>
        </div>

        <div className="personal-achievement-row">
          {visibleAchievements.map((item) => {
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
