import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = resolve(root, "public/styles.css");
let css = readFileSync(cssPath, "utf8");
css = css.replaceAll("overflow-bug", "overflow-fixed-tmp");
css = css.replace(
  /\/\* BROKEN STATE[\s\S]*?\.overflow-fixed-tmp \{[\s\S]*?\}\n/,
  `/* FIXED via script */\n`,
);
// Simpler approach: rewrite HTML class
const htmlPath = resolve(root, "public/index.html");
let html = readFileSync(htmlPath, "utf8");
html = html.replace('class="overflow-bug"', 'class="overflow-fixed"');
writeFileSync(htmlPath, html);
// restore css token if we mangled — keep original broken block, only html class matters
css = readFileSync(cssPath, "utf8");
if (css.includes("overflow-fixed-tmp")) {
  css = css.replaceAll("overflow-fixed-tmp", "overflow-bug");
  writeFileSync(cssPath, css);
}
console.log("UI marked fixed (class=overflow-fixed)");
