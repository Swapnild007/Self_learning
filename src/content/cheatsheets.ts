export interface CheatSheetSection {
  title: string;
  items: Array<{ label: string; value: string; note?: string }>;
}

export interface CheatSheet {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  accent: string;
  sections: CheatSheetSection[];
}

export const cheatSheets: CheatSheet[] = [
  {
    id: "python-core",
    title: "Python Core",
    category: "Python",
    description: "Everyday syntax, collections, functions, comprehensions, exceptions and file work.",
    tags: ["python", "syntax", "functions", "collections"],
    accent: "Py",
    sections: [
      {
        title: "Collections",
        items: [
          { label: "List", value: "items = [1, 2, 3]" },
          { label: "Tuple", value: "point = (10, 20)" },
          { label: "Set", value: "unique = {1, 2, 3}" },
          { label: "Dictionary", value: "user = {'id': 7, 'name': 'Asha'}" },
        ],
      },
      {
        title: "Useful patterns",
        items: [
          { label: "Comprehension", value: "[x * 2 for x in items if x > 0]" },
          { label: "Enumerate", value: "for i, value in enumerate(items):" },
          { label: "Zip", value: "for left, right in zip(a, b):" },
          { label: "Safe lookup", value: "user.get('name', 'Unknown')" },
        ],
      },
      {
        title: "Functions & errors",
        items: [
          { label: "Function", value: "def score(value: float) -> float:" },
          { label: "Keyword args", value: "build(limit=10, strict=True)" },
          { label: "Exception", value: "try: ...\nexcept ValueError as err: ..." },
          { label: "Context manager", value: "with open(path) as file:" },
        ],
      },
    ],
  },
  {
    id: "rag-engineering",
    title: "RAG Engineering",
    category: "AI",
    description: "The production retrieval loop from ingestion to grounded answer evaluation.",
    tags: ["rag", "retrieval", "embeddings", "reranking", "citations"],
    accent: "RAG",
    sections: [
      {
        title: "Pipeline",
        items: [
          { label: "1 · Parse", value: "Source → clean text + metadata" },
          { label: "2 · Chunk", value: "Split by semantic/document structure" },
          { label: "3 · Index", value: "Embeddings + lexical index + metadata" },
          { label: "4 · Retrieve", value: "Dense / sparse / hybrid search" },
          { label: "5 · Rerank", value: "Reorder the candidate evidence" },
          { label: "6 · Generate", value: "Answer only from selected evidence" },
        ],
      },
      {
        title: "Quality checks",
        items: [
          { label: "Retrieval recall", value: "Did the correct evidence enter top-k?" },
          { label: "Precision", value: "How much retrieved context is actually useful?" },
          { label: "Grounding", value: "Does each answer claim map to evidence?" },
          { label: "Abstention", value: "Can the system say 'not enough evidence'?" },
        ],
      },
      {
        title: "Common failures",
        items: [
          { label: "Bad chunks", value: "Context broken across arbitrary boundaries" },
          { label: "Stale index", value: "Source changed but embeddings did not" },
          { label: "Permission leak", value: "Retriever ignores user/document access" },
          { label: "Prompt injection", value: "Retrieved text treated as authority" },
        ],
      },
    ],
  },
  {
    id: "mcp",
    title: "MCP",
    category: "AI",
    description: "Model Context Protocol primitives, trust boundaries and tool integration.",
    tags: ["mcp", "tools", "resources", "prompts", "agents"],
    accent: "MCP",
    sections: [
      {
        title: "Architecture",
        items: [
          { label: "Host", value: "Application that coordinates the model experience" },
          { label: "Client", value: "Connection from host to one MCP server" },
          { label: "Server", value: "Exposes capabilities over MCP" },
          { label: "Transport", value: "How client/server messages move" },
        ],
      },
      {
        title: "Primitives",
        items: [
          { label: "Tools", value: "Actions the model may invoke" },
          { label: "Resources", value: "Context/data the client may read" },
          { label: "Prompts", value: "Reusable prompt templates/workflows" },
        ],
      },
      {
        title: "Security",
        items: [
          { label: "Least privilege", value: "Expose only required capabilities" },
          { label: "Validate args", value: "Never trust model-supplied tool input" },
          { label: "Confirm effects", value: "Require approval for risky side effects" },
          { label: "Audit", value: "Record tool calls, result and principal" },
        ],
      },
    ],
  },
  {
    id: "n8n-ai",
    title: "n8n for AI",
    category: "Automation",
    description: "AI workflows, RAG, agents, MCP, retries and production operations.",
    tags: ["n8n", "automation", "agents", "rag", "mcp"],
    accent: "n8n",
    sections: [
      {
        title: "Workflow building blocks",
        items: [
          { label: "Trigger", value: "Webhook / schedule / app event" },
          { label: "Transform", value: "Expressions + structured mapping" },
          { label: "Branch", value: "IF / Switch / routing rules" },
          { label: "Recover", value: "Retries + error workflows + idempotency" },
        ],
      },
      {
        title: "AI stack",
        items: [
          { label: "Chat model", value: "Model node / provider connection" },
          { label: "Agent", value: "Model + tools + control loop" },
          { label: "Memory", value: "Conversation/context persistence" },
          { label: "RAG", value: "Loader → split → embed → vector store → retrieve" },
          { label: "MCP", value: "Expose or consume tools via MCP" },
        ],
      },
      {
        title: "Production",
        items: [
          { label: "Credentials", value: "Keep secrets in credential store" },
          { label: "Queue mode", value: "Scale execution workers" },
          { label: "Observability", value: "Execution logs + traces + alerts" },
          { label: "Human approval", value: "Gate destructive/high-risk actions" },
        ],
      },
    ],
  },
  {
    id: "react-next",
    title: "React + Next.js",
    category: "Web Development",
    description: "Component thinking, state, server/client boundaries and routing.",
    tags: ["react", "nextjs", "frontend", "server components"],
    accent: "R/N",
    sections: [
      {
        title: "React",
        items: [
          { label: "Component", value: "UI = function of props + state" },
          { label: "State", value: "Keep the minimal source of truth" },
          { label: "Effect", value: "Synchronize with external systems only" },
          { label: "Key", value: "Stable identity for list items" },
        ],
      },
      {
        title: "Next.js",
        items: [
          { label: "Route", value: "File-system route segment" },
          { label: "Server component", value: "Fetch/render on server by default" },
          { label: "Client component", value: "'use client' for browser interactivity" },
          { label: "Mutation", value: "Server action or API route with validation" },
        ],
      },
      {
        title: "Production checks",
        items: [
          { label: "Auth", value: "Authorize on trusted server boundary" },
          { label: "Caching", value: "Understand cache scope and invalidation" },
          { label: "Performance", value: "Images, code splitting, render cost" },
          { label: "A11y", value: "Semantic HTML + keyboard + focus" },
        ],
      },
    ],
  },
  {
    id: "sql",
    title: "SQL",
    category: "Data",
    description: "Query order, joins, aggregation, windows and performance reminders.",
    tags: ["sql", "postgresql", "analytics", "joins"],
    accent: "SQL",
    sections: [
      {
        title: "Query shape",
        items: [
          { label: "Order", value: "SELECT → FROM/JOIN → WHERE → GROUP BY → HAVING → ORDER BY" },
          { label: "Aggregate", value: "COUNT / SUM / AVG / MIN / MAX" },
          { label: "Window", value: "SUM(x) OVER (PARTITION BY ... ORDER BY ...)" },
        ],
      },
      {
        title: "Join choice",
        items: [
          { label: "INNER", value: "Only matching rows" },
          { label: "LEFT", value: "Keep every row from left side" },
          { label: "FULL", value: "Keep all rows from both sides" },
        ],
      },
      {
        title: "Performance",
        items: [
          { label: "Index", value: "Support selective filters/joins/order" },
          { label: "Explain", value: "Inspect the actual query plan" },
          { label: "Avoid", value: "SELECT * in production queries" },
        ],
      },
    ],
  },
  {
    id: "power-bi-dax",
    title: "Power BI + DAX",
    category: "Analytics",
    description: "Modeling, filter context, measures, CALCULATE and dashboard quality.",
    tags: ["power bi", "dax", "power query", "data model"],
    accent: "PBI",
    sections: [
      {
        title: "Model first",
        items: [
          { label: "Fact table", value: "Events/transactions at a defined grain" },
          { label: "Dimensions", value: "Who / what / where / when context" },
          { label: "Relationship", value: "Prefer clear one-to-many star patterns" },
        ],
      },
      {
        title: "DAX",
        items: [
          { label: "Measure", value: "Total Sales = SUM(Sales[Amount])" },
          { label: "CALCULATE", value: "Change filter context for an expression" },
          { label: "DIVIDE", value: "Safe division with alternate result" },
          { label: "Time", value: "Use a proper date table for time intelligence" },
        ],
      },
      {
        title: "Report quality",
        items: [
          { label: "Question first", value: "Each visual answers a business question" },
          { label: "Hierarchy", value: "KPI → trend → driver → detail" },
          { label: "Performance", value: "Reduce unnecessary visuals and model columns" },
        ],
      },
    ],
  },
  {
    id: "excel",
    title: "Excel Analysis",
    category: "Analytics",
    description: "High-value formulas, tables, pivots, Power Query and modeling patterns.",
    tags: ["excel", "power query", "pivot", "formulas"],
    accent: "XL",
    sections: [
      {
        title: "Formulas",
        items: [
          { label: "Lookup", value: "XLOOKUP(key, lookup_array, return_array)" },
          { label: "Conditional", value: "SUMIFS / COUNTIFS / AVERAGEIFS" },
          { label: "Dynamic", value: "FILTER / SORT / UNIQUE" },
          { label: "Readable", value: "LET(name, value, calculation)" },
        ],
      },
      {
        title: "Analysis",
        items: [
          { label: "Table", value: "Convert ranges to structured Excel Tables" },
          { label: "Pivot", value: "Group, aggregate and slice quickly" },
          { label: "Power Query", value: "Repeatable import + clean + reshape" },
        ],
      },
      {
        title: "Model hygiene",
        items: [
          { label: "Inputs", value: "Separate assumptions from calculations" },
          { label: "Checks", value: "Add reconciliation and error flags" },
          { label: "Documentation", value: "Name units, grain and business logic" },
        ],
      },
    ],
  },
  {
    id: "security-audit-14",
    title: "Security Audit 14",
    category: "Security",
    description: "The mandatory security gate used across our GitHub applications.",
    tags: ["security", "owasp", "github", "audit"],
    accent: "14",
    sections: [
      {
        title: "Trusted boundary",
        items: [
          { label: "Access", value: "Admin + roles checked server-side" },
          { label: "Secrets", value: "No privileged secrets in browser bundles" },
          { label: "Business rules", value: "Money/entitlement validated server-side" },
          { label: "Auth abuse", value: "OTP/login throttled" },
        ],
      },
      {
        title: "Application hardening",
        items: [
          { label: "Injection", value: "Parameterized DB + safe command construction" },
          { label: "Browser", value: "XSS/CSRF/CORS/security headers" },
          { label: "Uploads", value: "Allowlist type/size/content/name/storage" },
          { label: "Sessions", value: "Secure cookies/tokens + expiry/revocation" },
        ],
      },
      {
        title: "Operations",
        items: [
          { label: "Supply chain", value: "Lockfiles + immutable CI Actions" },
          { label: "Logging", value: "Security events without secret leakage" },
          { label: "Fail closed", value: "Safe errors and default deny" },
          { label: "Least privilege", value: "Minimum runtime/cloud/database/CI rights" },
        ],
      },
    ],
  },
];

export const cheatSheetCategories = [
  "All",
  ...Array.from(new Set(cheatSheets.map((sheet) => sheet.category))).sort(),
];
