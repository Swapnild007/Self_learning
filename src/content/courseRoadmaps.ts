/** Original course outlines. These are future lesson titles, not published chapters. */
export interface RoadmapModule { title: string; topics: string[] }
const outlines: Record<string, string[]> = {
  "llm-engineering": [
    "Mathematical foundations|Probability distributions and entropy|Vectors, matrices and cosine similarity|Gradients and optimization",
    "Transformers in practice|Embeddings and positions|Attention explained with numbers|Training, inference and decoding",
    "Useful language-model systems|Retrieval and grounded answers|Tool calling and structured output|Evaluation, privacy and failure analysis",
  ],
  sql: [
    "Relational thinking|Tables, rows and keys|Constraints and missing values|Schemas and normalization",
    "Querying with confidence|Filters, grouping and aggregates|Joins and duplicate rows|CTEs and window functions",
    "Reliable data products|Transactions and consistency|Index selection and query plans|Reproducible reporting project",
  ],
  excel: [
    "Workbook fundamentals|Reliable cell references|Tables and input validation|Dates, numbers and missing data",
    "Analysis workflows|Lookups and conditional logic|Pivot tables and measures|Power Query transformations",
    "Reporting systems|Scenario models and checks|Readable charts and layouts|Auditable dashboard project",
  ],
  "power-bi": [
    "Modeling for decisions|Fact and dimension tables|Relationships and filter direction|Data refresh boundaries",
    "Measures that reconcile|DAX evaluation context|Time intelligence|Totals, blanks and denominator choices",
    "Publish with governance|Accessible report design|Row-level security and permissions|Refresh, review and audit",
  ],
  automation: [
    "Workflow design|Events, triggers and state|Idempotency and retries|Secrets and permissions",
    "Data movement|Transforming structured input|API requests and rate limits|Human review and error queues",
    "Operate safely|Monitoring and alerting|Recovery after partial failure|A documented automation capstone",
  ],
  dsa: [
    "Reasoning about efficiency|Time and space complexity|Arrays, strings and two pointers|Hash maps and sets",
    "Core structures|Stacks and queues|Linked lists, trees and heaps|Graphs and traversal",
    "Algorithmic strategies|Recursion and divide-and-conquer|Greedy choices and counterexamples|Dynamic programming and testing",
  ],
  javascript: [
    "The JavaScript language|Types and coercion|Functions and closures|Arrays and objects",
    "Interactive browser programs|DOM events and forms|Semantic and accessible updates|Modules and browser storage",
    "Asynchronous engineering|Promises and async-await|HTTP requests and error states|Testing and performance",
  ],
  react: [
    "Component thinking|JSX and composition|Props, state and render|Accessible interaction",
    "Application behavior|Effects and derived state|Forms and validation|Routing and data loading",
    "Production patterns|Testing user journeys|Performance and profiling|Error boundaries and deployment",
  ],
  nextjs: [
    "App structure|Routes, layouts and metadata|Server versus client boundaries|Data fetching and caching",
    "Application features|Forms and mutations|Authentication boundaries|Streaming and loading states",
    "Production readiness|Observability and errors|Performance budgets|Release and rollback strategies",
  ],
  genai: [
    "Generative systems|Tasks, models and limitations|Prompt design and evaluation|Structured generation",
    "Grounded applications|Embeddings and document retrieval|Context quality and citations|Tool use and orchestration",
    "Trustworthy delivery|Hallucination and adversarial inputs|Privacy and permission boundaries|Cost, latency and evaluation",
  ],
  devops: [
    "Versioned delivery|Git history and branches|Build artifacts and dependencies|Continuous integration gates",
    "Infrastructure concepts|Containers and networking|Configuration and secrets|Cloud resource boundaries",
    "Operate and recover|Observability and service levels|Deployments and rollback|Incident exercises",
  ],
  html: [
    "Documents with meaning|Semantic elements and headings|Links, images and text alternatives|Page structure and metadata",
    "Useful interactions|Forms, labels and validation|Tables and data relationships|Keyboard and screen-reader journeys",
    "Robust publishing|Responsive image strategies|Performance essentials|Build an accessible information page",
  ],
  css: [
    "The visual system|Cascade and specificity|Box model and sizing|Color, type and contrast",
    "Layouts that adapt|Flexbox and Grid|Fluid dimensions and breakpoints|Responsive navigation",
    "Polish and resilience|Transitions and reduced motion|Design tokens and themes|Accessible component styles",
  ],
  tailwind: [
    "Utility-first workflow|Responsive utilities|Reusable class patterns|Tokens and theme configuration",
    "Interface composition|State and variants|Accessible components|Consistent spacing and typography",
    "Maintainable delivery|Avoiding class duplication|Responsive review|Build a small design system",
  ],
  nodejs: [
    "The server runtime|Event loop and async work|Modules and dependencies|Streams and file I/O",
    "Network services|HTTP lifecycle and routing|Input validation|Error contracts and logging",
    "Production reliability|Testing and instrumentation|Configuration and secrets|Graceful shutdown and deployment",
  ],
  express: [
    "Request-response fundamentals|Routes and middleware|Params, queries and bodies|Status codes and error shape",
    "Trust boundaries|Schema validation|Sessions, identity and authorization|Rate limits and abuse controls",
    "API craftsmanship|Contract and integration tests|Database boundaries|Versioning and operational readiness",
  ],
  mongodb: [
    "Document design|Collections and document shapes|Embedding versus referencing|Validation and constraints",
    "Queries and aggregation|Indexes and query patterns|Aggregation pipelines|Pagination and consistency",
    "Operational decisions|Transactions and write concerns|Backups and access control|Design a data-backed application",
  ],
  n8n: [
    "Visual automation|Triggers and webhook inputs|Expressions and data mapping|Execution history",
    "Connected workflows|HTTP and API credentials|Branching and retries|Human approval steps",
    "Reliable orchestration|Rate limits and partial failures|Monitoring and audit trails|A documented workflow project",
  ],
  "data-analytics": [
    "Questions before charts|Metric definitions and units|Data quality and missingness|Sampling and bias",
    "Evidence and exploration|Distributions and outliers|Grouping and weighted averages|Visual encoding choices",
    "From finding to action|Uncertainty and experiments|Reproducible transformations|Explain an analysis to a decision maker",
  ],
  "system-design": [
    "Understand the requirement|Users, capacity and constraints|Latency and availability budgets|Interface and data contracts",
    "Scale with care|Caching, queues and storage|Replication and consistency|Partitioning and backpressure",
    "Failure-oriented design|Security and threat modeling|Observability and graceful degradation|Defend design trade-offs",
  ],
  "performance-marketing": [
    "Marketing measurement|Objectives and meaningful metrics|Audience hypotheses|Attribution caveats",
    "Experimentation|Creative tests and baselines|Landing-page performance|Statistical interpretation",
    "Sustainable growth|Budget allocation|Data privacy and consent|Reporting with honest uncertainty",
  ],
  "instagram-content": [
    "Editorial strategy|Audience and value proposition|Originality and permissions|Content pillars",
    "Production craft|Visual hierarchy and framing|Scripts and storyboards|Accessible captions",
    "Learn from evidence|Retention and engagement metrics|Ethical experimentation|A repeatable publishing workflow",
  ],
  "react-native": [
    "Mobile interfaces|Components and native primitives|Layouts and gestures|Platform accessibility",
    "State and device features|Navigation and storage|Offline and error handling|Permissions and privacy",
    "Ship responsibly|Testing on physical devices|Performance profiling|Release channels and diagnostics",
  ],
  typescript: [
    "Safer JavaScript|Type inference and annotations|Union types and narrowing|Object contracts",
    "Model expressive APIs|Generics and constraints|Discriminated unions|Typed async results",
    "Engineering at scale|Configuration and module boundaries|Runtime validation|Refactoring with tests",
  ],
  angular: [
    "Component architecture|Templates and bindings|Signals and state|Dependency injection",
    "Application workflows|Routing and navigation|Forms and validation|API communication",
    "Product quality|Accessibility and testing|Change detection and performance|Deployment and observability",
  ],
  "ui-ux": [
    "Understand people|Research questions and ethics|Task analysis|Personas as hypotheses",
    "Design interactions|Information architecture|Wireframes and feedback|Typography, color and accessible systems",
    "Verify usefulness|Usability tests|Prototyping and iteration|Document design rationale",
  ],
  "claude-code": [
    "Coding agent foundations|Tool calls and permissions|Repository context and prompts|MCP boundaries",
    "Engineering workflows|Plan, edit and test loops|Reviewing diffs|Parallel tasks and safe isolation",
    "Agent reliability|Secrets and command safety|Evaluations and failure analysis|Controlled deployment exercises",
  ],
  cybersecurity: [
    "Security thinking|Assets and threat models|Least privilege|Cryptography fundamentals",
    "Defensive engineering|Secure coding practices|Authentication and authorization|Vulnerability management",
    "Respond to evidence|Logging and detection|Incident containment|Recovery and post-incident review",
  ],
  soc: [
    "The analyst workflow|Events, alerts and context|Triage priorities|Evidence handling",
    "Investigation methods|Log correlation and SIEM|Endpoint and network telemetry|Detection rule quality",
    "Response and improvement|Containment decisions|Incident communication|False-positive reduction exercises",
  ],
  "java-spring": [
    "Java fundamentals|Types and collections|Classes, interfaces and generics|Errors and concurrency basics",
    "Spring applications|Dependency injection|HTTP controllers and validation|Persistence and transactions",
    "Production services|Authentication and authorization|Integration testing|Monitoring and release",
  ],
  "machine-learning": [
    "Statistical learning|Data leakage and sampling|Regression and classification|Train, validation and test",
    "Models and metrics|Feature engineering|Loss functions and optimization|Calibration and model evaluation",
    "From model to product|Reproducible experiments|Serving and monitoring|Drift and responsible operations",
  ],
  linux: [
    "Shell literacy|Files and permissions|Pipes and text tools|Processes and signals",
    "Operating a machine|Packages and services|Networking and DNS|Logs and troubleshooting",
    "Safe administration|Users and least privilege|Backups and recovery|Automated maintenance",
  ],
  "agentic-ai": [
    "Agent mechanics|Tools, actions and observations|Planning versus workflows|State and memory boundaries",
    "Reliable execution|Tool contracts and permissions|Retries and checkpoints|Multi-step evaluation",
    "Risk and operations|Prompt injection defenses|Audit and tracing|Human controls and cost limits",
  ],
  cpp: [
    "Modern language core|Types and value categories|Functions and namespaces|Build systems and tooling",
    "Ownership and data structures|RAII and lifetime|Smart pointers|STL containers and algorithms",
    "Systems-quality code|Templates and generic programming|Profiling and concurrency|Testing and sanitizers",
  ],
  "data-science": [
    "Evidence foundations|Sampling and measurement|Probability and inference|Data cleaning and provenance",
    "Model with context|Exploratory visualization|Regression and prediction|Experiment design and uncertainty",
    "Reproducible work|Pipelines and validation|Evaluation and documentation|End-to-end research project",
  ],
};
export const courseRoadmaps: Record<string, RoadmapModule[]> =
  Object.fromEntries(Object.entries(outlines).map(([courseId, items]) => [
    courseId,
    items.map((item) => {
      const [title, ...topics] = item.split("|");
      return { title, topics };
    }),
  ]));
