import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Pin, PinOff } from "lucide-react";
import { cheatSheets } from "../content/cheatsheets";
import { useStore } from "../store";

export default function CheatSheetPage() {
  const { id } = useParams();
  const sheet = cheatSheets.find((item) => item.id === id);
  const { data, update } = useStore();

  if (!sheet) {
    return (
      <div className="page">
        <h1>Cheatsheet not found</h1>
        <Link to="/catalog?view=cheatsheets">Browse cheatsheets</Link>
      </div>
    );
  }

  const pinned = data.pinnedCheatSheets.includes(sheet.id);

  return (
    <div className="page cheat-sheet-page">
      <Link className="back-link" to="/catalog?view=cheatsheets">
        <ArrowLeft size={15} /> Cheatsheets
      </Link>

      <header className="cheat-sheet-hero">
        <div className="cheat-sheet-mark">{sheet.accent}</div>
        <div>
          <span className="eyebrow">QUICK REFERENCE · {sheet.category}</span>
          <h1>{sheet.title}<span className="blue-dot">.</span></h1>
          <p>{sheet.description}</p>
          <div className="tags">
            {sheet.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
        <button
          className={pinned ? "button primary" : "button"}
          type="button"
          onClick={() =>
            update((current) => ({
              ...current,
              pinnedCheatSheets: pinned
                ? current.pinnedCheatSheets.filter((item) => item !== sheet.id)
                : [...current.pinnedCheatSheets, sheet.id],
            }))
          }
        >
          {pinned ? <PinOff size={16} /> : <Pin size={16} />}
          {pinned ? "Unpin" : "Pin reference"}
        </button>
      </header>

      <section className="cheat-sheet-grid" aria-label={sheet.title + " reference sections"}>
        {sheet.sections.map((section, index) => (
          <article className="cheat-sheet-section" key={section.title}>
            <header>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
            </header>
            <div>
              {section.items.map((item) => (
                <div className="cheat-sheet-line" key={section.title + "-" + item.label}>
                  <strong>{item.label}</strong>
                  <code>{item.value}</code>
                  {item.note && <small>{item.note}</small>}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <footer className="cheat-sheet-footer">
        <BookOpen size={17} />
        <div>
          <strong>Use this as recall support, not a substitute for understanding.</strong>
          <p>When a line feels unfamiliar, return to the lesson or Lab and rebuild the mental model.</p>
        </div>
      </footer>
    </div>
  );
}
