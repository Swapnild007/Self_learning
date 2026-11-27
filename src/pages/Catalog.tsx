import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Pin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { courses } from "../content/catalog";
import { courseRoadmaps } from "../content/courseRoadmaps";
import { cheatSheets, cheatSheetCategories } from "../content/cheatsheets";
import { useStore } from "../store";

const categories = ["All", ...Array.from(new Set(courses.map((course) => course.category))).sort()];
type SortMode = "recommended" | "az" | "ready";
type LibraryView = "courses" | "cheatsheets";

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<SortMode>("recommended");
  const { data } = useStore();
  const view = (params.get("view") === "cheatsheets" ? "cheatsheets" : "courses") as LibraryView;
  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const availability = params.get("content") || "all";

  function update(key: string, value: string) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (!value || value === "All" || value === "all" || (key === "view" && value === "courses")) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      if (key === "view") {
        next.delete("category");
        next.delete("content");
        next.delete("q");
      }
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

  const sheetResult = useMemo(() => {
    const query = q.trim().toLowerCase();
    return cheatSheets
      .filter((sheet) => {
        const searchable = [
          sheet.title,
          sheet.category,
          sheet.description,
          ...sheet.tags,
          ...sheet.sections.flatMap((section) => [
            section.title,
            ...section.items.flatMap((item) => [item.label, item.value]),
          ]),
        ]
          .join(" ")
          .toLowerCase();
        return searchable.includes(query) && (category === "All" || category === sheet.category);
      })
      .sort((a, b) => {
        const aPinned = data.pinnedCheatSheets.includes(a.id) ? 1 : 0;
        const bPinned = data.pinnedCheatSheets.includes(b.id) ? 1 : 0;
        return bPinned - aPinned || a.title.localeCompare(b.title);
      });
  }, [q, category, data.pinnedCheatSheets]);

  const readyCount = courses.filter((course) =>
    course.modules.some((module) => module.chapters.length > 0),
  ).length;

  const viewCategories = view === "courses" ? categories : cheatSheetCategories;

  return (
    <div className="page sorted-library">
      <header className="sorted-library-header">
        <div>
          <span className="eyebrow">KNOWLEDGE LIBRARY</span>
          <h1>
            {view === "courses" ? "Build depth" : "Recall fast"}
            <span className="blue-dot">.</span>
          </h1>
          <p>
            {view === "courses"
              ? "Follow full learning paths and published chapters."
              : "Use compact references when you need syntax, architecture, or a mental model quickly."}
          </p>
        </div>
        <div className="sorted-library-counts">
          {view === "courses" ? (
            <>
              <span><strong>{readyCount}</strong> ready now</span>
              <span><strong>{courses.length}</strong> mapped subjects</span>
            </>
          ) : (
            <>
              <span><strong>{cheatSheets.length}</strong> references</span>
              <span><strong>{data.pinnedCheatSheets.length}</strong> pinned</span>
            </>
          )}
        </div>
      </header>

      <div className="library-mode-switch" role="tablist" aria-label="Library mode">
        <button
          role="tab"
          aria-selected={view === "courses"}
          className={view === "courses" ? "selected" : ""}
          onClick={() => update("view", "courses")}
        >
          <BookOpen size={16} /> Courses
        </button>
        <button
          role="tab"
          aria-selected={view === "cheatsheets"}
          className={view === "cheatsheets" ? "selected" : ""}
          onClick={() => update("view", "cheatsheets")}
        >
          <FileText size={16} /> Cheatsheets
        </button>
      </div>

      <section className="sorted-filter-panel" aria-label={view === "courses" ? "Course filters" : "Cheatsheet filters"}>
        <label className="search-field sorted-library-search">
          <Search size={18} />
          <input
            aria-label={view === "courses" ? "Search catalog" : "Search cheatsheets"}
            placeholder={view === "courses" ? "Search course, topic, skill, or concept" : "Search RAG, Python, DAX, SQL, MCP..."}
            value={q}
            onChange={(event) => update("q", event.target.value)}
          />
        </label>

        {view === "courses" && (
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
        )}

        <div className="sorted-category-row" aria-label="Category filters">
          {viewCategories.map((item) => (
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

      {view === "courses" ? (
        <>
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
                <Link to={"/course/" + course.id} className="sorted-course-row" key={course.id}>
                  <div className={"sorted-course-icon " + course.color}>{course.symbol}</div>
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
                    <strong>{ready ? chapters.length + " chapters" : "Curriculum mapped"}</strong>
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
        </>
      ) : (
        <>
          <div className="sorted-results-heading">
            <div>
              <strong>{sheetResult.length}</strong>
              <span>{sheetResult.length === 1 ? "reference" : "references"}</span>
            </div>
            {(q || category !== "All") && (
              <button onClick={() => setParams({ view: "cheatsheets" })}>Clear filters</button>
            )}
          </div>

          <div className="cheat-library-grid">
            {sheetResult.map((sheet) => {
              const pinned = data.pinnedCheatSheets.includes(sheet.id);
              return (
                <Link to={"/cheatsheet/" + sheet.id} className="cheat-library-card" key={sheet.id}>
                  <div className="cheat-library-card-top">
                    <span className="cheat-sheet-mark small">{sheet.accent}</span>
                    {pinned && <span className="cheat-pinned"><Pin size={13} /> Pinned</span>}
                  </div>
                  <span className="eyebrow">{sheet.category}</span>
                  <h2>{sheet.title}</h2>
                  <p>{sheet.description}</p>
                  <div className="tags">
                    {sheet.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="cheat-library-card-foot">
                    <span>{sheet.sections.length} sections</span>
                    <strong>Open reference <ArrowRight size={14} /></strong>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
