import { describe, expect, it } from "vitest";
import { chapter, courses } from "./content/catalog";
import { defaults, type Data } from "./store";
import { chapterEvidence, courseNextChapter } from "./learningEngine";

function data(overrides: Partial<Data> = {}): Data {
  return {
    ...defaults,
    ...overrides,
    read: overrides.read || {},
    scores: overrides.scores || {},
    confidence: overrides.confidence || {},
    labEvidence: overrides.labEvidence || {},
    notes: overrides.notes || {},
    bookmarks: overrides.bookmarks || [],
    visited: overrides.visited || [],
    activity: overrides.activity || [],
    enrolled: overrides.enrolled || [...defaults.enrolled],
    personal: overrides.personal || { ...defaults.personal },
  };
}

describe("learning decision engine", () => {
  it("starts with the lesson mental model", () => {
    const evidence = chapterEvidence(chapter, data());
    expect(evidence.state).toBe("not-started");
    expect(evidence.action.to).toBe("/read/python-functions");
  });

  it("moves from reading to experiment when a mission exists", () => {
    const evidence = chapterEvidence(
      chapter,
      data({
        read: {
          [chapter.id]: chapter.sections.map((section) => section.id),
        },
      }),
    );
    expect(evidence.state).toBe("experiment");
    expect(evidence.action.to).toBe("/lab?chapter=python-functions");
  });

  it("moves from a mastered lab to retrieval practice", () => {
    const evidence = chapterEvidence(
      chapter,
      data({
        read: {
          [chapter.id]: chapter.sections.map((section) => section.id),
        },
        labEvidence: {
          [chapter.id]: { attempts: 1, best: 100, lastRun: 1 },
        },
      }),
    );
    expect(evidence.state).toBe("practice");
    expect(evidence.action.to).toBe("/practice?chapter=python-functions");
  });

  it("prioritizes low confidence before advancement", () => {
    const evidence = chapterEvidence(
      chapter,
      data({
        read: {
          [chapter.id]: chapter.sections.map((section) => section.id),
        },
        confidence: {
          [`${chapter.id}:${chapter.sections[0].id}`]: 1,
        },
      }),
    );
    expect(evidence.state).toBe("review");
    expect(evidence.action.label).toBe("Revisit weak section");
  });

  it("uses failed assessment evidence as remediation", () => {
    const evidence = chapterEvidence(
      chapter,
      data({
        scores: {
          [`${chapter.assessment.id}-v${chapter.assessment.version}`]: 50,
        },
      }),
    );
    expect(evidence.state).toBe("review");
    expect(evidence.action.label).toBe("Retry with feedback");
  });

  it("treats a perfect assessment as mastery", () => {
    const evidence = chapterEvidence(
      chapter,
      data({
        scores: {
          [`${chapter.assessment.id}-v${chapter.assessment.version}`]: 100,
        },
      }),
    );
    expect(evidence.state).toBe("mastered");
  });

  it("selects the first unmastered published chapter in a course", () => {
    const python = courses.find((course) => course.id === "python");
    expect(python).toBeDefined();
    const next = courseNextChapter(python!, data());
    expect(next?.id).toBe(python!.modules[0].chapters[0].id);
  });
});
