export type ChallengeStatus = "open" | "practice";

export interface ChallengeRubric {
  label: string;
  points: number;
  evidence: string;
}

export interface LearningChallenge {
  id: string;
  title: string;
  domain: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: ChallengeStatus;
  minutes: number;
  brief: string;
  deliverable: string;
  skills: string[];
  rubric: ChallengeRubric[];
  launch?: string;
}

export const challenges: LearningChallenge[] = [
  {
    id: "rag-grounding-sprint",
    title: "RAG Grounding Sprint",
    domain: "AI Engineering",
    difficulty: "Intermediate",
    status: "open",
    minutes: 45,
    brief:
      "Design a retrieval answer flow that selects relevant evidence, rejects a malicious retrieved instruction, and explains when it should abstain.",
    deliverable:
      "A short architecture note plus evidence from the RAG mission showing retrieval and trust-boundary decisions.",
    skills: ["RAG", "retrieval", "prompt injection", "citations", "evaluation"],
    rubric: [
      { label: "Retrieval design", points: 30, evidence: "Explains chunk/retrieval/rerank decisions." },
      { label: "Grounding", points: 25, evidence: "Claims are tied to selected evidence." },
      { label: "Security", points: 25, evidence: "Retrieved instructions are treated as untrusted data." },
      { label: "Evaluation", points: 20, evidence: "Defines success/failure checks." },
    ],
    launch: "/lab?chapter=llm-rag",
  },
  {
    id: "web-security-audit",
    title: "Secure the Web App",
    domain: "Full-Stack Development",
    difficulty: "Intermediate",
    status: "open",
    minutes: 60,
    brief:
      "Audit a web application design against the Security Audit 14 and identify which controls belong in browser, server, CI, and deployment boundaries.",
    deliverable:
      "A 14-control audit with PASS / FAIL / N/A evidence and a prioritized remediation list.",
    skills: ["OWASP", "auth", "authorization", "secrets", "CI/CD"],
    rubric: [
      { label: "Boundary reasoning", points: 30, evidence: "Client/server responsibilities are correct." },
      { label: "Coverage", points: 25, evidence: "All 14 controls are addressed." },
      { label: "Remediation", points: 25, evidence: "Fixes are prioritized and technically specific." },
      { label: "Evidence quality", points: 20, evidence: "Every PASS cites a test/config/code proof." },
    ],
  },
  {
    id: "analytics-decision-room",
    title: "Executive Decision Room",
    domain: "Data & BI",
    difficulty: "Beginner",
    status: "practice",
    minutes: 45,
    brief:
      "Turn a messy business question into an analysis plan, define the grain and metrics, and choose whether Excel, SQL, Power BI, Tableau or Python is the right tool at each step.",
    deliverable:
      "A decision memo describing the analysis workflow, KPIs, quality checks and dashboard story.",
    skills: ["Excel", "SQL", "Power BI", "Tableau", "Python"],
    rubric: [
      { label: "Problem framing", points: 30, evidence: "Business question and decision are explicit." },
      { label: "Metric quality", points: 25, evidence: "KPIs have definitions, units and grain." },
      { label: "Tool choice", points: 25, evidence: "Tool choice is justified by task." },
      { label: "Communication", points: 20, evidence: "Dashboard/story supports the decision." },
    ],
  },
];
