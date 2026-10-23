import { useEffect, useRef, useState } from "react";
export function usePython() {
  const worker = useRef<Worker | null>(null);
  const interrupt = useRef<Int32Array<SharedArrayBuffer> | null>(null);
  const retired = useRef<Set<Worker>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<((passed: boolean) => void) | null>(null);
  const [busy, setBusy] = useState(false),
    [output, setOutput] = useState("Your output will appear here."),
    [status, setStatus] = useState("Ready"),
    [error, setError] = useState("");
  function stop(message = "Execution cancelled.") {
    const stopped = worker.current;
    if (stopped && interrupt.current) {
      Atomics.store(interrupt.current, 0, 2);
      retired.current.add(stopped);
      setTimeout(() => {
        stopped.terminate();
        retired.current.delete(stopped);
      }, 250);
    } else stopped?.terminate();
    interrupt.current = null;
    worker.current = null;
    if (timer.current) clearTimeout(timer.current);
    pending.current?.(false);
    pending.current = null;
    setBusy(false);
    setStatus(message);
  }
  useEffect(
    () => () => {
      worker.current?.terminate();
      retired.current.forEach((w) => w.terminate());
      if (timer.current) clearTimeout(timer.current);
      pending.current?.(false);
    },
    [],
  );
  function run(source: string, tests?: string): Promise<boolean> {
    if (pending.current) return Promise.resolve(false);
    setBusy(true);
    setOutput("");
    setError("");
    setStatus("Starting Python…");
    return new Promise((resolve) => {
      pending.current = resolve;
      if (
        !worker.current &&
        globalThis.crossOriginIsolated &&
        typeof SharedArrayBuffer !== "undefined"
      )
        interrupt.current = new Int32Array(new SharedArrayBuffer(4));
      if (interrupt.current) Atomics.store(interrupt.current, 0, 0);
      worker.current ??= new Worker(
        new URL("./python.worker.ts", import.meta.url),
        { type: "module" },
      );
      const activeWorker = worker.current;
      worker.current.onmessage = (e) => {
        if (worker.current !== activeWorker) return;
        if (e.data.type === "status") setStatus(e.data.message);
        else {
          if (timer.current) clearTimeout(timer.current);
          setOutput(e.data.output);
          setError(e.data.error || "");
          setStatus(e.data.passed ? "Execution complete" : "Execution failed");
          setBusy(false);
          pending.current = null;
          resolve(e.data.passed);
        }
      };
      worker.current.onerror = (e) => {
        if (worker.current !== activeWorker) return;
        setError(
          e.message ||
            "Runtime could not load. Check your connection and reload.",
        );
        stop("Runtime unavailable");
      };
      timer.current = setTimeout(
        () => stop("Time limit reached (60 seconds). Runtime reset."),
        60000,
      );
      worker.current.postMessage({
        source,
        tests,
        interruptBuffer: interrupt.current?.buffer,
      });
    });
  }
  return { run, stop, busy, output, status, error };
}
