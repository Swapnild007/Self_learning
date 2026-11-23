import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Compass, Search } from "lucide-react";
import { courses } from "../content/catalog";
import { courseRoadmaps } from "../content/courseRoadmaps";
import { learningPaths } from "../content/learningPaths";
import CourseCard from "../components/CourseCard";

const published = (id: string) =>
  courses.find((course) => course.id === id)?.modules.flatMap((module) => module.chapters).length || 0;

const categories = ["All", ...Array.from(new Set(courses.map((course) => course.category))).sort()];

export default function Catalog() {
  const [params, set] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const level = params.get("level") || "All";
  const availability = params.get("content") || "all";
  const availableCount = courses.filter((course) => course.modules.some((module) => module.chapters.length)).length;
  function update(key: string, value: string) {
    set((previous) => {
      const next = new URLSearchParams(previous);
      if (!value || value === "All" || value === "all") next.delete(key);
      else next.set(key, value);
      return next;
    });
  }
  const query = q.trim().toLowerCase();
  const result = courses.filter((course) => {
    const roadmap = courseRoadmaps[course.id] || [];
    const matches = [course.title, course.description, ...course.skills,
      ...course.modules.flatMap((m) => m.chapters.map((chapter) => chapter.title)),
      ...roadmap.flatMap((module) => [module.title, ...module.topics])
    ].join(" ").toLowerCase().includes(query);
    const hasChapters = course.modules.some((module) => module.chapters.length > 0);
    return matches
      && (category === "All" || category === course.category)
      && (level === "All" || level === course.level)
      && (availability === "all" || (availability === "ready" ? hasChapters : !hasChapters));
  });
  return (
    <div className="page">
      <header className="catalog-intro">
        <div className="eyebrow">THE SELF LEARNING LIBRARY</div>
        <h1>Explore something worth understanding<span className="blue-dot">.</span></h1>
        <p className="lead">Start with an original lesson, inspect a full course outline, or follow a connected learning path. Read, experiment, explain, repeat.</p>
        <div className="catalog-metrics">
          <span><strong>{courses.length}</strong> subjects mapped</span>
          <span><strong>{availableCount}</strong> courses with lessons</span>
          <span><strong>{learningPaths.length}</strong> guided paths</span>
        </div>
        <Link className="button primary" to="/paths"><Compass size={16} /> Browse learning paths <ArrowRight size={16} /></Link>
      </header>
      <div className="catalog-note">
        <BookOpen size={18} />
        <span>Course outlines and published lessons are different. {availableCount} subjects have chapters you can study now; the rest are transparent curriculum blueprints, not empty promises of finished content.</span>
      </div>
      <div className="filter-bar">
        <label className="search-field">
          <Search size={19} />
          <input
            aria-label="Search catalog"
            placeholder="Search courses, topics, concepts or skills"
            value={q}
            onChange={(event) => update("q", event.target.value)}
          />
        </label>
        <label>Level
          <select value={level} onChange={(event) => update("level", event.target.value)}>
            <option>All</option><option>Beginner</option><option>Intermediate</option>
          </select>
        </label>
        <label>Content
          <select aria-label="Filter published courses" value={availability} onChange={(event) => update("content", event.target.value)}>
            <option value="all">All courses</option>
            <option value="ready">Lessons available</option>
            <option value="planned">Curriculum outlines</option>
          </select>
        </label>
      </div>
      <div className="filter-chips catalog-categories" aria-label="Category filters">
        {categories.map((item) => (
          <button className={category === item ? "selected" : ""} key={item}
            onClick={() => update("category", item)} aria-pressed={category === item}>{item}</button>
        ))}
      </div>
      <div className="section-heading">
        <h2>{result.length} {result.length === 1 ? "course" : "courses"} to explore</h2>
        <span className="muted">{result.filter((course) => published(course.id) > 0).length} with lessons to study</span>
      </div>
      <div className="course-grid">
        {result.map((course) => <CourseCard course={course} key={course.id} />)}
      </div>
      {!result.length && <div className="panel empty">
        <h2>No matching courses</h2>
        <p>Search another skill or view the full library.</p>
        <button onClick={() => set({})}>Clear filters</button>
      </div>}
    </div>
  );
}
