import { mkdir, copyFile, readdir } from "node:fs/promises";
await mkdir("public/python", { recursive: true });
for (const name of await readdir("node_modules/pyodide"))
  if (/\.(wasm|zip|json|mjs|js)$/.test(name) && !name.endsWith(".map"))
    await copyFile(`node_modules/pyodide/${name}`, `public/python/${name}`);
