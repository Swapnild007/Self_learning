import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  Medal,
  Target,
  Trophy,
} from "lucide-react";
import { challenges } from "../content/challenges";
import { useStore } from "../store";

export default function Arena() {
  const { id } = useParams();
  const selected = challenges.find((challenge) => challenge.id === id);
  const { data } = useStore();

  if (id && !selected) {
    return (
      <div className="page">
        <h1>Challenge not found</h1>
        <Link to="/arena">Open Arena</Link>
      </div>
    );
  }

  if (selected) {
    return <ChallengeView challenge={selected} />;
  }

  const mastered = Object.values(data.challengeScores).filter((score) => score.best === 100).length;
  const attempts = Object.values(data.challengeScores).reduce((sum, score) => sum + score.attempts, 0);

  return (
    <div className="page arena-page">
      <header className="arena-hero">
        <div>
          <span className="eyebrow">CHALLENGE ARENA · APPLY WHAT YOU KNOW</span>
          <h1>Compete with your previous best<span className="blue-dot">.</span></h1>
          <p>
            Real competition mechanics without a fake community leaderboard. Complete a brief,
            score against a transparent rubric, and improve your personal best.
          </p>
        </div>
        <div className="arena-stats">
          <div><strong>{attempts}</strong><span>attempts</span></div>
          <div><strong>{mastered}</strong><span>perfect scores</span></div>
        </div>
      </header>

      <div className="arena-grid">
        {challenges.map((challenge) => {
          const score = data.challengeScores[challenge.id];
          return (
            <Link className="arena-card" to={"/arena/" + challenge.id} key={challenge.id}>
              <div className="arena-card-top">
                <span className={"arena-status " + challenge.status}>{challenge.status === "open" ? "Open challenge" : "Practice arena"}</span>
                <span><Clock3 size={14} /> {challenge.minutes} min</span>
              </div>
              <h2>{challenge.title}</h2>
              <p>{challenge.brief}</p>
              <div className="tags">
                {challenge.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}
              </div>
              <div className="arena-card-foot">
                <span>{challenge.domain} · {challenge.difficulty}</span>
                <strong>{score ? "Best " + score.best + "%" : "Not attempted"} <ArrowRight size={14} /></strong>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ChallengeView({ challenge }: { challenge: (typeof challenges)[number] }) {
  const { data, update } = useStore();
  const [evidence, setEvidence] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const saved = data.challengeScores[challenge.id];

  const score = useMemo(
    () =>
      challenge.rubric.reduce(
        (sum, item) => sum + (evidence[item.label] ? item.points : 0),
        0,
      ),
    [challenge.rubric, evidence],
  );

  function submit() {
    update((current) => {
      const previous = current.challengeScores[challenge.id] || {
        best: 0,
        attempts: 0,
        lastRun: 0,
      };
      return {
        ...current,
        challengeScores: {
          ...current.challengeScores,
          [challenge.id]: {
            best: Math.max(previous.best, score),
            attempts: previous.attempts + 1,
            lastRun: Date.now(),
          },
        },
      };
    });
  }

  return (
    <div className="page arena-page">
      <Link className="back-link" to="/arena">
        <ArrowLeft size={15} /> Challenge Arena
      </Link>

      <header className="arena-challenge-hero">
        <div>
          <span className="eyebrow">{challenge.domain} · {challenge.difficulty}</span>
          <h1>{challenge.title}<span className="blue-dot">.</span></h1>
          <p>{challenge.brief}</p>
          <div className="arena-challenge-meta">
            <span><Clock3 size={15} /> {challenge.minutes} min target</span>
            <span><Target size={15} /> {challenge.rubric.length} scoring criteria</span>
            <span><Medal size={15} /> Best {saved?.best ?? 0}%</span>
          </div>
        </div>
        {challenge.launch && (
          <Link className="button primary" to={challenge.launch}>
            Launch supporting Lab <ArrowRight size={15} />
          </Link>
        )}
      </header>

      <section className="arena-brief">
        <span className="eyebrow">DELIVERABLE</span>
        <h2>What you need to produce</h2>
        <p>{challenge.deliverable}</p>
      </section>

      <section className="arena-rubric">
        <div className="arena-rubric-heading">
          <div>
            <span className="eyebrow">SCORING RUBRIC</span>
            <h2>Score the evidence, not the effort.</h2>
            <p>Mark a criterion only when your work actually contains the stated evidence.</p>
          </div>
          <div className="arena-live-score">
            <strong>{score}</strong>
            <span>/ 100</span>
          </div>
        </div>

        <div className="arena-rubric-list">
          {challenge.rubric.map((item) => {
            const checked = Boolean(evidence[item.label]);
            return (
              <button
                type="button"
                className={checked ? "checked" : ""}
                onClick={() => setEvidence((current) => ({ ...current, [item.label]: !checked }))}
                key={item.label}
              >
                {checked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.evidence}</span>
                </div>
                <b>{item.points} pts</b>
              </button>
            );
          })}
        </div>

        <label className="arena-evidence-notes">
          <span>Evidence notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Record what you built, tested, measured, or would improve next."
          />
        </label>

        <div className="arena-submit">
          <div>
            <strong>{score >= 80 ? "Strong submission" : score >= 60 ? "Good base — keep improving" : "Build more evidence before stopping"}</strong>
            <span>Personal best: {saved?.best ?? 0}% · attempts: {saved?.attempts ?? 0}</span>
          </div>
          <button className="primary" type="button" onClick={submit} disabled={!notes.trim()}>
            <Trophy size={16} /> Save scored attempt
          </button>
        </div>
      </section>
    </div>
  );
}
