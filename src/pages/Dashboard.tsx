import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Flame,
  Target,
  BookOpen,
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { courses, chapter } from "../content/catalog";
import { useStore } from "../store";
import { Progress } from "../components/ui";
import CourseCard from "../components/CourseCard";
export default function Dashboard() {
  const { data } = useStore();
  const read = data.read[chapter.id]?.length || 0;
  const pct = Math.round((read / chapter.sections.length) * 100);
  const score = data.scores["functions-check-v1"];
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>
            Make room for discovery<span className="blue-dot">.</span>
          </h1>
          <p>Welcome back, Swapnil. A little progress today goes a long way.</p>
        </div>
        <span className="pill">
          <span className="status-dot" /> Your personal learning space
        </span>
      </div>
      <div className="dashboard-grid">
        <motion.section
          className="hero"
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="hero-copy">
            <span className="eyebrow">CONTINUE LEARNING</span>
            <div className="hero-tags">
              <span>PYTHON FOUNDATIONS</span>
              <span>CHAPTER 01</span>
            </div>
            <h2>
              Small functions.
              <br />
              Powerful possibilities.
            </h2>
            <p>
              Turn a familiar reporting problem into code you can reuse, test,
              and trust.
            </p>
            <Link className="button primary" to={`/read/${chapter.id}`}>
              <Play size={16} fill="currentColor" />{" "}
              {read ? "Resume chapter" : "Start your first chapter"}{" "}
              <ArrowRight size={17} />
            </Link>
            <div className="hero-progress">
              <Progress value={pct} label="Chapter reading progress" />
              <span>{pct}% read · 35 min chapter</span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="code-tile">
              <span className="code-dots">● ● ●</span>
              <span className="tile-line">
                <em>def</em> grow(curiosity):
              </span>
              <span className="tile-line indent">
                <em>return</em> possibilities
              </span>
              <div className="tile-bottom">
                <span>One concept at a time.</span>
                <span>↗</span>
              </div>
            </div>
            <span className="float-chip">
              <CheckCircle2 size={16} /> Built for understanding
            </span>
          </div>
        </motion.section>
        <section className="goal-card panel">
          <div className="section-title">
            <span className="eyebrow">YOUR LEARNING RHYTHM</span>
            <Flame size={19} />
          </div>
          <div className="goal-number">
            {data.visited.length}
            <span>topics explored</span>
          </div>
          <p>Curiosity becomes a habit, one session at a time.</p>
          <div className="week" aria-label="Weekly learning goal">
            {Array.from({ length: data.goal }, (_, i) => (
              <span className={i < data.visited.length ? "done" : ""} key={i}>
                {i < data.visited.length ? "✓" : i + 1}
              </span>
            ))}
          </div>
          <Link to="/settings">
            Goal: {data.goal} topics <ArrowRight size={15} />
          </Link>
          <div className="goal-note">
            <Target size={18} />
            <span>
              {score === 100
                ? "Assessment mastered. Keep exploring."
                : "Next milestone: pass your first chapter assessment."}
            </span>
          </div>
        </section>
      </div>
      <div className="stats-row">
        <div>
          <BookOpen />
          <span>
            <strong>{data.enrolled.length}</strong> enrolled course
          </span>
        </div>
        <div>
          <CheckCircle2 />
          <span>
            <strong>
              {Object.values(data.scores).filter((x) => x === 100).length}
            </strong>{" "}
            assessments mastered
          </span>
        </div>
        <div>
          <Bookmark />
          <span>
            <strong>{data.bookmarks.length}</strong> saved chapters
          </span>
        </div>
        <div>
          <Target />
          <span>
            <strong>{pct}%</strong> chapter reading progress
          </span>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <h2>Your learning, in motion</h2>
          <p>Pick up a new skill. Build on what you know.</p>
        </div>
        <Link to="/catalog">
          Explore catalog <ArrowRight size={17} />
        </Link>
      </div>
      <div className="course-grid">
        {courses.slice(0, 3).map((c) => (
          <CourseCard course={c} key={c.id} />
        ))}
      </div>
      <div className="bottom-grid">
        <section className="panel">
          <div className="section-title">
            <h3>Recently explored</h3>
            <Link to="/learning">View learning</Link>
          </div>
          {data.visited.length ? (
            <Link className="recent-row" to={`/read/${chapter.id}`}>
              <span className="mini-symbol">Py</span>
              <span>
                <strong>{chapter.title}</strong>
                <small>Python · {pct}% read</small>
              </span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <p className="empty">
              Your recently opened chapters will appear here. Start with Python
              above.
            </p>
          )}
        </section>
        <section className="panel note-card">
          <span className="eyebrow">A SPACE FOR YOUR IDEAS</span>
          <h3>Keep the insight, not just the answer.</h3>
          <p>Chapter notes stay with your learning, saved on this device.</p>
          <Link to="/learning">
            Open personal notes <ArrowRight size={16} />
          </Link>
        </section>
      </div>
      <div className="path-banner">
        <span className="mini-symbol">↗</span>
        <div>
          <span className="eyebrow">RECOMMENDED DIRECTION</span>
          <h3>From Python foundations to confident analysis</h3>
          <p>
            Start with the sample chapter. Explore SQL and Excel catalog
            previews next.
          </p>
        </div>
        <Link className="button" to="/catalog">
          Find your path <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
