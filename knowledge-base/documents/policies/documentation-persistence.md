| Field | Value |
|-------|-------|
| title | Documentation persistence policy |
| summary | Khi nao ghi file trong knowledge-base; cap nhat INDEX; lien ket rule Cursor |
| tags | policy, knowledge-base, documentation |
| updated | 2026-03-31 |

# Chinh sach luu tai lieu

## Pham vi

- Moi **thay doi co y nghia** trong repo (skill, workflow, script, KB) nen co **dau vet** trong `knowledge-base/documents/` hoac log hoat dong.
- **Khong** luu bi mat, token, PII.

## Vi tri

- **Log hoat dong:** [../repo/activity-log.md](../repo/activity-log.md)
- **Chi muc tim kiem:** [../../INDEX.md](../../INDEX.md)

## Quy trinh

1. Them hoac sua file `.md` duoi `documents/` khi co noi dung on dinh.
2. Cap nhat **INDEX.md** cung mot phien (commit) voi thay doi tai lieu.
3. Sau khi them/sua nhieu tai lieu: `python scripts/build_kb.py` va `verify_kb.py` neu dung RAG.

## Rule Cursor

- **`.cursor/rules/documentation-persistence.mdc`** — ap dung cho agent: tu dong ap dung khi luu quyet dinh.
