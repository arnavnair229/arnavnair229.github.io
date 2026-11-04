// Render the app to static HTML so content and LCP do not wait on JavaScript.
import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const ssrDir = resolve("dist-ssr");
const { render } = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href);
const template = await readFile("dist/index.html", "utf8");
if (!template.includes("<!--app-->")) throw new Error("Missing app placeholder in dist/index.html");
await writeFile("dist/index.html", template.replace("<!--app-->", render()));
await rm(ssrDir, { recursive: true, force: true });
console.log("Prerendered dist/index.html");
