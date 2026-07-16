#!/usr/bin/env node
/**
 * verify-done check — run from the user's project root via Agent.
 * Exit 0 = PASS, 1 = FAIL, 2 = usage error.
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";

function parseArgs(argv) {
  const out = { cwd: process.cwd(), claim: "", url: "" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--cwd" && argv[i + 1]) out.cwd = resolve(argv[++i]);
    else if (a === "--claim" && argv[i + 1]) out.claim = argv[++i];
    else if (a === "--url" && argv[i + 1]) out.url = argv[++i];
    else if (a === "--help" || a === "-h") out.help = true;
  }
  return out;
}

function run(cmd, args, cwd) {
  return spawnSync(cmd, args, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
    env: process.env,
  });
}

function gitChangedFiles(cwd) {
  if (!existsSync(join(cwd, ".git"))) {
    return { ok: false, files: [], note: "no .git — skip strict empty-diff fail" };
  }
  const status = run("git", ["status", "--porcelain"], cwd);
  const files = (status.stdout || "")
    .split(/\r?\n/)
    .map((l) => l.slice(3).trim())
    .filter(Boolean);
  return { ok: true, files, note: "" };
}

const TEST_FILE_RE = /\.(test|spec)\.(t|j)sx?$|_(test|spec)\.py$|test_.*\.py$/i;
const FAKE_PATTERNS = [
  { name: "expect(true).toBe(true)", re: /expect\s*\(\s*true\s*\)\s*\.\s*toBe\s*\(\s*true\s*\)/gi },
  { name: "expect(true).toBeTruthy()", re: /expect\s*\(\s*true\s*\)\s*\.\s*toBeTruthy\s*\(\s*\)/gi },
  { name: "it.todo / test.todo", re: /\b(?:it|test)\.todo\s*\(/g },
  { name: "empty test body", re: /\b(?:it|test)\s*\([^)]*\)\s*=>\s*\{\s*\}/g },
  { name: "assert True", re: /\bassert\s+True\b/g },
];

function walkTests(dir, out) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist" || entry === ".git") continue;
    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walkTests(full, out);
    else if (TEST_FILE_RE.test(entry)) out.push(full);
  }
}

function scanFakeTests(cwd) {
  const files = [];
  for (const root of [".", "src", "test", "tests", "__tests__"]) {
    walkTests(resolve(cwd, root), files);
  }
  const unique = [...new Set(files)];
  const hits = [];
  for (const file of unique) {
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const p of FAKE_PATTERNS) {
      p.re.lastIndex = 0;
      if (!p.re.test(content)) continue;
      hits.push({ file: relative(cwd, file), name: p.name });
    }
  }
  return { scanned: unique.length, hits };
}

function looksLikeFixClaim(claim) {
  return /\b(fix|fixed|done|complete|finished|修好|做完|弄好|验收)\b/i.test(claim);
}

async function probeUrl(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const html = await res.text();
    const broken =
      html.includes("overflow-bug") ||
      html.includes("LAYOUT BROKEN") ||
      html.includes("SuperLongItemNameWithoutSpaces");
    return { ok: true, status: res.status, broken, snippet: html.slice(0, 200) };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

function readNpmTest(cwd) {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    return pkg.scripts?.test ? "test" : null;
  } catch {
    return null;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(`Usage:
  node check.mjs --cwd <project> --claim "<text>" [--url http://127.0.0.1:4173]

Exit: 0 PASS | 1 FAIL | 2 usage`);
    process.exit(0);
  }

  const cwd = args.cwd;
  const claim = args.claim || process.env.VERIFY_DONE_CLAIM || "";
  const lines = [];
  const failures = [];

  lines.push("## verify-done check");
  lines.push(`cwd: ${cwd}`);
  lines.push(`claim: ${claim || "(empty)"}`);
  lines.push("");

  // git
  const git = gitChangedFiles(cwd);
  lines.push("### git_diff");
  if (!git.ok) {
    lines.push(`- skip: ${git.note}`);
  } else {
    lines.push(`- changed files: ${git.files.length}`);
    for (const f of git.files.slice(0, 30)) lines.push(`  - ${f}`);
    if (looksLikeFixClaim(claim) && git.files.length === 0) {
      failures.push("Claimed a fix/done but git shows no file changes");
    }
  }
  lines.push("");

  // fake tests
  const fake = scanFakeTests(cwd);
  lines.push("### fake_tests");
  lines.push(`- scanned: ${fake.scanned} file(s)`);
  if (fake.hits.length) {
    for (const h of fake.hits) lines.push(`  - FAIL ${h.file}: ${h.name}`);
    failures.push(`${fake.hits.length} vacuous/fake test pattern(s)`);
  } else {
    lines.push("- ok: no vacuous patterns");
  }
  lines.push("");

  // npm test
  const testScript = readNpmTest(cwd);
  lines.push("### npm_test");
  if (!testScript) {
    lines.push("- skip: no package.json test script");
  } else {
    const res = run("npm", ["test", "--silent"], cwd);
    lines.push(`- exit: ${res.status}`);
    if (res.stdout) lines.push(res.stdout.trim().slice(0, 1500));
    if (res.stderr) lines.push(String(res.stderr).trim().slice(0, 800));
    if (res.status !== 0) failures.push("npm test failed");
  }
  lines.push("");

  // url probe
  lines.push("### url_probe");
  if (!args.url) {
    lines.push("- skip: no --url");
  } else {
    const probe = await probeUrl(args.url);
    if (!probe.ok) {
      lines.push(`- FAIL: fetch error ${probe.error}`);
      failures.push(`url probe failed: ${probe.error}`);
    } else {
      lines.push(`- status: ${probe.status}`);
      if (probe.broken) {
        lines.push("- FAIL: page still shows broken overflow markers (overflow-bug / LAYOUT BROKEN)");
        failures.push("UI still broken at --url (Fake Done)");
      } else {
        lines.push("- ok: no known broken markers");
      }
    }
  }
  lines.push("");

  const passed = failures.length === 0;
  lines.push(passed ? "## RESULT: PASS" : "## RESULT: FAIL");
  if (!passed) {
    lines.push("Failures:");
    for (const f of failures) lines.push(`- ${f}`);
  }

  const report = lines.join("\n");
  console.log(report);

  const evidenceDir = join(cwd, ".verify-done");
  try {
    mkdirSync(evidenceDir, { recursive: true });
    writeFileSync(join(evidenceDir, "last-report.txt"), report, "utf8");
  } catch {
    /* ignore */
  }

  process.exit(passed ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
