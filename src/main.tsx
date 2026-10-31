import React, { Suspense, lazy, Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Store } from "./store";
import Shell from "./Shell";
import "./style.css";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Overview = lazy(() => import("./pages/Overview"));
const Reader = lazy(() => import("./pages/Reader"));
const Lab = lazy(() => import("./pages/Lab"));
const Practice = lazy(() => import("./pages/Practice"));
const Learning = lazy(() => import("./pages/Learning"));
const Settings = lazy(() => import("./pages/Settings"));
const LivingLab = lazy(() => import("./pages/LivingLab"));
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="page">
        <h1>Something interrupted this session.</h1>
        <p>Your saved learning data remains in this browser.</p>
        <button onClick={() => location.reload()}>Reload application</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Boundary>
      <Store>
        <HashRouter>
          <Shell>
            <Suspense
              fallback={
                <div className="page" role="status">
                  Opening your workspace…
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/course/:id" element={<Overview />} />
                <Route path="/read/:id" element={<Reader />} />
                <Route path="/lab" element={<Lab />} />
                <Route path="/living-lab" element={<LivingLab />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/settings" element={<Settings />} />
                <Route
                  path="*"
                  element={
                    <div className="page">
                      <h1>Page not found</h1>
                      <a href="#/">Return to dashboard</a>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </Shell>
        </HashRouter>
      </Store>
    </Boundary>
  </React.StrictMode>,
);
