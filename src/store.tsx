import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
export type ActivityType = "read" | "confidence" | "assessment" | "lab";
export interface LearningActivity {
  id: string;
  type: ActivityType;
  subject: string;
  at: number;
}
export interface PersonalLearning {
  displayName: string;
  activePath: string;
  weeklyDays: 2 | 3 | 5 | 7;
}
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
  confidence: Record<string, number>;
  labEvidence: Record<string, { attempts: number; best: number; lastRun: number }>;
  personal: PersonalLearning;
  activity: LearningActivity[];
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
  confidence: {},
  labEvidence: {},
  personal: {
    displayName: "",
    activePath: "global-cs-core",
    weeklyDays: 3,
  },
  activity: [],
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
    ) ||
    (d.confidence !== undefined &&
      (!isRecord(d.confidence) ||
        Object.values(d.confidence).some(
          (x) => typeof x !== "number" || ![1, 2, 3].includes(x),
        ))) ||
    (d.labEvidence !== undefined &&
      (!isRecord(d.labEvidence) ||
        Object.values(d.labEvidence).some(
          (value) =>
            !isRecord(value) ||
            typeof value.attempts !== "number" ||
            !Number.isFinite(value.attempts) ||
            value.attempts < 0 ||
            typeof value.best !== "number" ||
            !Number.isFinite(value.best) ||
            value.best < 0 ||
            value.best > 100 ||
            typeof value.lastRun !== "number" ||
            !Number.isFinite(value.lastRun) ||
            value.lastRun < 0,
        ))) ||
    (d.personal !== undefined &&
      (!isRecord(d.personal) ||
        typeof d.personal.displayName !== "string" ||
        d.personal.displayName.length > 60 ||
        typeof d.personal.activePath !== "string" ||
        ![2, 3, 5, 7].includes(Number(d.personal.weeklyDays)))) ||
    (d.activity !== undefined &&
      (!Array.isArray(d.activity) ||
        d.activity.some(
          (item) =>
            !isRecord(item) ||
            typeof item.id !== "string" ||
            !["read", "confidence", "assessment", "lab"].includes(String(item.type)) ||
            typeof item.subject !== "string" ||
            typeof item.at !== "number" ||
            !Number.isFinite(item.at) ||
            item.at < 0,
        )))
  )
    throw Error("This is not a valid Next Gen Learning Hub v1 export.");
  return {
    ...defaults,
    ...d,
    confidence: isRecord(d.confidence) ? (d.confidence as Record<string, number>) : {},
    labEvidence: isRecord(d.labEvidence)
      ? (d.labEvidence as Data["labEvidence"])
      : {},
    personal:
      isRecord(d.personal) &&
      typeof d.personal.displayName === "string" &&
      typeof d.personal.activePath === "string" &&
      [2, 3, 5, 7].includes(Number(d.personal.weeklyDays))
        ? (d.personal as unknown as PersonalLearning)
        : { ...defaults.personal },
    activity: Array.isArray(d.activity)
      ? (d.activity as LearningActivity[]).slice(-500)
      : [],
  };
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


export function addActivity(
  data: Data,
  type: ActivityType,
  subject: string,
  at = Date.now(),
): Data {
  const next: LearningActivity = {
    id: `${at}-${type}-${subject}`,
    type,
    subject,
    at,
  };
  return {
    ...data,
    activity: [...data.activity, next].slice(-500),
  };
}
