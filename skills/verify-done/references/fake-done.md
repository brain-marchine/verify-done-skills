# Fake Done (short)

**Fake Done** = fluent “Done / Fixed / 做完了” while the product is still wrong.

Common patterns:

1. Unit tests green, UI still broken
2. Vacuous tests (`expect(true).toBe(true)`, empty `it()`)
3. Claimed a fix but `git status` shows no changes
4. Agent grades its own homework without an independent check

`verify-done` forces an independent script before the agent is allowed to say Done.

For a longer field notes write-up from AI bounty PRs, see the sibling project [skeptic](https://github.com/brain-marchine/skeptic/blob/main/docs/FAKE_DONE_CASE_STUDY.md).
