/// <reference lib="webworker" />
import { loadPyodide } from "pyodide";
let runtime: Awaited<ReturnType<typeof loadPyodide>> | undefined;
self.onmessage = async (
  event: MessageEvent<{ source: string; tests?: string }>,
) => {
  let output = "";
  const append = (text: string) => {
    if (output.length < 50000)
      output += (text + "\n").slice(0, 50000 - output.length);
  };
  try {
    self.postMessage({
      type: "status",
      message: runtime
        ? "Running Python…"
        : "Loading Python runtime… First use may take a moment.",
    });
    runtime ??= await loadPyodide({
      indexURL: new URL("/python/", self.location.origin).href,
      stdout: append,
      stderr: append,
    });
    runtime.setStdout({ batched: append });
    runtime.setStderr({ batched: append });
    const globals = runtime.toPy({});
    try {
      await runtime.runPythonAsync(event.data.source, { globals });
      if (event.data.tests)
        await runtime.runPythonAsync(event.data.tests, { globals });
      self.postMessage({
        type: "result",
        output: output || "(Completed with no printed output)",
        passed: true,
      });
    } finally {
      globals.destroy();
    }
  } catch (e) {
    self.postMessage({
      type: "result",
      output,
      error: String(e).slice(0, 50000),
      passed: false,
    });
  }
};
