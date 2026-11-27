import { pythonChapters } from "./pythonCurriculum";
import type { Chapter, Course } from "./schema";
export const starter = `def average_wait(total_seconds, calls):\n    if calls == 0:\n        return 0\n    return total_seconds / calls\n\nprint(average_wait(150, 5))`;
export const chapter: Chapter = {
  id: "python-functions",
  version: 1,
  title: "Functions that turn data into decisions",
  minutes: 35,
  introduction:
    "A useful program does more than calculate an answer once. It captures a rule clearly enough to reuse, test and explain. In this chapter, you will turn a contact-centre reporting rule into a small Python function, examine its boundary cases, and verify its behaviour.",
  objectives: [
    {
      id: "define",
      text: "Define a function with parameters and a return value.",
    },
    { id: "reason", text: "Distinguish returned values from printed output." },
    { id: "test", text: "Test ordinary inputs and a zero-volume boundary." },
  ],
  prerequisites: [
    "Numbers and arithmetic",
    "Variables and basic comparisons",
    "Indentation and if statements",
  ],
  sections: [
    {
      id: "why-functions",
      title: "1. A name for a repeatable rule",
      blocks: [
        {
          type: "paragraph",
          text: "Suppose your team measures average wait time. For five answered calls with 150 total seconds of waiting, the average is 30 seconds. Repeating this calculation in several places creates a maintenance problem: a change in one place may not reach the others. A function gives the rule one implementation and a descriptive name.",
        },
        {
          type: "definition",
          term: "Function",
          text: "A named, reusable block of code that can accept inputs and return a result. Defining a function creates it; calling it runs its body.",
        },
        {
          type: "diagram",
          caption: "The reporting pipeline",
          steps: [
            "Total waiting seconds + answered calls",
            "average_wait(total_seconds, calls)",
            "Average waiting seconds per call",
          ],
        },
        {
          type: "paragraph",
          text: "Names are part of the interface. average_wait communicates intent more clearly than calc or f. Prefer names that describe the result, and document units at the boundary where data enters your program.",
        },
      ],
    },
    {
      id: "syntax",
      title: "2. Define, call, and return",
      blocks: [
        {
          type: "syntax",
          syntax: {
            signature:
              "def name(parameter_1, parameter_2):\n    return expression",
            explanation:
              "def starts a function definition. Parentheses contain parameters. A colon opens the body, which is indented consistently (conventionally four spaces). return ends the call and passes a value to its caller.",
          },
        },
        {
          type: "code",
          example: {
            source: starter,
            expectedOutput: "30.0",
            explanation:
              "150 and 5 are arguments supplied by the caller. Inside the function they are bound to total_seconds and calls. / produces a floating-point result, even when the mathematical result is a whole number.",
          },
        },
        {
          type: "paragraph",
          text: "A parameter is a name in a function definition; an argument is a value supplied to a call. Python binds each positional argument to its corresponding parameter. Keyword arguments can make a call clearer: average_wait(total_seconds=150, calls=5). Avoid depending on argument order when names better explain the business meaning.",
        },
        {
          type: "table",
          headers: ["Expression", "Meaning", "Result"],
          rows: [
            ["average_wait(150, 5)", "Call with ordinary data", "30.0"],
            [
              "average_wait(0, 0)",
              "Apply the explicit zero-volume policy",
              "0",
            ],
            [
              "print(30.0)",
              "Write a representation to the console",
              "Returns None",
            ],
          ],
        },
        {
          type: "callout",
          tone: "mistake",
          title: "Printing is not returning",
          text: "print() displays a value; it does not make that value the result of your function. If execution reaches the end without return, Python returns None. A later arithmetic operation on None will fail.",
        },
      ],
    },
    {
      id: "boundaries",
      title: "3. Make boundary decisions explicit",
      blocks: [
        {
          type: "paragraph",
          text: "Dividing by zero raises ZeroDivisionError. The guard clause handles calls == 0 before division. Returning zero here is an intentional exercise policy, not a universal reporting standard. A real dashboard might instead show “not applicable” to avoid suggesting that zero calls had excellent service.",
        },
        {
          type: "callout",
          tone: "note",
          title: "An average has a denominator",
          text: "This example divides by answered calls only. Do not relabel it as the wait time for all offered calls without changing the denominator and explaining how abandoned calls are handled.",
        },
        {
          type: "paragraph",
          text: "The small function assumes nonnegative numeric seconds and a nonnegative integer count. Production ingestion should reject negative counts, missing values and incompatible units before calling it. Keeping validation at a clear boundary makes both the rule and its contract easier to understand.",
        },
        {
          type: "code",
          example: {
            source:
              'assert average_wait(150, 5) == 30\nassert average_wait(0, 0) == 0\nassert average_wait(7, 2) == 3.5\nprint("All checks passed")',
            expectedOutput: "All checks passed",
            explanation:
              "Run this after defining average_wait. Each assert checks behaviour. An incorrect result raises AssertionError rather than quietly accepting an invalid report.",
          },
        },
        {
          type: "callout",
          tone: "debug",
          title: "Read the traceback from the last line",
          text: "NameError usually means a name has not been defined in the current execution. IndentationError points to malformed block structure. A traceback includes the error type and the line that failed; inspect those before changing unrelated code.",
        },
      ],
    },
    {
      id: "industry",
      title: "4. From one interval to a daily report",
      blocks: [
        {
          type: "case",
          study: {
            context:
              "A reporting analyst combines two contact-centre intervals.",
            problem:
              "Interval A has 2 calls and 60 waiting seconds. Interval B has 8 calls and 400 waiting seconds. Averaging their interval averages gives (30 + 50) / 2 = 40, which gives a small interval too much influence.",
            solution:
              "Add waiting seconds and calls first: average_wait(460, 10) = 46.0 seconds. This is the call-weighted average.",
            limitations:
              "The calculation assumes the intervals use the same definition, units and population. Cumulative snapshots cannot be summed as if they were disjoint intervals.",
          },
        },
        {
          type: "code",
          example: {
            source:
              "seconds = [60, 400]\nanswered = [2, 8]\ndaily_wait = average_wait(sum(seconds), sum(answered))\nprint(daily_wait)",
            expectedOutput: "46.0",
            explanation:
              "sum() combines the totals before the rule is applied. Keep full precision for calculations; round only at the presentation boundary.",
          },
        },
      ],
    },
    {
      id: "practice",
      title: "5. Apply the idea",
      blocks: [
        {
          type: "paragraph",
          text: "Implement average_wait yourself in the laboratory. Test zero calls, a whole-number average and a fractional average. Then explain why returning a number is more useful than printing inside the function: the caller can format it, compare it against a target, store it or combine it with another calculation.",
        },
        {
          type: "callout",
          tone: "note",
          title: "Next investigation",
          text: "How would you represent an undefined average in an exported report? Consider None, an empty field, and an explicit status column. Choose a convention that downstream consumers can distinguish from a real zero.",
        },
      ],
    },
  ],
  summary: [
    "Functions capture a reusable rule behind a descriptive name.",
    "return passes data to the caller; print writes output.",
    "Boundary cases require a documented policy.",
    "Aggregate numerators and denominators before computing a weighted average.",
  ],
  glossary: [
    { term: "Argument", definition: "A value supplied to a function call." },
    {
      term: "Guard clause",
      definition: "An early condition that handles a boundary or invalid case.",
    },
    {
      term: "Contract",
      definition: "The assumptions and guarantees at a function boundary.",
    },
  ],
  references: [
    {
      id: "py-functions",
      title: "Python tutorial: defining functions",
      url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
    },
    {
      id: "py-builtins",
      title: "Python built-in functions",
      url: "https://docs.python.org/3/library/functions.html",
    },
  ],
  assessment: {
    id: "functions-check",
    version: 1,
    title: "Check your understanding",
    questions: [
      {
        id: "return",
        kind: "single",
        prompt:
          "What does a function return when it reaches the end without return?",
        options: ["0", "None", "The last printed value"],
        answer: [1],
        hint: "Displaying output does not create a return value.",
        explanation:
          "Python returns None when execution finishes without an explicit return.",
      },
      {
        id: "valid",
        kind: "multiple",
        prompt: "Which calls produce 30.0 with the sample function?",
        options: [
          "average_wait(150, 5)",
          "average_wait(60, 2)",
          "average_wait(30, 0)",
        ],
        answer: [0, 1],
        hint: "Apply the guard clause before dividing.",
        explanation:
          "150 / 5 and 60 / 2 are both 30.0; the zero-count guard returns 0.",
      },
      {
        id: "keyword",
        kind: "short",
        prompt: "Which Python keyword passes a value back to the caller?",
        accepted: ["return"],
        hint: "It also ends the current function call.",
        explanation: "return passes the result back to the caller.",
      },
      {
        id: "implement",
        kind: "code",
        prompt:
          "Write average_wait(total_seconds, calls). Return 0 for zero calls; otherwise return the quotient.",
        starter:
          "def average_wait(total_seconds, calls):\n    # Replace this body\n    pass",
        tests:
          "assert average_wait(150, 5) == 30\nassert average_wait(0, 0) == 0\nassert average_wait(7, 2) == 3.5\nassert average_wait(800, 10) == 80",
        hint: "Use an if guard for calls == 0, followed by division.",
      },
    ],
  },
};
export const courses: Course[] = [
  {
    id: "python",
    version: 1,
    title: "Python for practical problem solving",
    category: "Programming",
    level: "Beginner",
    description:
      "Think clearly, write reusable code, and turn everyday data into reliable answers.",
    outcomes: chapter.objectives.map((x) => x.text),
    prerequisites: chapter.prerequisites,
    skills: ["Python", "Functions", "Testing", "Data reasoning"],
    minutes: pythonChapters.reduce((total, c) => total + c.minutes, chapter.minutes),
    status: "Sample chapter",
    color: "blue",
    symbol: "Py",
    editor: "Self Learning editorial • Progressive curriculum, v2",
    modules: [
      {
        id: "building-blocks",
        title: "Reusable building blocks",
        chapters: [...pythonChapters.slice(0, 6), chapter, ...pythonChapters.slice(6)],
      },
    ],
    references: chapter.references,
  },
  ...[["sql","SQL","Data","SQL","lavender","Relational queries, joins, modeling and optimization."],["excel","Microsoft Excel","Analytics","XL","green","Formulas, tables, Power Query, dashboards and automation."],["power-bi","Power BI","Analytics","BI","sand","Data models, DAX, reporting and governance."],["automation","Workflow Automation","Automation","Auto","rose","Reliable workflows, APIs, monitoring and error recovery."],["dsa","Data Structures & Algorithms","Programming","DSA","blue","Complexity, structures, algorithms and problem solving."],["javascript","JavaScript","Web Development","JS","sand","Language fundamentals, DOM, async programming and testing."],["react","React","Web Development","React","blue","Components, hooks, state, accessibility and routing."],["nextjs","Next.js","Web Development","Next","lavender","App Router, server rendering, caching and deployment."],["genai","Generative AI","AI & Machine Learning","AI","rose","LLMs, prompting, RAG, evaluation and responsible deployment."],["devops","DevOps","Cloud & DevOps","Ops","green","CI/CD, containers, Kubernetes, observability and reliability."],["html","HTML","Web Development","HTML","sand","Semantic markup, forms, accessibility and document structure."],["css","CSS","Web Development","CSS","blue","Responsive layouts, Grid, Flexbox and modern styling."],["tailwind","Tailwind CSS","Web Development","TW","lavender","Utility-first styling, design tokens and responsive interfaces."],["nodejs","Node.js","Backend","Node","green","Runtime fundamentals, async I/O and secure services."],["express","Express","Backend","API","sand","REST APIs, middleware, validation and authentication."],["mongodb","MongoDB","Databases","DB","green","Documents, queries, indexes, aggregation and data modeling."],["n8n","n8n Automation","Automation","n8n","rose","Event-driven workflows, integrations, AI agents and operations."],["data-analytics","Data Analytics","Analytics","DA","blue","Data cleaning, analysis, visualization and communication."],["system-design","System Design","Architecture","SYS","lavender","Scalability, trade-offs, distributed systems and resilience."],["performance-marketing","Performance Marketing","Digital Business","PM","rose","Measurement, attribution, experimentation and growth systems."],["instagram-content","Content Creation & Growth","Digital Business","CG","sand","Editorial planning, content production, analytics and ethics."],["react-native","React Native","Mobile Development","RN","blue","Cross-platform UI, navigation, state and mobile delivery."],["typescript","TypeScript","Web Development","TS","blue","Types, generics, narrowing and scalable application design."],["angular","Angular","Web Development","NG","rose","Components, signals, dependency injection and routing."],["ui-ux","UI & UX Design","Design","UX","lavender","Research, interaction design, accessibility and prototyping."],["claude-code","AI Coding Agents","AI & Machine Learning","Code","sand","Agent workflows, tools, MCP, evaluation and secure coding."],["cybersecurity","Cybersecurity","Security","SEC","rose","Defensive security, risk, identity and secure engineering."],["soc","Security Operations","Security","SOC","lavender","SIEM, triage, detection engineering and incident response."],["java-spring","Java & Spring Boot","Backend","Java","sand","Java fundamentals, Spring services, persistence and security."],["machine-learning","Machine Learning Engineering","AI & Machine Learning","ML","blue","Model development, validation, deployment and monitoring."],["linux","Linux","Cloud & DevOps","Linux","green","Shell, processes, networking, administration and security."],["agentic-ai","Agentic AI Engineering","AI & Machine Learning","Agent","rose","Tool-using agents, orchestration, memory, safety and evaluation."],["cpp","C++ Programming","Programming","C++","lavender","Modern C++, STL, ownership, performance and testing."],["data-science","Data Science","Analytics","DS","green","Statistics, experiments, data pipelines and predictive models."]].map(([id, title, category, symbol, color, description]) => ({
    id, title, category, symbol, color, description,
    version: 1,
    level: "Beginner" as const,
    outcomes: ["Curriculum in preparation; lessons are not yet available."],
    prerequisites: [],
    skills: [category],
    minutes: 0,
    status: "Catalog preview" as const,
    editor: "Self Learning editorial",
    modules: [],
    references: [],
  })),
];
export const chapterRegistry = courses.flatMap((course) =>
  course.modules.flatMap((module) =>
    module.chapters.map((chapter) => ({ course, module, chapter })),
  ),
);
export const findChapter = (id: string | undefined) =>
  chapterRegistry.find((item) => item.chapter.id === id);
