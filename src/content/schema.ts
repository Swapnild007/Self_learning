export interface LearningObjective {
  id: string;
  text: string;
}
export interface Reference {
  id: string;
  title: string;
  url: string;
}
export interface GlossaryEntry {
  term: string;
  definition: string;
}
export interface SyntaxReference {
  signature: string;
  explanation: string;
}
export interface CodeExample {
  source: string;
  expectedOutput: string;
  explanation: string;
}
export interface IndustryCaseStudy {
  context: string;
  problem: string;
  solution: string;
  limitations: string;
}
export type Block =
  | { type: "paragraph"; text: string }
  | { type: "definition"; term: string; text: string }
  | { type: "code"; example: CodeExample }
  | { type: "syntax"; syntax: SyntaxReference }
  | { type: "table"; headers: string[]; rows: string[][] }
  | {
      type: "callout";
      tone: "note" | "mistake" | "debug";
      title: string;
      text: string;
    }
  | { type: "diagram"; caption: string; steps: string[] }
  | { type: "case"; study: IndustryCaseStudy };
export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}
export interface Exercise {
  id: string;
  prompt: string;
  hint: string;
}
export type Question = Exercise &
  (
    | {
        kind: "single" | "multiple";
        options: string[];
        answer: number[];
        explanation: string;
      }
    | { kind: "short"; accepted: string[]; explanation: string }
    | { kind: "code"; starter: string; tests: string }
  );
export interface Assessment {
  id: string;
  version: number;
  title: string;
  questions: Question[];
}
export interface Chapter {
  id: string;
  version: number;
  title: string;
  introduction: string;
  objectives: LearningObjective[];
  prerequisites: string[];
  minutes: number;
  sections: Section[];
  summary: string[];
  glossary: GlossaryEntry[];
  references: Reference[];
  assessment: Assessment;
}
export interface Module {
  id: string;
  title: string;
  chapters: Chapter[];
}
export interface Course {
  id: string;
  version: number;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate";
  description: string;
  outcomes: string[];
  prerequisites: string[];
  skills: string[];
  minutes: number;
  status: "Sample chapter" | "Catalog preview";
  color: string;
  symbol: string;
  editor: string;
  modules: Module[];
  references: Reference[];
}
