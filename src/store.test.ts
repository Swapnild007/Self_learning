import { describe, it, expect } from "vitest";
import { defaults, validate, grade } from "./store";
import { chapter, courses } from "./content/catalog";
describe("learning data contracts", () => {
  it("roundtrips a workspace", () =>
    expect(validate(JSON.parse(JSON.stringify(defaults)))).toEqual(defaults));
  it.each([
    null,
    {},
    { ...defaults, fontSize: 999 },
    { ...defaults, version: 2 },
    { ...defaults, scores: { x: 101 } },
    { ...defaults, notes: { x: 42 } },
    { ...defaults, read: { x: [2] } },
    { ...defaults, confidence: { "chapter:section": 4 } },
    { ...defaults, labEvidence: { mission: { attempts: 1, best: 101, lastRun: 1 } } },
    { ...defaults, personal: { ...defaults.personal, weeklyDays: 4 } },
    { ...defaults, activity: [{ id: "x", type: "bad", subject: "x", at: 1 }] },
  ])("rejects invalid imports %j", (value) =>
    expect(() => validate(value)).toThrow(),
  );
  it("accepts older v1 exports that predate newer learning evidence", () => {
    const legacy = { ...defaults } as Record<string, unknown>;
    delete legacy.confidence;
    delete legacy.labEvidence;
    delete legacy.personal;
    delete legacy.activity;
    expect(validate(legacy).confidence).toEqual({});
    expect(validate(legacy).labEvidence).toEqual({});
    expect(validate(legacy).personal).toEqual(defaults.personal);
    expect(validate(legacy).activity).toEqual([]);
  });
  it("grades exact sets, independent of order", () => {
    expect(grade([1, 0], [0, 1])).toBe(true);
    expect(grade([0], [0, 1])).toBe(false);
    expect(grade([0, 1, 2], [0, 1])).toBe(false);
  });
  it("has stable unique sections and correctly registered authored courses", () => {
    expect(new Set(chapter.sections.map((s) => s.id)).size).toBe(
      chapter.sections.length,
    );
    expect(courses.filter((c) => c.modules.length).length).toBeGreaterThanOrEqual(2);
    expect(new Set(courses.map((c) => c.id)).size).toBe(courses.length);
    expect(chapter.assessment.questions.map((q) => q.kind)).toEqual([
      "single",
      "multiple",
      "short",
      "code",
    ]);
  });
});
