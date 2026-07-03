---
name: investigate
description: Điều tra codebase, bug, hành vi hệ thống hoặc câu hỏi kỹ thuật mà chưa implement. Dùng khi cần INVESTIGATE.md, root-cause analysis, code tracing, reproduce issue, hoặc tìm hiểu impact.
---

# Investigate

## Mục Đích

Tìm hiểu sự thật kỹ thuật trước khi quyết định có implement hay không. Skill này ưu tiên evidence, reproduction, root cause và impact map.

## Khi Dùng

- Người dùng yêu cầu điều tra lỗi.
- Cần hiểu code path hoặc hành vi hệ thống.
- Cần impact analysis trước khi đổi code.
- Chưa chắc có thay đổi workspace.

## Khi Không Dùng

- Đã có root cause và chỉ cần implement fix.
- Chỉ cần brainstorm ý tưởng sản phẩm.
- Review PR; dùng `review-pr`.

## Inputs

- Mô tả vấn đề.
- Log, error, screenshot hoặc reproduction nếu có.
- Codebase context.

## Outputs

- `.agents/sessions/<Task-...>/INVESTIGATE.md`
- Facts, reproduction steps, root cause hypothesis, evidence, next recommendation.

## XML Contract

```xml
<Contract>
  <Inputs>Mô tả vấn đề, log/error/reproduction, codebase context.</Inputs>
  <Outputs>INVESTIGATE.md, facts, hypotheses, impact map, recommendation.</Outputs>
  <Artifacts>.agents/sessions/&lt;Task-...&gt;/INVESTIGATE.md</Artifacts>
  <Safety>Không sửa code trong phase investigate nếu chưa được yêu cầu.</Safety>
</Contract>
```

## Template Quality

- `INVESTIGATE.md` phải tách facts, hypotheses, evidence và recommendation.
- Đặt root cause hoặc trạng thái điều tra sớm nếu đã rõ.
- Không paste log dài; chỉ trích phần liên quan và ghi nguồn.
- Không lan man sang fix plan nếu chưa đủ evidence.

## Workflow

1. Xác định câu hỏi điều tra.
2. Thu thập facts từ file/log/lệnh.
3. Reproduce nếu có thể.
4. Trace code path liên quan.
5. Tách observed facts khỏi inference.
6. Xác định root cause hoặc hypotheses còn lại.
7. Ghi impact và recommendation.
8. Lưu `INVESTIGATE.md`.

## Template Artifact

```markdown
# Investigate

## Question

## Evidence Collected

## Reproduction

## Code Path / Impact Map

## Findings

## Root Cause / Hypotheses

## Recommendation

## Open Questions
```

## Operating Principles

- Không sửa code trong phase investigate nếu chưa được yêu cầu.
- Evidence quan trọng hơn phỏng đoán.
- Nếu không reproduce được, ghi rõ điều kiện đã thử.
- Recommendation phải phân biệt fix, workaround và next investigation.

## Checklist Trước Khi Hoàn Tất

- [ ] Câu hỏi điều tra rõ.
- [ ] Evidence đã ghi nguồn.
- [ ] Facts và inference tách biệt.
- [ ] Impact map có nếu liên quan.
- [ ] Recommendation rõ.
- [ ] `INVESTIGATE.md` đã lưu đúng path.

## Limitations

- Không đảm bảo có fix.
- Không thay thế execution plan nếu cần sửa code.

## References

Không có reference bắt buộc trong MVP.
