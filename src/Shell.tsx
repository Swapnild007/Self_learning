import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type ReactNode } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Home,
  Library,
  Route as RouteIcon,
  Settings,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  FlaskConical,
  BookOpen,
  UserRound,
} from "lucide-react";
import { MotionConfig } from "motion/react";
import { useStore } from "./store";
import { Modal } from "./components/ui";

const primaryLinks = [
  ["/", "Home", Home],
  ["/catalog", "Library", Library],
  ["/paths", "Paths", RouteIcon],
  ["/lab", "Lab", FlaskConical],
  ["/learning", "Progress", UserRound],
] as const;

const allLinks = [...primaryLinks, ["/settings", "Settings", Settings] as const];

export default function Shell({ children }: { children: ReactNode }) {
  const { data, storageError } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const competitionMode = /^\/arena\/[^/]+/.test(location.pathname);

  useEffect(() => {
    document.documentElement.dataset.theme = data.theme;
    document.documentElement.dataset.reduced = String(data.reduced);
  }, [data.theme, data.reduced]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus();
  }, [location.pathname]);

  const learnerInitial = data.personal.displayName.trim().charAt(0).toUpperCase() || "L";
  const pageName =
    (location.pathname.startsWith("/paths/")
      ? "Learning path"
      : allLinks.find(([to]) => to === location.pathname)?.[1]) ||
    (location.pathname.startsWith("/read/") ? "Lesson" :
      location.pathname.startsWith("/course/") ? "Course" :
      location.pathname.startsWith("/practice") ? "Practice" : "Learning");

  return (
    <MotionConfig reducedMotion={data.reduced ? "always" : "user"}>
      <a
        className="skip"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>

      <div className={`app nextgen-app sorted-app ${collapsed ? "collapsed" : ""} ${competitionMode ? "competition-mode" : ""}`}>
        {!competitionMode && <aside className="sidebar sorted-sidebar">
          <Link to="/" className="brand sorted-brand" aria-label="Next Gen Learning Hub home">
            <span className="brand-mark nextgen-brand-mark">
              <Sparkles size={20} />
            </span>
            <span className="nav-label nextgen-brand-copy">
              <strong>NEXT GEN</strong>
              <span>Learning Hub</span>
              <small>Learn. Practice. Master.</small>
            </span>
          </Link>

          <nav aria-label="Primary navigation" className="sorted-nav">
            <span className="eyebrow nav-label sorted-nav-label">LEARN</span>
            {primaryLinks.map(([to, label, Icon]) => (
              <NavLink key={to} to={to} end={to === "/"} title={label}>
                <Icon size={19} />
                <span className="nav-label">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-bottom nav-label sorted-sidebar-bottom">
            <Link className="sorted-settings-link" to="/settings">
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            <span className="local-dot">Local-first · no paid account</span>
          </div>

          <button
            className="collapse icon"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </aside>}

        <div className="workspace">
          {!competitionMode && <header className="topbar sorted-topbar">
            <div className="sorted-page-label">
              <strong>{pageName}</strong>
              <span>Next Gen Learning Hub</span>
            </div>

            <form
              className="global-search sorted-search"
              onSubmit={(event) => {
                event.preventDefault();
                navigate(`/catalog?q=${encodeURIComponent(query)}`);
              }}
            >
              <Search size={17} />
              <input
                aria-label="Search all courses"
                placeholder="Search a skill or concept"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd>↵</kbd>
            </form>

            <Modal
              title="Your learning workspace"
              trigger={
                <button className="avatar nextgen-avatar" aria-label="Open account menu">
                  {learnerInitial}
                </button>
              }
            >
              <p>
                {data.personal.displayName.trim()
                  ? `${data.personal.displayName.trim()}'s learning workspace keeps progress, notes, review evidence, and preferences on this device.`
                  : "Your learning workspace keeps progress, notes, review evidence, and preferences on this device."}
              </p>
              <Dialog.Close asChild>
                <Link className="button primary" to="/settings">
                  Open settings
                </Link>
              </Dialog.Close>
            </Modal>
          </header>}

          {storageError && <p role="alert" className="storage-error">{storageError}</p>}

          <main id="main" tabIndex={-1}>{children}</main>

          {!competitionMode && <footer className="nextgen-footer sorted-footer">
            <span><BookOpen size={15} /> NEXT GEN LEARNING HUB</span>
            <span>Learning evidence over content consumption.</span>
            <Link to="/settings">Local data</Link>
          </footer>}
        </div>
      </div>
    </MotionConfig>
  );
}
