---
name: done
description: Hoàn tất task sau execution và review, tạo DONE.md, PR_MESSAGE.md, PR_DESCRIPTION.md, tổng kết thay đổi, verification, rủi ro còn lại và handoff. Dùng khi cần close task, final report, PR message, hoặc release note ngắn.
---

# Done

## Mục Đích

Đóng task bằng một bộ artifact rõ ràng: thay đổi đã làm, bằng chứng verify, rủi ro còn lại, PR message và PR description.

## Khi Dùng

- Sau execution và review.
- Khi người dùng yêu cầu tổng kết hoặc chuẩn bị PR.
- Khi task đã đạt acceptance criteria hoặc có blocker cần handoff rõ.

## Khi Không Dùng

- Chưa execute hoặc chưa review.
- Verification còn thiếu mà chưa được ghi rõ.
- Scope vẫn thay đổi.

## Inputs

- `PLAN.md`.
- `EXECUTION.md`.
- `REVIEW.md`.
- Diff hoặc danh sách file thay đổi.
- Test/verification evidence.

## Outputs

- `.agents/sessions/<Task-...>/DONE.md`
- `.agents/sessions/<Task-...>/PR_MESSAGE.md`
- `.agents/sessions/<Task-...>/PR_DESCRIPTION.md`

## XML Contract

```xml
<Contract>
  <Inputs>PLAN.md, EXECUTION.md, REVIEW.md, diff/file changes, verification evidence.</Inputs>
  <Outputs>DONE.md, PR_MESSAGE.md, PR_DESCRIPTION.md.</Outputs>
  <Artifacts>.agents/sessions/&lt;Task-...&gt;/DONE.md, PR_MESSAGE.md, PR_DESCRIPTION.md</Artifacts>
  <Safety>Không overclaim verification; ghi rõ skipped/blocked checks.</Safety>
</Contract>
```

## Template Quality

- `DONE.md`, `PR_MESSAGE.md`, `PR_DESCRIPTION.md` phải sạch, ngắn, reviewer đọc nhanh hiểu scope.
- Summary đặt trước, verification và risks phải rõ, không overclaim.
- PR message không dài quá một dòng nếu không có lý do đặc biệt.
- PR description ưu tiên template repo; nếu fallback thì chỉ giữ section có giá trị.

## Workflow

1. Đọc plan, execution, review.
2. Tìm template PR/MR trong repo nếu có.
3. Tổng hợp thay đổi theo mục đích, không liệt kê máy móc.
4. Ghi verification thật sự đã chạy.
5. Ghi rủi ro còn lại và follow-up.
6. Tạo `DONE.md`.
7. Tạo `PR_MESSAGE.md` ngắn gọn.
8. Tạo `PR_DESCRIPTION.md` có summary, changes, verification, risks.

## Template Lookup

Ưu tiên đọc template theo thứ tự:

1. `.github/PULL_REQUEST_TEMPLATE*`
2. `.gitlab/merge_request_templates/*`
3. Template cấu hình sẵn trong repo nếu có.
4. Fallback template nội bộ trong skill này.

## Template Artifact

```markdown
# Done

## Summary

## What Changed

## Verification

## Risks

## Follow-ups
```

## Template PR Message

```markdown
<type>: <summary>
```

## Template PR Description

```markdown
## Summary

## Changes

## Verification

## Risks / Follow-ups
```

## Operating Principles

- Không overclaim verification.
- Nếu test không chạy được, ghi rõ lý do.
- PR description phải đủ cho reviewer hiểu scope nhanh.
- Done không che giấu blocker.
- Nếu repo có PR/MR template, phải ưu tiên cấu trúc đó trước fallback.

## Checklist Trước Khi Hoàn Tất

- [ ] Đã đọc execution/review.
- [ ] Summary đúng thay đổi thực tế.
- [ ] Verification evidence chính xác.
- [ ] PR/MR template đã được tìm hoặc ghi rõ dùng fallback.
- [ ] Risks/follow-ups có hoặc ghi rõ không có.
- [ ] `DONE.md`, `PR_MESSAGE.md`, `PR_DESCRIPTION.md` đã lưu đúng path.

## Limitations

- Skill này không sửa code.
- Nếu review phát hiện blocker, quay lại execution trước khi done.

## References

Không có reference bắt buộc trong MVP.
