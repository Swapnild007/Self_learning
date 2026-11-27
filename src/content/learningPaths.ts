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
    title: "AI Engineer · Complete Stack",
    focus: "AI · GenAI · LLMs · RAG · Agents",
    description: "A foundation-to-production AI engineering path covering data, ML, deep learning, LLM internals, RAG, MCP, n8n, agents, evaluation, serving, MLOps and AI security.",
    outcome: "Design, build, evaluate, secure and operate production AI systems rather than isolated model demos.",
    courses: [
      "python", "git-github", "linux", "linear-algebra", "probability-statistics", "sql",
      "data-science", "machine-learning", "deep-learning", "nlp", "transformers-llm-internals",
      "llm-engineering", "genai", "prompt-engineering", "embeddings-vector-db", "rag-engineering",
      "ai-tools-function-calling", "ai-memory", "mcp", "n8n", "agentic-ai", "ai-multimodal",
      "llm-finetuning", "llm-evaluation", "local-ai", "model-serving", "mlops",
      "ai-security", "docker-containers", "cloud-fundamentals", "observability"
    ],
  },
  {
    id: "full-stack",
    title: "Full-Stack Web Engineer · Complete Stack",
    focus: "Frontend · Backend · Data · Cloud",
    description: "A production-grade web engineering path from browser fundamentals and accessible UI through backend services, identity, databases, realtime systems, testing, security, deployment and observability.",
    outcome: "Design, build, secure, test, deploy and operate a complete modern web application.",
    courses: [
      "git-github", "html", "css", "javascript", "web-apis-browser", "typescript",
      "responsive-accessibility", "react", "frontend-state", "tailwind", "nextjs",
      "nodejs", "express", "fastapi", "api-design", "authentication", "postgresql",
      "mongodb", "redis-caching", "orm-data-access", "graphql", "realtime-web",
      "queues-background-jobs", "object-storage-cdn", "payments-commerce", "web-testing",
      "web-security", "web-performance-seo", "docker-containers", "cloud-fundamentals",
      "devops", "observability", "system-design"
    ],
  },
  {
    id: "data-storyteller",
    title: "Data, BI & Data Science",
    focus: "Excel · SQL · Power BI · Tableau · Python",
    description: "Move from spreadsheet analysis to governed BI, statistics, Python data science and production data workflows.",
    outcome: "Analyze, model, visualize and explain business data using Excel, SQL, Power BI, Tableau and Python.",
    courses: [
      "excel", "sql", "power-bi", "tableau", "python", "probability-statistics",
      "data-analytics", "data-science", "postgresql", "machine-learning"
    ],
  },
  {
    id: "agent-builder",
    title: "AI Agents & Automation",
    focus: "RAG · MCP · n8n · Tools · Agents",
    description: "Specialize in tool-using AI systems, retrieval, memory, MCP servers/clients, n8n orchestration, human approval and agent evaluation.",
    outcome: "Build an auditable AI agent workflow with retrieval, tools, memory, automation, evaluation and security controls.",
    courses: [
      "python", "transformers-llm-internals", "llm-engineering", "prompt-engineering",
      "embeddings-vector-db", "rag-engineering", "ai-tools-function-calling", "ai-memory",
      "mcp", "n8n", "automation", "agentic-ai", "llm-evaluation", "ai-security", "observability"
    ],
  },
  {
    id: "backend",
    title: "Backend, APIs & Systems",
    focus: "Services · Databases · Reliability",
    description: "Build secure backend systems with Node.js and Python, API contracts, identity, relational and document databases, caches, queues and distributed reliability.",
    outcome: "Build and operate a production service with secure APIs, durable data and observable failure handling.",
    courses: [
      "linux", "git-github", "nodejs", "express", "fastapi", "api-design", "authentication",
      "postgresql", "mongodb", "redis-caching", "orm-data-access", "queues-background-jobs",
      "realtime-web", "web-security", "docker-containers", "distributed-systems",
      "observability", "system-design"
    ],
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
