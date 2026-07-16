# 推流作战包（brain-marchine / verify-done-skills）

我无法替你登录 HN / Reddit / 微博发帖，但下面所有文案都可 **直接复制粘贴**。  
按顺序做完，比「安静 push」有效得多。

**仓库（发布后）：** https://github.com/brain-marchine/verify-done-skills  
**安装：** `npx skills add brain-marchine/verify-done-skills`  
**GIF：** README 里的 `DEMO.gif`

---

## 0. 你必须先完成（阻塞项）

本机当前 **未登录 GitHub CLI**。在终端执行：

```powershell
gh auth login
cd "c:\Users\DELL\Desktop\new\开源\verify-done-skills"
gh repo create brain-marchine/verify-done-skills --public --source=. --remote=origin --push
gh repo edit brain-marchine/verify-done-skills --add-topic agent-skills --add-topic claude-code --add-topic cursor --add-topic skills --add-topic fake-done --add-topic verification
```

若 `gh repo create` 报已存在，改用：

```powershell
git remote add origin https://github.com/brain-marchine/verify-done-skills.git
git branch -M main
git push -u origin main
```

确认打开 README 能看到 GIF，再开始发帖。

---

## 1. Show HN（主弹药 · 优先）

**何时发：** 周二–周四，北京时间约 **20:00–01:00**（对应 ~12–17 UTC）

**去哪发：** https://news.ycombinator.com/submit  
类型选 **Show HN**，标题用下面这一行（不要加多余前后缀）。

### Title

```text
Show HN: verify-done – agent skills that refuse Fake Done
```

### Body

```text
I kept hitting Fake Done with Cursor / Claude Code:

  "Done. Fixed." → open the UI → still broken.

I first shipped this as a CLI (Skeptic). The name was hard to find and
a zero-follower repo basically got zero discovery.

So I rebuilt the same gate as an Agent Skill:

  npx skills add brain-marchine/verify-done-skills

Paste "Use verify-done… I fixed …" into chat. The skill runs bundled
scripts (git / vacuous-test scan / npm test / optional URL probe) and
reports FAIL or PASS before Done is allowed.

GIF + copy-paste quickstart:
https://github.com/brain-marchine/verify-done-skills
https://github.com/brain-marchine/verify-done-skills/blob/main/docs/QUICKSTART.md

What checks do you wish agents were forced to pass before saying done?
```

**发完后 2 小时内：** 认真回每一条评论（哪怕只是「Thanks — good point」）。冷启动账号靠回复留在首页附近。

---

## 2. Reddit（同日或次日）

### r/Cursor — https://www.reddit.com/r/Cursor/submit

**Title:**

```text
I made an agent skill that blocks “Done” until checks FAIL/PASS in chat
```

**Body:**

```text
Fake Done loop: agent says Fixed → tests "pass" → you open the app → still broken.

I packaged an anti–Fake Done gate as an Agent Skill (not another heavy CLI):

Install:
npx skills add brain-marchine/verify-done-skills

Then paste:
"Use the verify-done skill. I fixed …. Verify before Done."

It runs git / fake-test / npm test / optional URL probe and answers FAIL or PASS in chat.

Repo + 5-min commands:
https://github.com/brain-marchine/verify-done-skills

Do you also get fake Done messages? What usually lies — UI, empty tests, or silent no-diff?
```

### r/ClaudeAI — https://www.reddit.com/r/ClaudeAI/submit

**Title:**

```text
Fake Done skill for Claude Code — npx skills add, paste one prompt, see FAIL
```

**Body:** 同上（可把 Cursor 改成 Claude Code）。

### r/LocalLLaMA（可选）

强调「本地检查脚本、不上传代码」即可，正文复用上面并加一句：checks run on your machine.

---

## 3. 中文区（同一套 GIF + 链接）

### V2EX — https://www.v2ex.com/new （技术 / 程序员）

**标题：**

```text
开源了一个 Agent Skill：拦住「做完了」直到验收 FAIL/PASS（防 Fake Done）
```

**正文：**

```text
用 Cursor / Claude Code 时经常遇到：

Agent：「Done. Fixed.」
打开页面：还是坏的。

我做成了可安装的 Agent Skill（轻安装、对话里见效）：

npx skills add brain-marchine/verify-done-skills

聊天里贴一句「请使用 verify-done … 验收后再说做完了」，
它会跑 git / 空测试扫描 / npm test / 可选 URL 探测，在对话里给 FAIL 或 PASS。

仓库 + 逐步指令（含 Windows）：
https://github.com/brain-marchine/verify-done-skills
https://github.com/brain-marchine/verify-done-skills/blob/main/docs/QUICKSTART.md

求拍：你们被 Fake Done 坑得最多的是 UI、假测试，还是根本没改文件？
```

### 掘金 / 即刻 / 小红书技术向

标题可用：`Agent 说做完了？这个 Skill 先让它证明`  
正文：短痛点 + 安装一行 + GIF（或仓库截图）+ QUICKSTART 链接。

---

## 4. Awesome 列表（长尾发现 · 发完 HN 当天就提 PR）

每条 PR 用这一行（或按对方 README 格式微调）：

```text
- [verify-done](https://github.com/brain-marchine/verify-done-skills) - Agent skill that refuses Done/Fixed until git/tests/URL checks PASS (anti Fake Done).
```

优先提（fork → 加一行 → PR）：

1. https://github.com/VoltAgent/awesome-agent-skills  
2. https://github.com/heilcheng/awesome-agent-skills  
3. https://github.com/philipbankier/awesome-agent-skills  

PR 标题示例：`Add verify-done (anti Fake Done skill)`

---

## 5. X / Twitter（可选短推）

```text
Agent: "Done. Fixed."
Reality: still broken.

I shipped verify-done as an Agent Skill:

npx skills add brain-marchine/verify-done-skills

Paste one prompt → FAIL or PASS in chat.

https://github.com/brain-marchine/verify-done-skills
```

---

## 6. 推荐时间表（48h）

| 时刻 | 动作 |
|------|------|
| T0 | `gh auth login` + 建仓 push + 设 topics + 确认 GIF |
| T0+10min | Show HN |
| T0+30min～2h | 盯 HN 评论，条条回 |
| 当天稍后 | Reddit r/Cursor + r/ClaudeAI |
| 当天 | V2EX |
| 当天～次日 | 3 个 awesome PR |
| 次日 | 根据反馈改 README 第一屏（若安装翻车） |

---

## 7. 我这边已经帮你做好的

- 仓库内容、QUICKSTART、DEMO.gif、LAUNCH 文案  
- 本文件：可复制的多渠道正文  
- README / 安装命令已统一为 `brain-marchine/verify-done-skills`

**我做不到的：** 替你登录社区发帖、买热榜、保证上首页。推流的本质是 **你点发布 + 我备好弹药**。

登录 `gh` 并 push 成功后告诉我，我可以再帮你：检查仓库页展示、改 PR 正文、或根据第一批评论改 README。
