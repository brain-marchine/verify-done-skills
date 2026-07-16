# Quickstart — step-by-step (copy/paste)

Goal: install the **verify-done** skill and see a **FAIL** in chat within ~5 minutes.

GitHub owner for install commands: **`brain-marchine`**.

---

## A. Prerequisites (~30s)

```bash
node -v
```

Need **Node.js ≥ 18** and either **Cursor** or **Claude Code**.

---

## B. Install the skill (only required install)

### Option 1 — skills CLI (preferred)

```bash
npx skills add brain-marchine/verify-done-skills
```

### Option 2 — manual install (Cursor, project-level)

**macOS / Linux:**

```bash
cd /path/to/your-project
mkdir -p .cursor/skills
git clone https://github.com/brain-marchine/verify-done-skills.git /tmp/verify-done-skills
cp -R /tmp/verify-done-skills/skills/verify-done .cursor/skills/verify-done
ls .cursor/skills/verify-done/SKILL.md
```

**Windows PowerShell:**

```powershell
cd C:\path\to\your-project
New-Item -ItemType Directory -Force -Path .cursor\skills | Out-Null
git clone https://github.com/brain-marchine/verify-done-skills.git $env:TEMP\verify-done-skills
Copy-Item -Recurse -Force $env:TEMP\verify-done-skills\skills\verify-done .cursor\skills\verify-done
Get-Item .cursor\skills\verify-done\SKILL.md
```

### Option 3 — manual install (Claude Code, project-level)

**macOS / Linux:**

```bash
cd /path/to/your-project
mkdir -p .claude/skills
cp -R /tmp/verify-done-skills/skills/verify-done .claude/skills/verify-done
ls .claude/skills/verify-done/SKILL.md
```

**Windows PowerShell:**

```powershell
cd C:\path\to\your-project
New-Item -ItemType Directory -Force -Path .claude\skills | Out-Null
Copy-Item -Recurse -Force $env:TEMP\verify-done-skills\skills\verify-done .claude\skills\verify-done
Get-Item .claude\skills\verify-done\SKILL.md
```

Then **start a new Agent chat** (or restart Claude Code) so the skill is discovered.

---

## C. Five-minute FAIL with the demo app

### C1. Start the broken demo

From this repository (after clone):

**macOS / Linux:**

```bash
cd examples/demo-app
npm install
npm start
```

**Windows PowerShell:**

```powershell
cd examples\demo-app
npm install
npm start
```

Keep that terminal open. Demo URL: [http://127.0.0.1:4173](http://127.0.0.1:4173)

Optional — prove tests already fail while UI is broken:

```bash
npm test
# expect non-zero exit
```

### C2. Install skill into the demo app folder

In another terminal:

```bash
cd examples/demo-app
mkdir -p .cursor/skills
# from repo root relative path:
cp -R ../../skills/verify-done .cursor/skills/verify-done
```

**Windows PowerShell:**

```powershell
cd examples\demo-app
New-Item -ItemType Directory -Force -Path .cursor\skills | Out-Null
Copy-Item -Recurse -Force ..\..\skills\verify-done .cursor\skills\verify-done
```

Open `examples/demo-app` as the project in Cursor (or run Claude Code from that directory). **New chat.**

### C3. Paste this into the Agent chat (exact)

**English:**

```text
Use the verify-done skill.
I fixed the inventory overflow bug on http://127.0.0.1:4173.
Please verify I'm done — run the skill scripts and report FAIL or PASS with evidence.
Do not say Done until PASS.
```

**中文:**

```text
请使用 verify-done skill。
我已经修好了 http://127.0.0.1:4173 上的库存溢出问题。
请按 skill 跑验收脚本，用证据告诉我 FAIL 还是 PASS。
在 PASS 之前不要说「做完了」。
```

### C4. Expected result

You should see something like:

```text
## verify-done: FAIL
...
```

Not a clean “Done. Fixed.”

### C5. Optional — run the script yourself

From `examples/demo-app`:

```bash
node .cursor/skills/verify-done/scripts/check.mjs --cwd . --claim "Fixed the inventory overflow" --url http://127.0.0.1:4173
echo ExitCode:$LASTEXITCODE
```

**Windows:**

```powershell
node .cursor\skills\verify-done\scripts\check.mjs --cwd . --claim "Fixed the inventory overflow" --url http://127.0.0.1:4173
echo "ExitCode:$LASTEXITCODE"
```

Expect **exit code 1** (FAIL) while the demo is still broken.

### C6. Make it PASS (after you really fix UI)

```bash
npm run fix:ui
npm test
node .cursor/skills/verify-done/scripts/check.mjs --cwd . --claim "Fixed overflow" --url http://127.0.0.1:4173
```

Then ask the agent again to verify — expect **PASS**.

Restore broken demo:

```bash
npm run break:ui
```

---

## D. Use on your own project

```bash
cd /path/to/your-app
npx skills add brain-marchine/verify-done-skills
```

Chat:

```text
Use verify-done.
I'm done with <short description of the change>.
Run verification before accepting done.
```

Agent should run:

```bash
node .cursor/skills/verify-done/scripts/check.mjs --cwd . --claim "<your claim>"
```

(or the `.claude/skills/...` path)

---

## E. Troubleshooting

| Symptom | What to do |
|---------|------------|
| Agent ignores the skill | New chat; start message with `Use the verify-done skill`; confirm `SKILL.md` exists under `.cursor/skills/verify-done` or `.claude/skills/verify-done` |
| `scripts/check.mjs` not found | `ls` / `dir` the skill folder; paste absolute path into chat and ask agent to run it |
| Always PASS but UI still broken | Pass `--url http://127.0.0.1:4173` while demo is running; confirm page still has `overflow-bug` |
| `npx skills` fails | Use manual `cp` / `Copy-Item` steps in section B |
| `npm test` missing in your app | OK — script skips it; git + fake-test + optional `--url` still run |

More: [chat-script.md](../examples/chat-script.md) · Advanced CLI/MCP: [advanced.md](./advanced.md)
