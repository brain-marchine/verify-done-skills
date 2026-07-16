import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = resolve(root, "public/index.html");
let html = readFileSync(htmlPath, "utf8");
html = html.replace('class="overflow-fixed"', 'class="overflow-bug"');
writeFileSync(htmlPath, html);
console.log("UI marked broken (class=overflow-bug)");
