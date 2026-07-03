---
name: tester
description: Hỗ trợ kiểm thử trong lifecycle agent: test cases, verification evidence, test data, regression risk và test documentation. Dùng khi cần tester workflow, QA, test plan, test cases, hoặc xác nhận acceptance criteria.
---

# Tester

## Mục Đích

Đóng vai trò tester/QA trong workflow. Skill này tập trung vào test case, dữ liệu kiểm thử, expected result, regression risk và bằng chứng verification.

## Khi Dùng

- Cần tạo test cases.
- Cần xác nhận acceptance criteria có thể kiểm thử.
- Cần review testing gaps.
- Cần tài liệu kiểm thử cho task.

## Khi Không Dùng

- Task chỉ là brainstorming sản phẩm chưa có behavior cụ thể.
- Review code tổng quát; dùng `review`.
- Điều tra root cause; dùng `investigate`.

## Inputs

- Requirement hoặc `PLAN.md`.
- Acceptance criteria.
- Behavior hiện tại và expected behavior.
- Test environment nếu có.

## Outputs

- Test cases trong artifact session phù hợp.
- Verification notes.
- Testing gaps và regression risks.

## XML Contract

```xml
<Contract>
  <Inputs>Requirement, PLAN.md, acceptance criteria, behavior hiện tại/kỳ vọng.</Inputs>
  <Outputs>Test cases, verification notes, testing gaps, regression risks.</Outputs>
  <Safety>Không claim pass nếu chưa chạy hoặc chưa có evidence.</Safety>
</Contract>
```

## Template Quality

- Test case phải ngắn, rõ precondition, steps, expected result và acceptance criteria.
- Dùng bảng khi có nhiều test case để reviewer scan nhanh.
- Không tạo test case trùng nhau hoặc quá chi tiết vào implementation nội bộ.
- Verification note phải nói rõ đã chạy, chưa chạy, hoặc cần manual check.

## Workflow

1. Đọc requirement/plan.
2. Xác định behavior cần kiểm thử.
3. Viết happy path, edge cases, negative cases nếu phù hợp.
4. Xác định test data.
5. Map test case với acceptance criteria.
6. Ghi verification command hoặc manual steps.
7. Ghi testing gaps còn lại.

## Template Test Case

```markdown
## Test Case: <title>

- Precondition:
- Steps:
- Expected Result:
- Acceptance Criteria:
- Notes:
```

## Operating Principles

- Test case phải kiểm chứng behavior, không chỉ kiểm tra implementation detail.
- Ưu tiên cases có rủi ro cao.
- Nếu không thể automate, ghi manual verification rõ ràng.
- Không claim pass nếu chưa chạy hoặc chưa có evidence.

## Checklist Trước Khi Hoàn Tất

- [ ] Test cases map với acceptance criteria.
- [ ] Edge cases quan trọng có.
- [ ] Test data hoặc precondition rõ.
- [ ] Verification evidence hoặc manual steps rõ.
- [ ] Testing gaps được ghi.

## Limitations

- Skill này không thay thế execution.
- Không tự tạo browser/database tool trong MVP.

## References

Không có reference bắt buộc trong MVP.
