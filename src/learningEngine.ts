import type { Chapter, Course } from "./content/schema";
import type { Data } from "./store";

export type ChapterState =
  | "not-started"
  | "learning"
  | "experiment"
  | "practice"
  | "review"
  | "mastered";

export interface ChapterEvidence {
  state: ChapterState;
  label: string;
  readPct: number;
  confidenceAverage: number;
  confidenceChecked: number;
  lowConfidence: number;
  score?: number;
  labBest?: number;
  hasLab: boolean;
  action: {
    label: string;
    to: string;
    reason: string;
  };
}

const missionChapters = new Set([
  "python-functions",
  "llm-foundations",
  "llm-embeddings",
  "llm-attention",
  "llm-rag",
]);

export function hasMission(chapterId: string) {
  return missionChapters.has(chapterId);
}

export function chapterEvidence(
  chapter: Chapter,
  data: Data,
): ChapterEvidence {
  const readCount = data.read[chapter.id]?.length || 0;
  const readPct = Math.round(
    (readCount / Math.max(1, chapter.sections.length)) * 100,
  );
  const confidenceValues = chapter.sections
    .map((section) => data.confidence[`${chapter.id}:${section.id}`])
    .filter((value): value is number => typeof value === "number");
  const confidenceAverage = confidenceValues.length
    ? confidenceValues.reduce((sum, value) => sum + value, 0) /
      confidenceValues.length
    : 0;
  const lowConfidence = confidenceValues.filter((value) => value === 1).length;
  const score =
    data.scores[`${chapter.assessment.id}-v${chapter.assessment.version}`];
  const labBest = data.labEvidence[chapter.id]?.best;
  const mission = hasMission(chapter.id);

  if (score === 100) {
    return {
      state: "mastered",
      label: "Mastered",
      readPct,
      confidenceAverage,
      confidenceChecked: confidenceValues.length,
      lowConfidence,
      score,
      labBest,
      hasLab: mission,
      action: {
        label: "Review evidence",
        to: `/practice?chapter=${chapter.id}`,
        reason: "Assessment evidence reached the mastery threshold.",
      },
    };
  }

  if (score !== undefined && score < 100) {
    return {
      state: "review",
      label: "Needs review",
      readPct,
      confidenceAverage,
      confidenceChecked: confidenceValues.length,
      lowConfidence,
      score,
      labBest,
      hasLab: mission,
      action: {
        label: "Retry with feedback",
        to: `/practice?chapter=${chapter.id}`,
        reason:
          score < 60
            ? "The latest assessment shows a foundation gap. Rebuild before advancing."
            : "You are close, but the assessment still contains unresolved errors.",
      },
    };
  }

  if (lowConfidence > 0) {
    return {
      state: "review",
      label: "Needs review",
      readPct,
      confidenceAverage,
      confidenceChecked: confidenceValues.length,
      lowConfidence,
      score,
      labBest,
      hasLab: mission,
      action: {
        label: "Revisit weak section",
        to: `/read/${chapter.id}`,
        reason: `${lowConfidence} section${lowConfidence === 1 ? "" : "s"} marked “Needs another pass.”`,
      },
    };
  }

  if (readPct < 100) {
    return {
      state: readPct > 0 ? "learning" : "not-started",
      label: readPct > 0 ? "Learning" : "Not started",
      readPct,
      confidenceAverage,
      confidenceChecked: confidenceValues.length,
      lowConfidence,
      score,
      labBest,
      hasLab: mission,
      action: {
        label: readPct > 0 ? "Continue lesson" : "Start lesson",
        to: `/read/${chapter.id}`,
        reason:
          readPct > 0
            ? `${readPct}% of the published sections are marked read.`
            : "Build the mental model before testing recall.",
      },
    };
  }

  if (mission && labBest !== 100) {
    return {
      state: "experiment",
      label: "Ready to experiment",
      readPct,
      confidenceAverage,
      confidenceChecked: confidenceValues.length,
      lowConfidence,
      score,
      labBest,
      hasLab: mission,
      action: {
        label: "Run experiment",
        to: `/lab?chapter=${chapter.id}`,
        reason: "Reading is complete; manipulate the concept before assessment.",
      },
    };
  }

  return {
    state: "practice",
    label: "Ready to practice",
    readPct,
    confidenceAverage,
    confidenceChecked: confidenceValues.length,
    lowConfidence,
    score,
    labBest,
    hasLab: mission,
    action: {
      label: "Check understanding",
      to: `/practice?chapter=${chapter.id}`,
      reason:
        mission && labBest === 100
          ? "The lesson and experiment are complete. Retrieval practice is next."
          : "The lesson is complete. Use retrieval practice before moving on.",
    },
  };
}

export function courseNextChapter(course: Course, data: Data) {
  const chapters = course.modules.flatMap((module) => module.chapters);
  return (
    chapters.find((chapter) => chapterEvidence(chapter, data).state !== "mastered") ||
    chapters[chapters.length - 1]
  );
}

export function courseMastery(course: Course, data: Data) {
  const chapters = course.modules.flatMap((module) => module.chapters);
  const evidence = chapters.map((chapter) => chapterEvidence(chapter, data));
  return {
    total: chapters.length,
    mastered: evidence.filter((item) => item.state === "mastered").length,
    review: evidence.filter((item) => item.state === "review").length,
    inProgress: evidence.filter((item) =>
      ["learning", "experiment", "practice"].includes(item.state),
    ).length,
    evidence,
  };
}
