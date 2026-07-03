---
name: planning
description: Lập kế hoạch triển khai từ DISCUSSION.md hoặc yêu cầu đã rõ. Dùng khi cần PLAN.md, task breakdown, dependency, acceptance criteria, verification strategy, rollback, hoặc implementation plan.
---

# Planning

## Mục Đích

Chuyển mục tiêu đã rõ thành kế hoạch thực thi cụ thể, có thứ tự, dependency, acceptance criteria, verification và rollback.

## Khi Dùng

- Đã có `DISCUSSION.md` hoặc yêu cầu đủ rõ.
- Cần chia việc trước khi implement.
- Cần xác định file/system bị ảnh hưởng.
- Cần `PLAN.md`.

## Khi Không Dùng

- Mục tiêu còn mơ hồ; dùng `brainstorming` trước.
- Chỉ đang điều tra; dùng `investigate`.
- Đang ở giai đoạn review kết quả.

## Inputs

- `DISCUSSION.md` nếu có.
- Yêu cầu người dùng.
- Mapping codebase hoặc context liên quan.
- Constraint về scope, artifact, verification.

## Outputs

- `.agents/sessions/<Task-...>/PLAN.md`
- Task list có dependency và acceptance criteria.
- Verification strategy và rollback strategy.
- `Definition of Done` để review/verify dựa vào đó.

## XML Contract

```xml
<Contract>
  <Inputs>DISCUSSION.md, yêu cầu user, mapping codebase, constraint.</Inputs>
  <Outputs>PLAN.md, task breakdown, DoD, verification strategy, rollback strategy.</Outputs>
  <Artifacts>.agents/sessions/&lt;Task-...&gt;/PLAN.md</Artifacts>
  <DefinitionOfDone>Điều kiện cụ thể để task/plan được xem là hoàn tất.</DefinitionOfDone>
  <Gate>Với task không nhỏ hoặc có rủi ro, cần user review/xác nhận DoD trước execution.</Gate>
</Contract>
```

## Template Quality

- `PLAN.md` phải gọn, có cấu trúc rõ, task list dễ theo dõi và không có prose dài.
- Dùng bảng hoặc checklist cho task, dependency, acceptance criteria và DoD khi giúp dễ scan.
- Mỗi task phải có mục tiêu, file/scope, acceptance criteria và verification rõ; không ghi task chung chung.
- Không thêm phần giải thích dài ngoài những gì cần để execute và verify.

## Workflow

1. Xác nhận session path.
2. Đọc `DISCUSSION.md` nếu tồn tại.
3. Restate goal và scope.
4. Xác định affected files/systems.
5. Nếu plan lớn, dùng `Breakdown` để chia thành phase/task nhỏ hơn.
6. Chia task theo thứ tự nhỏ, độc lập, có thể verify.
7. Ghi dependency giữa các task.
8. Ghi acceptance criteria cho từng task.
9. Ghi `Definition of Done`.
10. Ghi verification strategy và rollback strategy.
11. Ghi risks và open questions.
12. Với task không nhỏ hoặc có rủi ro, yêu cầu user review/xác nhận DoD trước execution.
13. Lưu `PLAN.md`.

## Template Artifact

```markdown
# Plan

## Goal & Scope

## Constraints & Assumptions

## Affected Files

## Tasks

1. Task title
   - Description:
   - Dependencies:
   - Acceptance Criteria:
   - Files:

## Verification Strategy

## Definition of Done

## Rollback Strategy

## Risks & Open Questions
```

## Operating Principles

- Planning phải đủ cụ thể để agent khác có thể execute.
- Mỗi task phải có điều kiện hoàn tất kiểm chứng được.
- Không đưa việc ngoài scope vào plan.
- Rollback không được bỏ trống nếu có thay đổi workspace.
- DoD phải đủ cụ thể để review và verify không bị cảm tính.
- Nếu provider hỗ trợ chọn model, ưu tiên Tier 2 cho planning và decomposition.

## Checklist Trước Khi Hoàn Tất

- [ ] Goal và scope rõ.
- [ ] Affected files/systems được liệt kê nếu biết.
- [ ] Task có thứ tự và dependency.
- [ ] Acceptance criteria cụ thể.
- [ ] Verification strategy có command hoặc cách kiểm tra.
- [ ] Definition of Done cụ thể và kiểm chứng được.
- [ ] Rollback strategy có.
- [ ] User review/xác nhận DoD đã được yêu cầu nếu task không nhỏ hoặc có rủi ro.
- [ ] `PLAN.md` đã lưu đúng session path.

## Limitations

- Skill này không tự implement.
- Nếu thiếu context codebase, phải ghi unknown thay vì đoán.

## References

Không có reference bắt buộc trong MVP.
