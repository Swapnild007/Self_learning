import { describe, expect, it } from "vitest";
import { courses, chapterRegistry } from "./catalog";
import { learningPaths, resolvePath, publishedCoursesInPath } from "./learningPaths";
import { courseRoadmaps } from "./courseRoadmaps";

describe("editorial curriculum integrity", () => {
  it("keeps every learning path unique and its course references valid", () => {
    expect(new Set(learningPaths.map((path) => path.id)).size).toBe(learningPaths.length);
    for (const path of learningPaths) {
      expect(path.courses.length).toBeGreaterThanOrEqual(4);
      expect(new Set(path.courses).size).toBe(path.courses.length);
      expect(resolvePath(path).map((course) => course.id)).toEqual(path.courses);
      expect(publishedCoursesInPath(path)).toBeGreaterThanOrEqual(0);
      expect(publishedCoursesInPath(path)).toBeLessThanOrEqual(path.courses.length);
    }
  });
  it("does not present a planned subject as authored learning", () => {
    const planned = courses.filter((course) => course.modules.every((module) => module.chapters.length === 0));
    expect(planned.length).toBeGreaterThan(0);
    for (const course of planned) {
      const roadmap = courseRoadmaps[course.id];
      expect(roadmap, "Missing syllabus: " + course.id).toBeDefined();
      expect(roadmap.length).toBeGreaterThanOrEqual(3);
      for (const module of roadmap) {
        expect(module.title.trim().length).toBeGreaterThan(5);
        expect(module.topics.length).toBeGreaterThanOrEqual(3);
        expect(new Set(module.topics).size).toBe(module.topics.length);
      }
    }
  });
  it("makes every authored chapter and assessment individually addressable", () => {
    const ids = chapterRegistry.map((entry) => entry.chapter.id);
    const assessments = chapterRegistry.map((entry) => entry.chapter.assessment.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(assessments).size).toBe(assessments.length);
    for (const entry of chapterRegistry) {
      expect(entry.chapter.sections.length).toBeGreaterThan(0);
      expect(entry.chapter.assessment.questions.length).toBeGreaterThan(0);
    }
  });
});
