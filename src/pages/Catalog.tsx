import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Search, SlidersHorizontal } from "lucide-react";
import { courses } from "../content/catalog";
import { courseRoadmaps } from "../content/courseRoadmaps";

const categories = ["All", ...Array.from(new Set(courses.map((course) => course.category))).sort()];

type SortMode = "recommended" | "az" | "ready";

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<SortMode>("recommended");
  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const availability = params.get("content") || "all";

  function update(key: string, value: string) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (!value || value === "All" || value === "all") next.delete(key);
      else next.set(key, value);
      return next;
    });
  }

  const result = useMemo(() => {
    const query = q.trim().toLowerCase();
    const filtered = courses.filter((course) => {
      const roadmap = courseRoadmaps[course.id] || [];
      const searchable = [
        course.title,
        course.description,
        course.category,
        ...course.skills,
        ...course.modules.flatMap((module) =>
          module.chapters.map((chapter) => chapter.title),
        ),
        ...roadmap.flatMap((module) => [module.title, ...module.topics]),
      ]
        .join(" ")
        .toLowerCase();

      const ready = course.modules.some((module) => module.chapters.length > 0);
      return (
        searchable.includes(query) &&
        (category === "All" || category === course.category) &&
        (availability === "all" ||
          (availability === "ready" ? ready : !ready))
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "ready") {
        const aReady = a.modules.some((module) => module.chapters.length > 0) ? 1 : 0;
        const bReady = b.modules.some((module) => module.chapters.length > 0) ? 1 : 0;
        return bReady - aReady || a.title.localeCompare(b.title);
      }
      const aReady = a.modules.some((module) => module.chapters.length > 0) ? 1 : 0;
      const bReady = b.modules.some((module) => module.chapters.length > 0) ? 1 : 0;
      return bReady - aReady;
    });
  }, [q, category, availability, sort]);

  const readyCount = courses.filter((course) =>
    course.modules.some((module) => module.chapters.length > 0),
  ).length;

  return (
    <div className="page sorted-library">
      <header className="sorted-library-header">
        <div>
          <span className="eyebrow">KNOWLEDGE LIBRARY</span>
          <h1>Find the next thing worth learning<span className="blue-dot">.</span></h1>
          <p>
            Search the full curriculum, but clearly separate lessons that are ready
            now from future course blueprints.
          </p>
        </div>
        <div className="sorted-library-counts">
          <span><strong>{readyCount}</strong> ready now</span>
          <span><strong>{courses.length}</strong> mapped subjects</span>
        </div>
      </header>

      <section className="sorted-filter-panel" aria-label="Course filters">
        <label className="search-field sorted-library-search">
          <Search size={18} />
          <input
            aria-label="Search catalog"
            placeholder="Search course, topic, skill, or concept"
            value={q}
            onChange={(event) => update("q", event.target.value)}
          />
        </label>

        <div className="sorted-filter-row">
          <div className="sorted-segmented" aria-label="Content availability">
            <button
              className={availability === "all" ? "selected" : ""}
              onClick={() => update("content", "all")}
              aria-pressed={availability === "all"}
            >
              All
            </button>
            <button
              className={availability === "ready" ? "selected" : ""}
              onClick={() => update("content", "ready")}
              aria-pressed={availability === "ready"}
            >
              Ready now
            </button>
            <button
              className={availability === "planned" ? "selected" : ""}
              onClick={() => update("content", "planned")}
              aria-pressed={availability === "planned"}
            >
              Blueprints
            </button>
          </div>

          <label className="sorted-sort">
            <SlidersHorizontal size={16} />
            <span>Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
              <option value="recommended">Recommended</option>
              <option value="ready">Ready first</option>
              <option value="az">A–Z</option>
            </select>
          </label>
        </div>

        <div className="sorted-category-row" aria-label="Category filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              onClick={() => update("category", item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="sorted-results-heading">
        <div>
          <strong>{result.length}</strong>
          <span>{result.length === 1 ? "result" : "results"}</span>
        </div>
        {(q || category !== "All" || availability !== "all") && (
          <button onClick={() => setParams({})}>Clear filters</button>
        )}
      </div>

      <div className="sorted-course-list">
        {result.map((course) => {
          const chapters = course.modules.flatMap((module) => module.chapters);
          const ready = chapters.length > 0;
          return (
            <Link to={`/course/${course.id}`} className="sorted-course-row" key={course.id}>
              <div className={`sorted-course-icon ${course.color}`}>{course.symbol}</div>
              <div className="sorted-course-copy">
                <div>
                  <span>{course.category}</span>
                  <span>{course.level}</span>
                </div>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <small>{course.skills.slice(0, 4).join(" · ")}</small>
              </div>
              <div className="sorted-course-state">
                <span className={ready ? "ready" : "planned"}>
                  {ready ? "Ready now" : "Blueprint"}
                </span>
                <strong>{ready ? `${chapters.length} chapters` : "Curriculum mapped"}</strong>
                <ArrowRight size={18} />
              </div>
            </Link>
          );
        })}
      </div>

      {!result.length && (
        <div className="panel empty sorted-empty-state">
          <BookOpen size={28} />
          <h2>No matching courses</h2>
          <p>Try another term or clear the current filters.</p>
          <button onClick={() => setParams({})}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
