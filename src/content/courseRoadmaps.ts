/** Original course outlines. These are future lesson titles, not published chapters. */
export interface RoadmapModule { title: string; topics: string[] }
const outlines: Record<string, string[]> = {
  "calculus-computing": [
    "Functions and change|Limits and continuity|Derivatives as rates|Optimization and approximation",
    "Accumulation|Definite integrals|Numerical integration|Continuous models in computing",
    "Multivariable ideas|Partial derivatives|Gradients|Optimization landscapes and sensitivity",
  ],
  "linear-algebra": [
    "Vectors and geometry|Vector spaces|Dot products and projections|Linear independence and basis",
    "Matrices and transformations|Matrix multiplication|Rank and systems of equations|Inverse and conditioning",
    "Structure and applications|Eigenvalues and eigenvectors|Orthogonality|Least squares and dimensionality",
  ],
  "discrete-math": [
    "Logic and proof|Propositions and predicates|Direct proof and contradiction|Mathematical induction",
    "Discrete structures|Sets and relations|Functions and equivalence|Counting and combinatorics",
    "Graphs and reasoning|Trees and graphs|Connectivity and paths|Recurrences and asymptotic arguments",
  ],
  "probability-statistics": [
    "Probability foundations|Sample spaces and events|Conditional probability|Bayes rule and independence",
    "Random variables|Discrete and continuous distributions|Expectation and variance|Concentration intuition",
    "Inference for computing|Sampling and estimation|Confidence and uncertainty|Experiments and model evaluation",
  ],
  "computer-architecture": [
    "Representation and logic|Bits, integers and floating point|Boolean logic|Combinational and sequential circuits",
    "From instructions to execution|ISA concepts|Assembly and calling conventions|Datapaths and control",
    "Memory and performance|Caches and locality|Virtual memory interface|Pipelining and performance trade-offs",
  ],
  "operating-systems": [
    "Process abstraction|Processes and threads|System calls|Scheduling and context switching",
    "Concurrency and memory|Synchronization|Deadlock|Virtual memory and address spaces",
    "Persistent and protected systems|Filesystems|Isolation and permissions|Failure, recovery and observability",
  ],
  "computer-networks": [
    "Network foundations|Layering and encapsulation|Ethernet and IP|Addressing and routing",
    "Transport and applications|TCP and UDP|Congestion and reliability|DNS and HTTP",
    "Modern network engineering|TLS and trust|Performance measurement|Distributed failure and debugging",
  ],
  "database-systems": [
    "Data models and relational foundations|Relational algebra|Schemas and constraints|Normalization",
    "Query execution|SQL semantics|Indexes and access paths|Query planning and optimization",
    "Transactions and storage|ACID and isolation|Concurrency control|Recovery, replication and scale",
  ],
  "programming-languages": [
    "Meaning and abstraction|Syntax versus semantics|Environments and scope|Functions and closures",
    "Programming paradigms|Imperative and functional models|Types and polymorphism|Mutation and effects",
    "Language implementation|Parsing|Interpreters and evaluation|Runtime representation and garbage collection",
  ],
  "theory-computation": [
    "Automata and languages|Finite automata|Regular languages|Context-free grammars and pushdown automata",
    "Computability|Turing machines|Decidability|Reductions and undecidable problems",
    "Complexity|Time and space|P, NP and completeness|Limits of efficient computation",
  ],
  "software-engineering": [
    "Construct software deliberately|Specifications and invariants|Testing and coverage|Abstraction and modularity",
    "Design for change|Interfaces and data types|Concurrency and race conditions|Version control and review",
    "Build in teams|Architecture and trade-offs|Observability and release discipline|Ethics, maintainability and documentation",
  ],
  "distributed-systems": [
    "Distributed foundations|Time, ordering and partial failure|RPC and messaging|Replication",
    "Consistency and coordination|Consensus intuition|Leader election|Transactions across services",
    "Resilient platforms|Partitioning and rebalancing|Fault tolerance|Observability, recovery and chaos testing",
  ],
  hci: [
    "Understand users and tasks|Human capabilities and limitations|Task analysis|Research ethics",
    "Design and prototype|Interaction models|Information architecture|Accessible prototypes",
    "Evaluate with evidence|Usability testing|Experimental design|Iteration and design rationale",
  ],
  "cs-capstone": [
    "Frame the problem|Stakeholders and requirements|Literature and prior art|Success metrics and ethics",
    "Build and investigate|System design|Implementation and experiments|Testing, measurement and iteration",
    "Defend the work|Results and limitations|Technical report|Demonstration, presentation and retrospective",
  ],
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
    "Workflow foundations|Triggers and webhooks|Expressions and data mapping|Credentials|Execution history|Sub-workflows",
    "API and automation engineering|HTTP Request|Pagination|Branching|Retries|Idempotency|Error workflows|Human approval",
    "AI in n8n|Chat models|Basic LLM chains|Tools agents|Memory|Structured outputs|Human-in-the-loop tool calls",
    "RAG in n8n|Document loaders|Text splitters|Embeddings|Vector stores|Retrievers|Rerankers|Grounded Q&A",
    "MCP and agent integration|MCP client tools|n8n MCP server|Workflow tools|Tool permissions|Agent-to-workflow boundaries",
    "Evaluation and operations|Light and metric evaluations|Tracing|Logs|OpenTelemetry|Queue mode|Concurrency|Scaling",
    "Secure self-hosting|Docker|Secrets|SSRF protection|User management|2FA|Encryption keys|Security audit|Backups",
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
  "rag-engineering": [
    "Retrieval foundations|RAG architecture|Document loaders and parsing|Chunking strategies|Metadata design",
    "Search quality|Embeddings and dense retrieval|Keyword and hybrid retrieval|Filters|Reranking and query rewriting",
    "Grounded generation|Prompt assembly|Context windows|Citations|Answerability and abstention",
    "Production RAG|Evaluation datasets|Retrieval metrics|Latency and cost|Freshness, permissions and observability",
  ],
  "embeddings-vector-db": [
    "Embedding foundations|Vector representations|Cosine, dot product and distance|Dimensionality and normalization",
    "Vector indexing|Approximate nearest neighbors|Index trade-offs|Metadata filtering|Namespaces and multi-tenancy",
    "Vector stores|PGVector, Qdrant, Pinecone and alternatives|Ingestion|Updates and deletion|Operational trade-offs",
  ],
  "transformers-llm-internals": [
    "Language model foundations|Tokens and vocabularies|Embeddings and positions|Autoregressive prediction",
    "Transformer mechanics|Queries, keys and values|Multi-head attention|Feed-forward blocks|Residuals and normalization",
    "Training and inference|Pretraining objectives|Context windows|KV cache|Sampling, temperature and decoding",
    "Scaling and limits|Compute and memory|Quantization|Hallucination|Model families and architecture trade-offs",
  ],
  "prompt-engineering": [
    "Instruction design|Task framing|Constraints|Examples|System versus user context",
    "Structured generation|Schemas and JSON|Few-shot patterns|Reasoning scaffolds|Tool-aware prompting",
    "Context engineering|Document selection|Context ordering|Compression|Prompt injection boundaries",
    "Prompt evaluation|Test sets|Regression tests|Robustness|Latency and token-cost trade-offs",
  ],
  "llm-evaluation": [
    "Evaluation design|Task definitions|Golden datasets|Human rubrics|Offline versus online evaluation",
    "Metrics and judges|Exact/task metrics|Semantic scoring|LLM-as-judge|Pairwise comparison|Calibration",
    "Observability|Traces|Prompt/model versions|Latency|Cost|Failure clustering",
    "Production quality|Regression gates|A/B tests|Drift|Incident review|Evaluation-driven development",
  ],
  "llm-finetuning": [
    "Adaptation decisions|Prompting versus retrieval versus tuning|Dataset quality|Train/validation splits",
    "Fine-tuning methods|Supervised fine-tuning|Adapters and LoRA|Preference data|Alignment concepts",
    "Evaluation and operations|Overfitting|Safety regressions|Model versioning|Serving adapted models",
  ],
  mcp: [
    "Protocol model|Hosts, clients and servers|Capabilities|Lifecycle and transports|Trust boundaries",
    "MCP primitives|Tools|Resources|Prompts|Discovery and schemas",
    "Build integrations|Server implementation|Client integration|Authentication|Permissions|Error handling",
    "Operate safely|Tool confirmation|Least privilege|Untrusted content|Audit logs|Testing and version compatibility",
  ],
  "ai-tools-function-calling": [
    "Tool contracts|Typed schemas|Descriptions and arguments|Structured outputs|Validation",
    "Execution loops|Model selection|Tool dispatch|Retries|Timeouts|Idempotency",
    "Safe side effects|Authorization|Confirmation|Rate limits|Audit trail|Failure recovery",
  ],
  "ai-memory": [
    "Memory types|Conversation state|Working memory|Long-term memory|User preferences",
    "Memory architecture|Storage|Retrieval policies|Summarization|Importance and recency",
    "Trust and privacy|Consent|Sensitive facts|Deletion|Memory poisoning|Evaluation",
  ],
  "ai-multimodal": [
    "Multimodal foundations|Vision-language models|Audio and speech|Documents and OCR|Input representation",
    "Application patterns|Image understanding|Document extraction|Voice interfaces|Multimodal RAG",
    "Evaluation and safety|Grounding|Accessibility|Latency|Privacy|Adversarial inputs",
  ],
  "deep-learning": [
    "Neural foundations|Tensors|Forward pass|Losses|Backpropagation|Optimization",
    "Training reliable models|Regularization|Normalization|Initialization|Data pipelines|Experiment tracking",
    "Architectures|CNNs|Sequence models|Attention|Transfer learning|Practical debugging",
  ],
  nlp: [
    "Text foundations|Tokenization|Normalization|Language features|Classical NLP tasks",
    "Representations|Bag-of-words|Embeddings|Sequence models|Transformers",
    "Modern NLP systems|Classification|Extraction|Summarization|Evaluation|Responsible language systems",
  ],
  "computer-vision": [
    "Vision foundations|Pixels and tensors|Augmentation|Image classification|Metrics",
    "Detection and segmentation|CNN backbones|Object detection|Segmentation|Vision transformers",
    "Production vision|Data quality|Robustness|Latency|Monitoring|Privacy and safety",
  ],
  "model-serving": [
    "Inference services|Model APIs|Request contracts|Batching|Streaming|Timeouts",
    "Performance|Quantization|Caching|Concurrency|GPU/CPU trade-offs|Autoscaling",
    "Gateways and reliability|Routing|Fallbacks|Budgets|Observability|Rollouts and rollback",
  ],
  mlops: [
    "Reproducible ML|Experiments|Data/model versions|Feature pipelines|Registries",
    "Delivery|Training pipelines|CI/CD for ML|Serving|Canary and shadow deployments",
    "Operations|Drift|Performance monitoring|Data quality|Retraining triggers|Governance",
  ],
  "ai-security": [
    "AI threat model|Prompt injection|Data exfiltration|Jailbreaks|Tool abuse|Model supply chain",
    "Defensive design|Trust boundaries|Allowlisted tools|Input/output controls|Sandboxing|Secrets",
    "Testing and operations|Red teaming|Adversarial evals|Audit logs|Incident response|Security gates",
  ],
  "local-ai": [
    "Open-weight ecosystem|Model formats|Licensing|Hardware requirements|Runtime options",
    "Efficient inference|Quantization|Context limits|CPU/GPU memory|Local serving",
    "Private applications|Local RAG|Offline agents|Data boundaries|Performance and maintenance",
  ],
  fastapi: [
    "Typed Python APIs|Routes|Pydantic models|Validation|Dependency injection|OpenAPI",
    "Production services|Async work|Databases|Authentication|Authorization|Background tasks",
    "Testing and deployment|Pytest|Contract tests|Containers|Observability|Performance",
  ],
  "api-design": [
    "API contracts|Resources|HTTP semantics|Status codes|Validation|Error shapes",
    "Production API behavior|Pagination|Filtering|Versioning|Idempotency|Rate limits",
    "Reliability and security|Authentication|Authorization|Webhooks|Retries|Documentation|Testing",
  ],
  graphql: [
    "GraphQL model|Schemas|Queries|Mutations|Resolvers|Type system",
    "Application patterns|Pagination|Fragments|Data loaders|Caching|Subscriptions",
    "Operations|Authorization|Complexity limits|N+1 prevention|Monitoring|When REST is better",
  ],
  authentication: [
    "Identity foundations|Passwords|Sessions|Cookies|Tokens|MFA",
    "Modern identity|OAuth 2.0|OpenID Connect|Social login|Passwordless|Account recovery",
    "Authorization|RBAC|ABAC|Resource ownership|Server-side enforcement|Audit",
    "Secure operations|Rate limiting|Session rotation|CSRF|Secrets|Threat modeling",
  ],
  postgresql: [
    "Relational design|Schemas|Constraints|SQL|Joins|Normalization",
    "Performance|Indexes|Query plans|Transactions|Isolation|Locking",
    "Advanced PostgreSQL|JSONB|Full-text search|Extensions|Partitioning|Backups and security",
  ],
  "redis-caching": [
    "Redis data model|Strings|Hashes|Sets|Sorted sets|Expiry",
    "Caching|Cache-aside|Invalidation|TTL design|Stampede prevention|Rate limiting",
    "Coordination|Sessions|Queues|Pub/Sub|Distributed locks|Operations and persistence",
  ],
  "orm-data-access": [
    "Data access foundations|ORM concepts|Schema mapping|Migrations|Transactions",
    "Query quality|N+1 problems|Eager/lazy loading|Pagination|Raw SQL boundaries",
    "Production discipline|Connection pools|Testing|Migrations in CI|Observability|Security",
  ],
  "frontend-state": [
    "State models|Local state|Derived state|URL state|Server state",
    "Data synchronization|Caching|Invalidation|Optimistic updates|Forms|Error recovery",
    "Application architecture|State machines|Global stores|Testing|Performance|Offline patterns",
  ],
  "web-apis-browser": [
    "Browser runtime|DOM|Events|Fetch|URL and history|Storage",
    "Useful Web APIs|Workers|Files|Clipboard|Media|Notifications|Observers",
    "Trust boundaries|Same-origin policy|CORS|CSP|Permissions|Progressive enhancement",
  ],
  "responsive-accessibility": [
    "Responsive systems|Fluid layout|Breakpoints|Container queries|Touch targets",
    "Accessibility foundations|Semantics|Keyboard|Focus|Screen readers|Contrast",
    "Accessible components|Forms|Dialogs|Navigation|Tables|Testing with automated and manual checks",
  ],
  "web-performance-seo": [
    "Performance budgets|Core Web Vitals|Rendering path|Images|Fonts|JavaScript cost",
    "Delivery|Caching|CDN|Code splitting|Lazy loading|Prefetching",
    "SEO and discoverability|Metadata|Structured data|Sitemaps|Robots|Rendering and crawlability",
  ],
  "web-testing": [
    "Testing pyramid|Unit tests|Integration tests|Component tests|Mocks and fixtures",
    "Browser quality|E2E|Visual regression|Accessibility|Cross-browser|Mobile",
    "Production confidence|Contract tests|Load tests|Security tests|CI gates|Flaky-test control",
  ],
  "realtime-web": [
    "Realtime transport|WebSockets|Server-sent events|Polling|Connection lifecycle",
    "State synchronization|Ordering|Presence|Reconnection|Conflict handling",
    "Scale and reliability|Fan-out|Pub/Sub|Backpressure|Authorization|Observability",
  ],
  "queues-background-jobs": [
    "Async architecture|Jobs and workers|Queues|Scheduling|Priorities",
    "Reliable execution|Retries|Backoff|Idempotency|Dead letters|Timeouts",
    "Operations|Concurrency|Rate limits|Monitoring|Recovery|Distributed workflows",
  ],
  "object-storage-cdn": [
    "Object storage|Buckets|Keys|Metadata|Lifecycle|Permissions",
    "Uploads and media|Multipart uploads|Signed URLs|Virus/content checks|Transforms",
    "CDN delivery|Caching|Invalidation|Origins|Private content|Cost and observability",
  ],
  "payments-commerce": [
    "Payment architecture|Checkout|Payment intents|Webhooks|Server-side pricing",
    "Reliability|Idempotency|Retries|Refunds|Subscriptions|Reconciliation",
    "Security|PCI boundaries|Fraud signals|Secrets|Authorization|Audit trails",
  ],
  "docker-containers": [
    "Container foundations|Images|Layers|Dockerfiles|Containers|Registries",
    "Application stacks|Networking|Volumes|Compose|Environment configuration",
    "Production containers|Security|Health checks|Build optimization|Deployment|Operations",
  ],
  "cloud-fundamentals": [
    "Cloud model|Regions|Compute|Storage|Networking|Managed databases",
    "Architecture|IAM|Serverless|Load balancing|Autoscaling|Queues and events",
    "Operate responsibly|Secrets|Monitoring|Backups|Cost awareness|Resilience",
  ],
  observability: [
    "Signals|Logs|Metrics|Traces|Correlation IDs|Structured events",
    "Reliability|SLIs and SLOs|Alert design|Dashboards|Error budgets",
    "Production debugging|Incident response|Root cause analysis|Postmortems|Continuous improvement",
  ],
  "git-github": [
    "Git foundations|Commits|Branches|Merges|Rebase|History",
    "Collaboration|Pull requests|Code review|Issues|Releases|Tags",
    "GitHub engineering|Actions|Protected branches|Secrets|Supply-chain security|Automation",
  ],
  "web-security": [
    "Web threat model|OWASP Top 10|Input trust|Authentication|Authorization",
    "Common attacks|Injection|XSS|CSRF|SSRF|Path traversal|File uploads",
    "Production defenses|Security headers|Secrets|Dependency supply chain|Logging|Security testing",
  ],
  tableau: [
    "Tableau foundations|Connections|Dimensions and measures|Filters|Calculated fields",
    "Visual analytics|Charts|Parameters|Table calculations|Level of detail expressions",
    "Dashboards|Actions|Storytelling|Performance|Publishing and governance",
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
