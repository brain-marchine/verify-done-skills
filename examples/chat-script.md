# Chat scripts (paste into Agent)

## 1) Demo FAIL (first run)

```text
Use the verify-done skill.
I fixed the inventory overflow bug on http://127.0.0.1:4173.
Please verify I'm done — run the skill scripts and report FAIL or PASS with evidence.
Do not say Done until PASS.
```

## 2) Demo FAIL (中文)

```text
请使用 verify-done skill。
我已经修好了 http://127.0.0.1:4173 上的库存溢出问题。
请按 skill 跑验收脚本，用证据告诉我 FAIL 还是 PASS。
在 PASS 之前不要说「做完了」。
```

## 3) Your project

```text
Use verify-done.
I'm done with <describe the change>.
Run verification before accepting done. Show FAIL or PASS with evidence.
```

## 4) After a real fix

```text
Use verify-done again.
I applied the real fix. Re-run checks. Only say Done if PASS.
```
