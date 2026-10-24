import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type ReactNode } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Compass,
  Library,
  Code2,
  CheckCheck,
  Settings,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";
import { MotionConfig } from "motion/react";
import { useStore } from "./store";
import { Modal } from "./components/ui";
const links = [
  ["/", "Overview", LayoutDashboard],
  ["/catalog", "Explore courses", Compass],
  ["/learning", "My learning", Library],
  ["/lab", "Coding laboratory", Code2],
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
      <div className={`app ${collapsed ? "collapsed" : ""}`}>
        <aside className="sidebar">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <BookOpen size={22} />
            </span>
            <span className="nav-label">
              Self<span className="brand-light">Learning</span>
              <small>A little further, every day.</small>
            </span>
          </Link>
          <span className="eyebrow nav-label">YOUR WORKSPACE</span>
          <nav aria-label="Main navigation">
            {links.map(([to, label, Icon]) => (
              <NavLink key={to} to={to} end={to === "/"} title={label}>
                <Icon size={20} />
                <span className="nav-label">{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-bottom nav-label">
            <div className="quiet-card">
              <GraduationCap size={25} />
              <strong>Build a lasting habit.</strong>
              <p>Small steps. Deeper understanding.</p>
              <Link to="/settings">
                Set your learning goal <ArrowUpRight size={15} />
              </Link>
            </div>
            <span className="local-dot">Saved on this device</span>
          </div>
          <button
            className="collapse icon"
            onClick={() => collapse(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </aside>
        <div className="workspace">
          <header className="topbar">
            <span className="breadcrumb">
              Workspace <span>/</span>{" "}
              {links.find((x) => x[0] === location.pathname)?.[1] ||
                "Course learning"}
            </span>
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
                placeholder="What will you learn today?"
                value={q}
                onChange={(e) => search(e.target.value)}
              />
              <kbd>↵</kbd>
            </form>
            <Modal
              title="Your account"
              trigger={
                <button className="avatar" aria-label="Open account menu">
                  S
                </button>
              }
            >
              <p>
                This is a private, local-first learner profile. No sign-in or
                cloud synchronization is configured.
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
          <footer>
            SELF LEARNING{" "}
            <span>Made for curiosity. Built for understanding.</span>
            <Link to="/settings">Your data, your device</Link>
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}
