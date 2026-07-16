---
name: verify-done
description: >-
  Fail-closed verification before accepting Done/Fixed/做完了. Use when the user
  or agent claims a task is finished, fixed, complete, verified, or ready to
  merge — including UI fixes, bug fixes, overflow, layout, tests passing, or
  "I'm done". Also trigger for 做完了、修好了、验收、验证完成、可以合并.
  Runs bundled check scripts and refuses verbal Done until PASS.
---

# verify-done

Agent said Done. **Reality must agree.**

You MUST run verification before saying the work is finished. Verbal "Done / Fixed / 做完了" without a PASS from the scripts below is **Fake Done** — forbidden.

## When this skill applies

- User or you claim: Done, Fixed, complete, finished, verified, LGTM, ready to merge
- Chinese: 做完了、修好了、弄好了、验收通过、可以提交
- Any UI / layout / overflow / bugfix claim

## Hard rules

1. **Do not** say Done / Fixed / 做完了 until the check script exits `0` (PASS).
2. On FAIL (exit `1`): show evidence, keep fixing, re-run the script.
3. Prefer running the bundled script over inventing your own checklist.
4. If the script path is unclear, locate `SKILL.md` for this skill and run `scripts/check.mjs` next to it.

## Procedure

### 1. Locate this skill

Common install paths:

- Project Cursor: `.cursor/skills/verify-done/`
- Project Claude: `.claude/skills/verify-done/`
- User Cursor: `~/.cursor/skills/verify-done/`
- User Claude: `~/.claude/skills/verify-done/`

### 2. Run the check (from the user's project root)

```bash
node "<path-to-verify-done>/scripts/check.mjs" --cwd . --claim "<exact claim text>"
```

Windows PowerShell example:

```powershell
node "$PWD\.cursor\skills\verify-done\scripts\check.mjs" --cwd . --claim "Fixed the inventory overflow"
```

Optional demo URL check (when a local page should prove a UI fix):

```bash
node "<path-to-verify-done>/scripts/check.mjs" --cwd . --claim "Fixed overflow" --url http://127.0.0.1:4173
```

### 3. Report in chat (required template)

```text
## verify-done: FAIL | PASS
- Claim: ...
- Checks: git_diff | fake_tests | npm_test | url_probe (list which ran)
- Evidence: (paste key lines from script stdout)
- Next: (if FAIL, concrete fix steps; if PASS, you may say Done)
```

### 4. Only after PASS

You may say the work is done. Summarize what passed.

## What the script checks

| Check | Behavior |
|-------|----------|
| `git_diff` | Claimed a fix but **no file changes** → FAIL |
| `fake_tests` | Vacuous tests (`expect(true).toBe(true)`, empty bodies, `it.todo`) → FAIL |
| `npm_test` | If `package.json` has `test` script, runs it (skip if missing) |
| `url_probe` | If `--url` given, FAIL when page still contains `overflow-bug` / `LAYOUT BROKEN` |

Details: [references/fake-done.md](references/fake-done.md)

## Anti-patterns (do not do)

- "Tests are green in my head" without running the script
- Editing the script to force PASS
- Saying Done because the user sounded impatient
- Skipping verify on "tiny" UI claims — those are Fake Done hotspots
