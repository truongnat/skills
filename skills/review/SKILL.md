---
name: review
description: Review thay đổi sau execution, tìm bug, regression, missing tests, security và maintainability risk. Dùng khi cần REVIEW.md, self-review, code review nội bộ, hoặc quality gate trước done.
---

# Review

## Mục Đích

Đánh giá thay đổi trước khi done, tập trung vào lỗi thực tế, rủi ro hành vi, thiếu test, security và maintainability.

## Khi Dùng

- Sau execution.
- Trước khi tạo done report hoặc PR message.
- Khi cần review diff hoặc artifact.

## Khi Không Dùng

- Chưa có thay đổi hoặc artifact để review.
- Người dùng chỉ yêu cầu brainstorming/research.
- Review pull request bên ngoài; dùng `review-pr`.

## Inputs

- Diff hoặc file đã thay đổi.
- `PLAN.md` và `EXECUTION.md` nếu có.
- Kết quả test/check.

## Outputs

- `.agents/sessions/<Task-...>/REVIEW.md`
- Findings có severity, file/path, lý do và recommendation.
- Residual risks và testing gaps.

## XML Contract

```xml
<Contract>
  <Inputs>Diff/file changes, PLAN.md, EXECUTION.md, test/check result.</Inputs>
  <Outputs>REVIEW.md, findings, open questions, testing gaps, residual risks.</Outputs>
  <Artifacts>.agents/sessions/&lt;Task-...&gt;/REVIEW.md</Artifacts>
  <Safety>Không tự sửa code nếu user chỉ yêu cầu review.</Safety>
</Contract>
```

## Template Quality

- `REVIEW.md` phải đặt findings lên trước khi có vấn đề; mỗi finding ngắn, có severity và bằng chứng.
- Không viết summary dài hoặc style-only comments nếu không có rủi ro thực tế.
- Nếu không có finding, ghi rõ `Không tìm thấy finding` và nêu residual risks/testing gaps.
- Dùng bullet ngắn; mỗi bullet phải actionable hoặc giúp quyết định.

## Workflow

1. Đọc plan/execution nếu có.
2. Xác định thay đổi thực tế.
3. Kiểm tra correctness và edge cases.
4. Kiểm tra regression risk.
5. Kiểm tra missing tests/verification.
6. Kiểm tra security nếu có input, auth, secret, file/network.
7. Ghi findings theo severity.
8. Nếu không có finding, ghi rõ không tìm thấy finding và residual risk.

## Template Artifact

```markdown
# Review

## Scope Reviewed

## Findings

## Open Questions

## Testing Gaps

## Residual Risks

## Recommendation
```

## Operating Principles

- Findings là trọng tâm, không viết summary dài trước findings.
- Chỉ nêu vấn đề có tác động thực tế.
- Mỗi finding phải có bằng chứng cụ thể.
- Không biến review thành style-only nếu style không gây rủi ro.

## Checklist Trước Khi Hoàn Tất

- [ ] Scope review rõ.
- [ ] Findings có severity hoặc ghi rõ không có finding.
- [ ] Testing gaps được nêu.
- [ ] Residual risks được ghi.
- [ ] `REVIEW.md` đã lưu đúng session path.

## Limitations

- Review không tự sửa code nếu người dùng chỉ yêu cầu review.
- Nếu cần fix, chuyển lại `planning` hoặc `execution`.

## References

Không có reference bắt buộc trong MVP.
