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
  ])("rejects invalid imports %j", (value) =>
    expect(() => validate(value)).toThrow(),
  );
  it("grades exact sets, independent of order", () => {
    expect(grade([1, 0], [0, 1])).toBe(true);
    expect(grade([0], [0, 1])).toBe(false);
    expect(grade([0, 1, 2], [0, 1])).toBe(false);
  });
  it("has stable unique sections and only one real sample", () => {
    expect(new Set(chapter.sections.map((s) => s.id)).size).toBe(
      chapter.sections.length,
    );
    expect(courses.filter((c) => c.modules.length)).toHaveLength(1);
    expect(chapter.assessment.questions.map((q) => q.kind)).toEqual([
      "single",
      "multiple",
      "short",
      "code",
    ]);
  });
});
