# Advanced (optional) — CLI / MCP / hooks

The **default path is the skill only**: `npx skills add` → chat → FAIL/PASS.

If you want a heavier gate (Evidence Viewer, MCP tools, Stop hooks), use the sibling engine:

**[skeptic](https://github.com/brain-marchine/skeptic)** — verification gate + viewer + MCP.

```bash
git clone https://github.com/brain-marchine/skeptic.git
cd skeptic
npm install
npm run build
npx playwright install chromium
```

See Skeptic docs:

- [QUICKSTART](https://github.com/brain-marchine/skeptic/blob/main/docs/QUICKSTART.md)
- [MCP](https://github.com/brain-marchine/skeptic/blob/main/docs/MCP.md)
- [LAUNCH](https://github.com/brain-marchine/skeptic/blob/main/docs/LAUNCH.md)

`verify-done-skills` keeps the Agent Skills install path light; Skeptic is the power-user backend.
