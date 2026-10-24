import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Course } from "../content/schema";
export default function CourseCard({ course: c }: { course: Course }) {
  return (
    <Link className="course-card" to={`/course/${c.id}`}>
      <div className={`course-art ${c.color}`}>
        <span className="art-grid" />
        <span className="course-symbol">{c.symbol}</span>
        <span className="art-tag">{c.category}</span>
        <ArrowUpRight className="art-arrow" size={22} />
      </div>
      <div className="course-body">
        <div className="meta">
          {c.level} <span>•</span> {c.status}
        </div>
        <h3>{c.title}</h3>
        <p>{c.description}</p>
        <div className="card-foot">
          <span>
            <Clock3 size={14} />
            {c.minutes
              ? `${c.minutes} min sample`
              : "Curriculum in preparation"}
          </span>
          <ArrowUpRight size={17} />
        </div>
      </div>
    </Link>
  );
}
