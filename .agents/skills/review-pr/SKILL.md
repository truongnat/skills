---
name: review-pr
description: Review pull request hoặc diff với mindset code review. Dùng khi cần REVIEW_PR.md, kiểm tra branch/PR, tìm bug, regression, security, missing tests, hoặc đánh giá readiness trước merge.
---

# Review PR

## Mục Đích

Review PR hoặc diff như reviewer chịu trách nhiệm chất lượng, tập trung vào correctness, regression, security, missing tests và maintainability.

## Khi Dùng

- Người dùng yêu cầu review PR.
- Cần review branch hiện tại so với base branch.
- Cần tạo `REVIEW_PR.md`.
- Cần xác định blocker trước merge.

## Khi Không Dùng

- Review thay đổi nội bộ sau execution; dùng `review`.
- Chỉ cần tổng kết PR, không review rủi ro.
- Không có diff hoặc file để review.

## Inputs

- PR diff hoặc branch diff.
- PR description nếu có.
- Test result nếu có.
- Codebase context liên quan.

## Outputs

- `.agents/sessions/<Task-...>/REVIEW_PR.md`
- Findings theo severity.
- Open questions, test gaps, merge recommendation.

## XML Contract

```xml
<Contract>
  <Inputs>PR diff, branch diff, PR description, test result, codebase context.</Inputs>
  <Outputs>REVIEW_PR.md, findings, open questions, testing gaps, merge recommendation.</Outputs>
  <Artifacts>.agents/sessions/&lt;Task-...&gt;/REVIEW_PR.md</Artifacts>
  <Safety>Không tự sửa PR hoặc approve thay user.</Safety>
</Contract>
```

## Template Quality

- `REVIEW_PR.md` phải ưu tiên findings theo severity, có file/path hoặc bằng chứng cụ thể.
- Không viết review dạng essay; dùng bullet ngắn, rõ impact và recommendation.
- Nếu không có finding, ghi rõ và nêu testing gaps/residual risks.
- Merge recommendation phải ngắn, rõ điều kiện.

## Workflow

1. Xác định base/head hoặc diff được review.
2. Đọc PR description nếu có.
3. Map affected files và code paths.
4. Review correctness và edge cases.
5. Review security/privacy nếu có input, auth, network, file, secret.
6. Review tests và verification.
7. Ghi findings theo severity.
8. Ghi recommendation: approve, request changes, hoặc need more info.

## Template Artifact

```markdown
# Review PR

## Scope

## Findings

## Open Questions

## Testing Gaps

## Merge Recommendation

## Residual Risks
```

## Operating Principles

- Findings phải đứng trước summary nếu báo cáo trực tiếp cho người dùng.
- Không nêu style-only nếu không có rủi ro thực tế.
- Mỗi finding phải có file/path hoặc bằng chứng cụ thể.
- Nếu không có finding, nói rõ và nêu residual risks.

## Checklist Trước Khi Hoàn Tất

- [ ] Diff/scope đã xác định.
- [ ] Findings có severity hoặc ghi rõ không có finding.
- [ ] Testing gaps được ghi.
- [ ] Merge recommendation rõ.
- [ ] `REVIEW_PR.md` đã lưu đúng path.

## Limitations

- Không tự sửa PR nếu người dùng chỉ yêu cầu review.
- Không approve thay người dùng.

## References

Không có reference bắt buộc trong MVP.
