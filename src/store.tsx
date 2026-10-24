import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
export interface Data {
  version: 1;
  theme: "light" | "dark";
  fontSize: number;
  reduced: boolean;
  goal: number;
  notes: Record<string, string>;
  bookmarks: string[];
  visited: string[];
  read: Record<string, string[]>;
  scores: Record<string, number>;
  enrolled: string[];
}
export const defaults: Data = {
  version: 1,
  theme: "light",
  fontSize: 19,
  reduced: false,
  goal: 3,
  notes: {},
  bookmarks: [],
  visited: [],
  read: {},
  scores: {},
  enrolled: ["python"],
};
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function validate(value: unknown): Data {
  const d = value as Data;
  if (
    !d ||
    d.version !== 1 ||
    !["light", "dark"].includes(d.theme) ||
    ![17, 19, 21, 23].includes(d.fontSize) ||
    typeof d.reduced !== "boolean" ||
    ![2, 3, 5].includes(d.goal) ||
    !["bookmarks", "visited", "enrolled"].every(
      (k) =>
        Array.isArray(d[k as keyof Data]) &&
        (d[k as keyof Data] as unknown[]).every((x) => typeof x === "string"),
    ) ||
    !isRecord(d.notes) ||
    Object.values(d.notes).some((x) => typeof x !== "string") ||
    !isRecord(d.read) ||
    Object.values(d.read).some(
      (x) => !Array.isArray(x) || x.some((v) => typeof v !== "string"),
    ) ||
    !isRecord(d.scores) ||
    Object.values(d.scores).some(
      (x) => typeof x !== "number" || !Number.isFinite(x) || x < 0 || x > 100,
    )
  )
    throw Error("This is not a valid Self Learning v1 export.");
  return { ...defaults, ...d };
}
const Context = createContext<{
  data: Data;
  update: (f: (d: Data) => Data) => void;
  storageError: string;
}>({ data: defaults, update: () => {}, storageError: "" });
export function Store({ children }: { children: ReactNode }) {
  const [data, set] = useState<Data>(() => {
    try {
      return validate(
        JSON.parse(localStorage.getItem("self-learning-v1") || "null"),
      );
    } catch {
      return { ...defaults };
    }
  });
  const [storageError, error] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem("self-learning-v1", JSON.stringify(data));
      error("");
    } catch {
      error(
        "Browser storage is unavailable or full. Export your data before closing this tab.",
      );
    }
  }, [data]);
  const update = useCallback((f: (d: Data) => Data) => set((d) => f(d)), []);
  return (
    <Context.Provider value={{ data, update, storageError }}>
      {children}
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
export function grade(selected: number[], answer: number[]) {
  return (
    selected.length === answer.length &&
    answer.every((x) => selected.includes(x))
  );
}
