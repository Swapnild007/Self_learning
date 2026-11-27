import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { courses } from "../content/catalog";
import CourseCard from "../components/CourseCard";
export default function Catalog() {
  const [params, set] = useSearchParams();
  const q = params.get("q") || "",
    category = params.get("category") || "All",
    level = params.get("level") || "All";
  function update(k: string, v: string) {
    set((p) => {
      p.set(k, v);
      return p;
    });
  }
  const result = courses.filter(
    (c) =>
      (c.title + " " + c.description + " " + c.skills.join(" "))
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (category === "All" || c.category === category) &&
      (level === "All" || c.level === level),
  );
  return (
    <div className="page">
      <div className="eyebrow">FOLLOW YOUR CURIOSITY</div>
      <h1>Find your next possibility.</h1>
      <p className="lead">
        Practical skills. Thoughtful structure. Learning at your pace.
      </p>
      <div className="catalog-note">
        Foundation release · One original Python sample chapter is available.
        Other courses are discovery previews, with no unfinished curriculum
        advertised as complete.
      </div>
      <div className="filter-bar">
        <label className="search-field">
          <Search size={19} />
          <input
            aria-label="Search catalog"
            placeholder="Search courses, skills, or topics"
            value={q}
            onChange={(e) => update("q", e.target.value)}
          />
        </label>
        <label>
          Level
          <select
            value={level}
            onChange={(e) => update("level", e.target.value)}
          >
            <option>All</option>
            <option>Beginner</option>
            <option>Intermediate</option>
          </select>
        </label>
      </div>
      <div className="filter-chips" aria-label="Category filters">
        {["All", "Programming", "Data", "Analytics", "Automation"].map((c) => (
          <button
            className={category === c ? "selected" : ""}
            key={c}
            onClick={() => update("category", c)}
            aria-pressed={category === c}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="section-heading">
        <h2>
          {result.length} {result.length === 1 ? "course" : "courses"} to
          explore
        </h2>
        <span className="muted">Original learning, thoughtfully built</span>
      </div>
      <div className="course-grid">
        {result.map((c) => (
          <CourseCard course={c} key={c.id} />
        ))}
      </div>
      {!result.length && (
        <div className="panel empty">
          <h2>No courses match yet.</h2>
          <p>Try a broader search or another category.</p>
          <button onClick={() => set({})}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
