export interface GlobalCurriculumPhase {
  id: string;
  title: string;
  purpose: string;
  courses: string[];
  gate: string;
}

/**
 * Original synthesis of recurring CS curriculum patterns found across globally
 * recognized university programs. This is not a copy of any institution's syllabus.
 */
export const globalCsCurriculum: GlobalCurriculumPhase[] = [
  {
    id: "mathematical-foundations",
    title: "Phase 1 · Mathematical foundations",
    purpose: "Build the proof, modeling and uncertainty language used throughout computer science.",
    courses: ["calculus-computing", "linear-algebra", "discrete-math", "probability-statistics"],
    gate: "Solve proof, modeling and probability problems without relying on memorized formulas.",
  },
  {
    id: "programming-foundations",
    title: "Phase 2 · Programming and software construction",
    purpose: "Move from writing code to designing reliable abstractions that can be tested and changed.",
    courses: ["python", "programming-languages", "software-engineering"],
    gate: "Build, test, debug and explain a medium-sized program with explicit contracts.",
  },
  {
    id: "algorithms-theory",
    title: "Phase 3 · Data structures, algorithms and theory",
    purpose: "Reason about efficiency, correctness and the limits of computation.",
    courses: ["dsa", "theory-computation"],
    gate: "Design an algorithm, justify correctness and analyze time/space complexity.",
  },
  {
    id: "computer-systems",
    title: "Phase 4 · Computer systems",
    purpose: "Understand what happens below application code, from instructions to processes and networks.",
    courses: ["computer-architecture", "operating-systems", "computer-networks"],
    gate: "Trace a program through CPU, memory, OS and network layers and diagnose a systems failure.",
  },
  {
    id: "data-systems",
    title: "Phase 5 · Data and information systems",
    purpose: "Model, query and operate persistent data with clear consistency and performance trade-offs.",
    courses: ["database-systems", "sql", "data-analytics"],
    gate: "Design a schema, justify an index/query plan and produce a reproducible analysis.",
  },
  {
    id: "intelligent-human-secure",
    title: "Phase 6 · Intelligent, human and secure computing",
    purpose: "Add AI, human-centered design and security after the core foundations are in place.",
    courses: ["machine-learning", "llm-engineering", "hci", "cybersecurity"],
    gate: "Build and evaluate a system with model, user and security evidence—not demo quality alone.",
  },
  {
    id: "advanced-systems",
    title: "Phase 7 · Advanced engineering depth",
    purpose: "Study reliability, scale and deployment as consequences of systems fundamentals.",
    courses: ["distributed-systems", "system-design", "devops"],
    gate: "Defend architecture trade-offs under latency, failure, consistency and operational constraints.",
  },
  {
    id: "capstone",
    title: "Phase 8 · Capstone and research practice",
    purpose: "Integrate theory, implementation, experimentation, ethics and communication in one substantial project.",
    courses: ["cs-capstone"],
    gate: "Deliver a working artifact, evaluation evidence, limitations, technical report and oral defense.",
  },
];

export const globalCsCourseOrder = globalCsCurriculum.flatMap((phase) => phase.courses);
