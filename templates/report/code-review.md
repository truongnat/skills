# Code Review — {{pr_title}}

> **Date:** {{date}}  **Reviewer:** {{reviewer}}  **Target:** {{branch_or_pr}}

---

## Verdict

| | |
|--|--|
| **Decision** | 🔴 DO NOT MERGE \| 🟡 MERGE WITH FIXES \| 🟢 APPROVE |
| **Confidence** | High / Medium / Low |
| **Scope** | Full \| Partial (note what was skipped) |

## Risk summary

<!-- 2–3 sentences: overall quality, top risk, merge recommendation -->

---

## 🔴 Blockers

> Must be resolved before merge.

### B1 — {{issue_title}}

- **Location:** `path/to/file.ts:42`
- **Issue:** …
- **Recommendation:** …

```typescript
// fix example
```

---

## 🟡 Important

> Should fix before merge in a strict release; address soon otherwise.

### I1 — {{issue_title}}

- **Location:** …
- **Issue:** …
- **Recommendation:** …

---

## 🟢 Minor

> Optional; do not block merge.

---

## ✅ Praise

> 1–3 genuinely good patterns.

---

## Action items

- [ ] B1 — …
- [ ] I1 — …
