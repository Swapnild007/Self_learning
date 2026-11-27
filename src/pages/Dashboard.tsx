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

  const pulseSteps = [
    {
      label: "Understand",
      detail: "Build the mental model",
      icon: BookOpen,
      done: chapterProgress === 100,
      active: ["not-started", "learning"].includes(featuredEvidence.state),
    },
    {
      label: "Experiment",
      detail: "Change something and observe",
      icon: FlaskConical,
      done: featuredEvidence.hasLab && featuredEvidence.labBest === 100,
      active: featuredEvidence.state === "experiment",
    },
    {
      label: "Recall",
      detail: "Prove it from memory",
      icon: Target,
      done: chapterScore === 100,
      active: ["practice", "review", "mastered"].includes(featuredEvidence.state),
    },
  ];

  const visibleSections = featured.sections.slice(0, 3);

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
    <div className="page personal-lms-home pulse-home">
      <header className="pulse-home-header">
        <div className="pulse-home-copy">
          <div className="pulse-live-row">
            <span className="pulse-live-dot" aria-hidden="true" />
            <span>PERSONAL LEARNING SPACE</span>
            <span className="pulse-separator">·</span>
            <span>{activeDays}/{weeklyGoal} learning days this week</span>
          </div>
          <h1>
            {greeting}{learnerName ? `, ${learnerName}` : ""}<span className="blue-dot">.</span>
          </h1>
          <p>
            One useful next step, chosen from your actual learning evidence.
          </p>
        </div>

        <Link className="pulse-personalize" to="/settings">
          <Settings2 size={17} />
          <span>Personalize</span>
          <ArrowRight size={14} />
        </Link>
      </header>

      <motion.section
        className="learning-pulse-shell"
        initial={{ opacity: 1, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .28 }}
      >
        <article className="learning-pulse-copy">
          <div className="learning-pulse-meta">
            <div>
              <span className="eyebrow">CONTINUE LEARNING</span>
              <span className="personal-course-label">{featuredCourse.title}</span>
            </div>
            <span className={`personal-status-chip state-${featuredEvidence.state}`}>
              {featuredEvidence.label}
            </span>
          </div>

          <h2>{featured.title}</h2>
          <p className="learning-pulse-intro">{featured.introduction}</p>

          <div className="lesson-stage-strip" aria-label="Published lesson stages">
            {visibleSections.map((section, index) => {
              const isRead = (data.read[featured.id] || []).includes(section.id);
              const isCurrent = !isRead && index === sectionsRead;
              return (
                <Link
                  to={`/read/${featured.id}`}
                  className={`lesson-stage ${isRead ? "done" : ""} ${isCurrent ? "current" : ""}`}
                  key={section.id}
                >
                  <span>{isRead ? <CheckCircle2 size={14} /> : String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>{isRead ? "COMPLETED" : isCurrent ? "UP NEXT" : "LATER"}</small>
                    <strong>{section.title}</strong>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="pulse-action-panel">
            <div>
              <span>NEXT BEST ACTION</span>
              <strong>{featuredEvidence.action.label}</strong>
              <p>{featuredEvidence.action.reason}</p>
            </div>
            <Link className="pulse-primary-action" to={featuredEvidence.action.to}>
              <Play size={17} fill="currentColor" />
              <span>{featuredEvidence.action.label}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </article>

        <aside className="learning-pulse-visual" aria-label="Current learning pulse">
          <div className="pulse-visual-grid" aria-hidden="true" />
          <motion.div
            className="pulse-orbit"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="pulse-core"
              style={{ "--chapter-progress": `${chapterProgress * 3.6}deg` } as CSSProperties}
            >
              <div>
                <span>CHAPTER</span>
                <strong>{chapterProgress}%</strong>
                <small>{sectionsRead}/{featured.sections.length} sections</small>
              </div>
            </div>

            {pulseSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  className={`pulse-orbit-node node-${index + 1} ${step.done ? "done" : ""} ${step.active ? "active" : ""}`}
                  key={step.label}
                  initial={{ opacity: 0, scale: .92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: .08 * index }}
                >
                  <Icon size={16} />
                  <span>{step.label}</span>
                </motion.div>
              );
            })}

            <span className="pulse-orbit-line orbit-line-1" />
            <span className="pulse-orbit-line orbit-line-2" />
            <span className="pulse-orbit-line orbit-line-3" />
          </motion.div>

          <div className="pulse-signal-grid">
            <div>
              <span>READING</span>
              <strong>{chapterProgress}%</strong>
            </div>
            <div>
              <span>LAB</span>
              <strong>{featuredEvidence.hasLab ? `${featuredEvidence.labBest ?? 0}%` : "—"}</strong>
            </div>
            <div>
              <span>RECALL</span>
              <strong>{chapterScore === undefined ? "—" : `${chapterScore}%`}</strong>
            </div>
          </div>
        </aside>
      </motion.section>

      <section className="pulse-today-section">
        <div className="pulse-section-heading">
          <div>
            <span className="eyebrow">TODAY'S FOCUS</span>
            <h2>Three moves. One learning loop.</h2>
          </div>
          <div className="pulse-today-meter">
            <strong>{completedToday}/{todayPlan.length}</strong>
            <span>done today</span>
            <Progress value={todayPct} label="Today's learning plan progress" />
          </div>
        </div>

        <div className="pulse-mission-deck">
          {todayPlan.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
              >
                <Link
                  className={`pulse-mission-card ${item.done ? "done" : ""}`}
                  to={item.to}
                >
                  <div className="pulse-mission-card-top">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item.done ? <CheckCircle2 size={18} /> : <Icon size={19} />}
                  </div>
                  <div>
                    <small>{item.done ? "COMPLETE" : "TODAY"}</small>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <span className="pulse-mission-cta">
                    {item.done ? "Done" : item.action}
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="home-arena-strip">
        <div>
          <span className="eyebrow">CHALLENGE ARENA</span>
          <h2>Turn learning into a scored challenge.</h2>
          <p>Use a transparent rubric, save your personal best, and improve the evidence—not just the score.</p>
        </div>
        <div className="home-arena-actions">
          <span><Trophy size={17} /> {Object.values(data.challengeScores).reduce((sum, item) => sum + item.attempts, 0)} attempts</span>
          <Link className="button" to="/arena">
            Enter Arena <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="personal-middle-grid pulse-lower-grid">
        <article className="personal-path-card pulse-path-card">
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

        <article className="personal-mastery-card pulse-mastery-card">
          <div className="personal-section-heading compact">
            <div>
              <span className="eyebrow">MASTERY SIGNALS</span>
              <h2>Your evidence at a glance.</h2>
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
            <Link className="personal-review-callout" to={reviewPriority.to}>
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

      <section className="personal-achievements pulse-achievements">
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
