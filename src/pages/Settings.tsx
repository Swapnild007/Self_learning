import { useState, useRef } from "react";
import { Download, Upload, Sun, Moon } from "lucide-react";
import { defaults, useStore, validate } from "../store";
import { Modal } from "../components/ui";
export default function Settings() {
  const { data, update } = useStore();
  const [message, setMessage] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const [confirmation, setConfirmation] = useState("");
  function exportData() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "self-learning-data.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Your learning data has been exported.");
  }
  return (
    <div className="page settings-page">
      <div className="eyebrow">MAKE YOURSELF AT HOME</div>
      <h1>Your space. Your pace.</h1>
      <p className="lead">Thoughtful defaults, with room to make it yours.</p>
      <section className="panel">
        <h2>Appearance</h2>
        <p>Choose the environment that helps you focus.</p>
        <div className="theme-options">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              aria-pressed={data.theme === t}
              className={data.theme === t ? "selected" : ""}
              onClick={() => update((d) => ({ ...d, theme: t }))}
            >
              {t === "light" ? <Sun /> : <Moon />}
              {t === "light" ? "Pearl light" : "Midnight dark"}
            </button>
          ))}
        </div>
        <label className="setting-row">
          <span>
            <strong>Reading font size</strong>
            <small>Applies to the textbook reader.</small>
          </span>
          <select
            aria-label="Reading font size"
            value={data.fontSize}
            onChange={(e) =>
              update((d) => ({ ...d, fontSize: Number(e.target.value) }))
            }
          >
            {[17, 19, 21, 23].map((n) => (
              <option value={n} key={n}>
                {n} px
              </option>
            ))}
          </select>
        </label>
        <label className="setting-row">
          <span>
            <strong>Reduce motion</strong>
            <small>Your system preference is also respected.</small>
          </span>
          <input
            type="checkbox"
            checked={data.reduced}
            onChange={(e) =>
              update((d) => ({ ...d, reduced: e.target.checked }))
            }
          />
        </label>
      </section>
      <section className="panel">
        <h2>Learning preferences</h2>
        <label className="setting-row">
          <span>
            <strong>Topic exploration goal</strong>
            <small>A gentle direction, never a deadline.</small>
          </span>
          <select
            value={data.goal}
            aria-label="Topic exploration goal"
            onChange={(e) =>
              update((d) => ({ ...d, goal: Number(e.target.value) }))
            }
          >
            {[2, 3, 5].map((n) => (
              <option key={n} value={n}>
                {n} topics
              </option>
            ))}
          </select>
        </label>
      </section>
      <section className="panel">
        <h2>Your learning data</h2>
        <p>
          Notes, bookmarks, preferences and results are stored in this browser.
          Export a backup before clearing browser data or switching devices.
          Import replaces the current workspace after validation.
        </p>
        <div className="button-row">
          <button onClick={exportData}>
            <Download size={17} />
            Export data
          </button>
          <Modal
            title="Import learning data"
            trigger={
              <button>
                <Upload size={17} />
                Import data
              </button>
            }
          >
            <p>
              Import replaces your current notes, progress and preferences.
              Export a backup first.
            </p>
            <input
              ref={file}
              aria-label="Choose learning data JSON"
              type="file"
              accept="application/json,.json"
            />
            <button
              className="primary"
              onClick={async () => {
                try {
                  const f = file.current?.files?.[0];
                  if (!f) throw Error("Choose a JSON export first.");
                  if (f.size > 2000000)
                    throw Error("Export exceeds the 2 MB limit.");
                  const imported = validate(JSON.parse(await f.text()));
                  update(() => imported);
                  setMessage("Learning data imported successfully.");
                } catch (e) {
                  setMessage(String(e));
                }
              }}
            >
              Validate and replace data
            </button>
            <p role="status">{message}</p>
          </Modal>
        </div>
        <p role="status">{message}</p>
      </section>
      <section className="panel danger-zone">
        <h2>Start fresh</h2>
        <p>
          Remove all local progress, notes and preferences. This cannot be
          undone without an export.
        </p>
        <Modal
          title="Reset this workspace?"
          trigger={<button className="danger">Reset local data</button>}
        >
          <label>
            Type RESET to confirm
            <input
              aria-label="Reset confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </label>
          <button
            className="danger"
            disabled={confirmation !== "RESET"}
            onClick={() => {
              update(() => ({ ...defaults }));
              setConfirmation("");
              setMessage("Local workspace reset.");
            }}
          >
            Permanently reset local data
          </button>
          <p role="status">{message}</p>
        </Modal>
      </section>
    </div>
  );
}
