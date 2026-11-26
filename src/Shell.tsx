import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type ReactNode } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Compass,
  Route as RouteIcon,
  ChartColumn,
  Library,
  Code2,
  CheckCheck,
  Settings,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { MotionConfig } from "motion/react";
import { useStore } from "./store";
import { Modal } from "./components/ui";

const links = [
  ["/", "Learning home", LayoutDashboard],
  ["/catalog", "Knowledge library", Compass],
  ["/paths", "Learning paths", RouteIcon],
  ["/visuals", "Visual studio", ChartColumn],
  ["/learning", "My learning", Library],
  ["/lab", "Code lab", Code2],
  ["/practice", "Practice", CheckCheck],
  ["/settings", "Settings", Settings],
] as const;

export default function Shell({ children }: { children: ReactNode }) {
  const { data, storageError } = useStore();
  const [collapsed, collapse] = useState(false);
  const [q, search] = useState("");
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = data.theme;
    document.documentElement.dataset.reduced = String(data.reduced);
  }, [data.theme, data.reduced]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus();
  }, [location.pathname]);

  const pageName =
    (location.pathname.startsWith("/paths/")
      ? "Learning path"
      : links.find((x) => x[0] === location.pathname)?.[1]) ||
    "Course learning";

  return (
    <MotionConfig reducedMotion={data.reduced ? "always" : "user"}>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>

      <div className={`app nextgen-app ${collapsed ? "collapsed" : ""}`}>
        <aside className="sidebar nextgen-sidebar">
          <Link to="/" className="brand nextgen-brand" aria-label="Next Gen Learning Hub home">
            <span className="brand-mark nextgen-brand-mark">
              <Sparkles size={20} />
            </span>
            <span className="nav-label nextgen-brand-copy">
              <strong>NEXT GEN</strong>
              <span>Learning Hub</span>
              <small>Understand deeply. Build confidently.</small>
            </span>
          </Link>

          <span className="eyebrow nav-label nextgen-nav-title">LEARNING SPACE</span>
          <nav aria-label="Main navigation">
            {links.map(([to, label, Icon]) => (
              <NavLink key={to} to={to} end={to === "/"} title={label}>
                <Icon size={20} />
                <span className="nav-label">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-bottom nav-label">
            <div className="quiet-card nextgen-quiet-card">
              <GraduationCap size={24} />
              <strong>Learn actively.</strong>
              <p>Read less passively. Explain, experiment, practice, and build.</p>
              <Link to="/paths">
                Choose a learning path <ArrowUpRight size={15} />
              </Link>
            </div>
            <span className="local-dot">Local-first · no account required</span>
          </div>

          <button
            className="collapse icon"
            onClick={() => collapse(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </aside>

        <div className="workspace">
          <header className="topbar nextgen-topbar">
            <div className="nextgen-location">
              <span className="breadcrumb">
                Next Gen <span>/</span> {pageName}
              </span>
              <small>Learn · Practice · Build · Master</small>
            </div>

            <form
              className="global-search"
              onSubmit={(e) => {
                e.preventDefault();
                nav(`/catalog?q=${encodeURIComponent(q)}`);
              }}
            >
              <Search size={17} />
              <input
                aria-label="Search all courses"
                placeholder="Search a concept, skill, or technology"
                value={q}
                onChange={(e) => search(e.target.value)}
              />
              <kbd>↵</kbd>
            </form>

            <Modal
              title="Your learning workspace"
              trigger={
                <button className="avatar nextgen-avatar" aria-label="Open account menu">
                  S
                </button>
              }
            >
              <p>
                Your progress, notes, bookmarks, and assessment results stay on this
                device unless you export them. No paid account or cloud service is
                required.
              </p>
              <Dialog.Close asChild>
                <Link className="button primary" to="/settings">
                  Open settings
                </Link>
              </Dialog.Close>
            </Modal>
          </header>

          {storageError && (
            <p role="alert" className="storage-error">
              {storageError}
            </p>
          )}

          <main id="main" tabIndex={-1}>
            {children}
          </main>

          <footer className="nextgen-footer">
            <span><BookOpen size={15} /> NEXT GEN LEARNING HUB</span>
            <span>Built for active learning, not content scrolling.</span>
            <Link to="/settings">Local learning data</Link>
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}
