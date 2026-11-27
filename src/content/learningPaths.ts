import { courses } from "./catalog";
import { globalCsCourseOrder } from "./globalCsCurriculum";

/** Original learning journeys. Only courses containing chapters are playable. */
export interface LearningPath {
  id: string;
  title: string;
  focus: string;
  description: string;
  outcome: string;
  courses: string[];
}
export const learningPaths: LearningPath[] = [
  {
    id: "global-cs-core",
    title: "Global Computer Science Core",
    focus: "University-grade computer science",
    description: "A rigorous foundation-first curriculum synthesized from recurring structures used by globally recognized CS programs: mathematics, programming, algorithms, systems, data, theory, intelligent computing, engineering depth and capstone work.",
    outcome: "Develop the breadth and depth to reason about software, algorithms, systems, data and intelligent computing—not just use frameworks.",
    courses: globalCsCourseOrder,
  },
  {
    id: "python-ai",
    title: "Python to AI engineer",
    focus: "Artificial intelligence",
    description: "Learn to program, work with evidence, and understand why language models behave the way they do.",
    outcome: "Build and critically evaluate a small AI-powered application.",
    courses: ["python", "data-analytics", "machine-learning", "llm-engineering", "agentic-ai"],
  },
  {
    id: "full-stack",
    title: "Modern web developer",
    focus: "Web engineering",
    description: "Move from accessible pages to interactive products, typed applications, and server-side systems.",
    outcome: "Design, build, test, and ship a complete web experience.",
    courses: ["html", "css", "javascript", "typescript", "react", "nodejs", "express"],
  },
  {
    id: "data-storyteller",
    title: "Data to decisions",
    focus: "Analytics",
    description: "Turn messy information into reliable calculations, visual explanations, and useful decisions.",
    outcome: "Create a transparent, reproducible reporting project.",
    courses: ["excel", "sql", "python", "data-analytics", "power-bi"],
  },
  {
    id: "agent-builder",
    title: "Reliable AI agents",
    focus: "Agent engineering",
    description: "Understand the language model before adding retrieval, tools, orchestration, and safeguards.",
    outcome: "Build an agent that can be tested, evaluated, and safely operated.",
    courses: ["python", "llm-engineering", "genai", "claude-code", "agentic-ai"],
  },
  {
    id: "backend",
    title: "Backend and systems",
    focus: "Software architecture",
    description: "Explore APIs, databases, validation, performance, and the trade-offs behind scalable services.",
    outcome: "Build and explain a production-oriented service architecture.",
    courses: ["javascript", "nodejs", "express", "mongodb", "system-design", "devops"],
  },
  {
    id: "security",
    title: "Defensive security",
    focus: "Cybersecurity",
    description: "Start with operating systems and scripting; move into defensive controls and incident analysis.",
    outcome: "Investigate a security scenario and document a defensible response.",
    courses: ["linux", "python", "cybersecurity", "soc"],
  },
  {
    id: "product-design",
    title: "Design and build products",
    focus: "Product development",
    description: "Connect user research, accessible interfaces, front-end implementation, and mobile delivery.",
    outcome: "Take one user problem from design evidence to a functional interface.",
    courses: ["ui-ux", "html", "css", "javascript", "react", "react-native"],
  },
  {
    id: "cloud-delivery",
    title: "Production engineering",
    focus: "Infrastructure",
    description: "Understand Linux, shipping software, operating systems at scale, and preventing failure.",
    outcome: "Explain and verify a repeatable, observable delivery process.",
    courses: ["linux", "devops", "system-design", "cybersecurity"],
  },
];
export const resolvePath = (path: LearningPath) =>
  path.courses.map((id) => {
    const course = courses.find((candidate) => candidate.id === id);
    if (!course) throw new Error(`Unknown course ${id} in path ${path.id}`);
    return course;
  });
export const publishedCoursesInPath = (path: LearningPath) =>
  resolvePath(path).filter((course) => course.modules.some((module) => module.chapters.length > 0)).length;
