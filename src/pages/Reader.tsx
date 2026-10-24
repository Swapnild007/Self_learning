import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  Check,
  ArrowRight,
  PanelLeft,
  NotebookPen,
  Minus,
  Plus,
} from "lucide-react";
import { findChapter } from "../content/catalog";
import type { Block } from "../content/schema";
import { useStore } from "../store";
import { Progress, Modal } from "../components/ui";
function BlockView({ block: b }: { block: Block }) {
  switch (b.type) {
    case "paragraph":
      return <p>{b.text}</p>;
    case "definition":
      return (
        <dl className="definition">
          <dt>{b.term}</dt>
          <dd>{b.text}</dd>
        </dl>
      );
    case "syntax":
      return (
        <div className="syntax">
          <span className="eyebrow">SYNTAX REFERENCE</span>
          <pre>
            <code>{b.syntax.signature}</code>
          </pre>
          <p>{b.syntax.explanation}</p>
        </div>
      );
    case "code":
      return (
        <figure className="code-example">
          <figcaption>
            PYTHON <Copy text={b.example.source} />
          </figcaption>
          <pre>
            <code>{b.example.source}</code>
          </pre>
          <div className="expected">
            <span>EXPECTED OUTPUT</span>
            <pre>{b.example.expectedOutput}</pre>
          </div>
          <p>{b.example.explanation}</p>
          <Link className="button" to="/lab">Try this in the Python laboratory <ArrowRight size={15} /></Link>
        </figure>
      );
    case "table":
      return (
        <div
          className="table-scroll"
          role="region"
          tabIndex={0}
          aria-label="Syntax comparison table"
        >
          <table>
            <thead>
              <tr>
                {b.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside className={`callout ${b.tone}`}>
          <strong>{b.title}</strong>
          <p>{b.text}</p>
        </aside>
      );
    case "diagram":
      return (
        <figure className="flow-diagram">
          <figcaption>{b.caption}</figcaption>
          {b.steps.map((s, i) => (
            <div key={s}>
              <span>{s}</span>
              {i < b.steps.length - 1 && <span aria-hidden="true">↓</span>}
            </div>
          ))}
        </figure>
      );
    case "case":
      return (
        <div className="case-study">
          <span className="eyebrow">INDUSTRY CASE STUDY</span>
          {Object.entries(b.study).map(([k, v]) => (
            <div key={k}>
              <h3>{k}</h3>
              <p>{v}</p>
            </div>
          ))}
        </div>
      );
  }
}
function Copy({ text }: { text: string }) {
  const [status, set] = useState("Copy");
  return (
    <button
      className="text-button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          set("Copied");
        } catch {
          set("Copy unavailable");
        }
      }}
    >
      {status}
    </button>
  );
}
export default function Reader() {
  const { id } = useParams();
  const entry = findChapter(id);
  const chapter = entry?.chapter;
  const { data, update } = useStore();
  const [mobileShow, setMobileShow] = useState(false);
  const [show, setShow] = useState(() => window.innerWidth > 760);
  useEffect(() => {
    if (chapter)
      update((d) => ({
        ...d,
        visited: [
          chapter.id,
          ...d.visited.filter((x) => x !== chapter.id),
        ].slice(0, 20),
      }));
  }, [chapter, update]);
  if (!chapter || !entry)
    return (
      <div className="page">
        <h1>Chapter not found</h1>
        <Link to="/catalog">Browse courses</Link>
      </div>
    );
  const read = data.read[chapter.id] || [],
    saved = data.bookmarks.includes(chapter.id);
  const outline = (
    <>
      <span className="eyebrow">{entry.course.title}</span>
      <h3>{entry.module.title}</h3>
      {chapter.sections.map((s) => (
        <a
          key={s.id}
          href={`#/read/${chapter.id}#${s.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(s.id)?.scrollIntoView({
              behavior: data.reduced ? "instant" : "smooth",
            });
            setMobileShow(false);
          }}
        >
          {read.includes(s.id) ? (
            <Check size={15} />
          ) : (
            <span className="outline-dot" />
          )}
          {s.title}
        </a>
      ))}
      <Link
        onClick={() => setMobileShow(false)}
        to={`/practice?chapter=${chapter.id}`}
      >
        Chapter assessment <ArrowRight size={16} />
      </Link>
    </>
  );
  return (
    <div className={`reader-layout ${show ? "" : "syllabus-hidden"}`}>
      <Dialog.Root open={mobileShow} onOpenChange={setMobileShow}>
        <Dialog.Portal>
          <Dialog.Overlay className="overlay" />
          <Dialog.Content className="syllabus-drawer">
            <Dialog.Title>Chapter syllabus</Dialog.Title>
            <Dialog.Description>
              Choose a section to continue reading.
            </Dialog.Description>
            {outline}
            <Dialog.Close className="button">Close syllabus</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <aside className={`reader-syllabus ${show ? "open" : "desktop-hidden"}`}>
        {outline}
      </aside>
      <div className="reader-center">
        <div className="reading-toolbar">
          <button
            className="icon syllabus-toggle"
            aria-expanded={window.innerWidth <= 760 ? mobileShow : show}
            aria-label="Toggle chapter syllabus"
            onClick={() =>
              window.innerWidth <= 760 ? setMobileShow(true) : setShow(!show)
            }
          >
            <PanelLeft size={19} />
          </button>
          <Link to={`/course/${entry.course.id}`}>{entry.course.title}</Link>
          <div className="toolbar-actions">
            <button
              className="icon"
              aria-label="Decrease reading font size"
              disabled={data.fontSize <= 17}
              onClick={() =>
                update((d) => ({ ...d, fontSize: d.fontSize - 2 }))
              }
            >
              <Minus size={16} />
            </button>
            <button
              className="icon"
              aria-label="Increase reading font size"
              disabled={data.fontSize >= 23}
              onClick={() =>
                update((d) => ({ ...d, fontSize: d.fontSize + 2 }))
              }
            >
              <Plus size={16} />
            </button>
            <button
              className={`icon ${saved ? "active" : ""}`}
              aria-label={saved ? "Remove bookmark" : "Bookmark chapter"}
              aria-pressed={saved}
              onClick={() =>
                update((d) => ({
                  ...d,
                  bookmarks: saved
                    ? d.bookmarks.filter((x) => x !== chapter.id)
                    : [...d.bookmarks, chapter.id],
                }))
              }
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
            </button>
            <Modal
              title="Chapter notes"
              trigger={
                <button className="icon" aria-label="Open chapter notes">
                  <NotebookPen size={19} />
                </button>
              }
            >
              <label className="notes-label">
                Your notes
                <textarea
                  aria-label="Chapter notes"
                  placeholder="An idea, a question, a connection…"
                  value={data.notes[chapter.id] || ""}
                  onChange={(e) =>
                    update((d) => ({
                      ...d,
                      notes: { ...d.notes, [chapter.id]: e.target.value },
                    }))
                  }
                />
              </label>
              <p className="muted" role="status">
                Saved automatically on this device.
              </p>
            </Modal>
          </div>
        </div>
        <Progress
          value={Math.round((read.length / chapter.sections.length) * 100)}
          label="Sections read"
        />
        <article className="textbook" style={{ fontSize: data.fontSize }}>
          <header>
            <div className="eyebrow">CHAPTER · {chapter.minutes} MIN READ</div>
            <h1>{chapter.title}</h1>
            <p className="chapter-intro">{chapter.introduction}</p>
            <div className="chapter-objectives">
              <h2>By the end of this chapter</h2>
              <ul>
                {chapter.objectives.map((o) => (
                  <li key={o.id}>{o.text}</li>
                ))}
              </ul>
            </div>
            <details>
              <summary>Prerequisite knowledge</summary>
              <ul>
                {chapter.prerequisites.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </details>
          </header>
          {chapter.sections.map((s) => (
            <section id={s.id} key={s.id}>
              <h2>{s.title}</h2>
              {s.blocks.map((b, i) => (
                <BlockView block={b} key={i} />
              ))}
              <button
                className={`section-read ${read.includes(s.id) ? "is-read" : ""}`}
                disabled={read.includes(s.id)}
                onClick={() =>
                  update((d) => ({
                    ...d,
                    read: {
                      ...d.read,
                      [chapter.id]: Array.from(
                        new Set([...(d.read[chapter.id] || []), s.id]),
                      ),
                    },
                  }))
                }
              >
                <Check size={16} />
                {read.includes(s.id) ? "Section read" : "Mark section as read"}
              </button>
            </section>
          ))}
          <section>
            <h2>Chapter summary</h2>
            <ul>
              {chapter.summary.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h2>Glossary</h2>
            <dl>
              {chapter.glossary.map((g) => (
                <div key={g.term}>
                  <dt>
                    <strong>{g.term}</strong>
                  </dt>
                  <dd>{g.definition}</dd>
                </div>
              ))}
            </dl>
            <h2>References & further reading</h2>
            <ol>
              {chapter.references.map((r) => (
                <li key={r.id}>
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {r.title} ↗
                  </a>
                </li>
              ))}
            </ol>
            <div className="reader-finish">
              <h3>Understanding comes from doing.</h3>
              <p>
                Reading progress records your place. Mastery requires passing
                the assessment, including the real Python exercise.
              </p>
              <Link
                className="button primary"
                to={`/practice?chapter=${chapter.id}`}
              >
                Check your understanding <ArrowRight size={17} />
              </Link>
              <Link className="button" to="/lab">
                Open coding laboratory
              </Link>
            </div>
          </section>
        </article>
      </div>
      <aside className="reader-aside">
        <span className="eyebrow">IN THIS CHAPTER</span>
        {chapter.sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView();
            }}
          >
            {s.title.slice(3)}
          </a>
        ))}
        <div className="reader-tip">
          <NotebookPen size={22} />
          <h3>Make it yours.</h3>
          <p>
            Capture the idea in your own words. Use the notes button in the
            reading toolbar.
          </p>
        </div>
      </aside>
    </div>
  );
}
