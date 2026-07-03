---
name: execution
description: Thực thi PLAN.md theo từng task, ghi EXECUTION.md, cập nhật tiến độ, chạy verification từng bước. Dùng khi cần implement, execute plan, modify files, run tests, hoặc hoàn thành task đã được plan.
---

# Execution

## Mục Đích

Thực thi plan đã được chốt một cách có kiểm soát, ghi lại thay đổi và bằng chứng kiểm chứng trong quá trình làm.

## Khi Dùng

- Đã có `PLAN.md` hoặc scope đủ rõ để execute.
- Người dùng yêu cầu implement.
- Cần sửa file, chạy test, cập nhật artifact.

## Khi Không Dùng

- Chưa có plan cho task phức tạp.
- Chỉ cần nghiên cứu hoặc review.
- Có blocker chưa được xử lý từ planning/sync.

## Inputs

- `PLAN.md`.
- Context repo.
- Constraint về edit/test.
- Session path.

## Outputs

- File thay đổi trong workspace.
- `.agents/sessions/<Task-...>/EXECUTION.md`
- Verification evidence từng phần nếu có.

## XML Contract

```xml
<Contract>
  <Inputs>PLAN.md, context repo, constraint edit/test, session path.</Inputs>
  <Outputs>Workspace changes, EXECUTION.md, verification evidence.</Outputs>
  <Safety>Không sửa ngoài scope, không đưa secret vào file, không xóa file nhạy cảm/config khi chưa có plan hoặc confirm.</Safety>
</Contract>
```

## Template Quality

- `EXECUTION.md` phải là log kỹ thuật dễ review: step, file changed, command, result, issue.
- Ghi ngắn gọn theo thứ tự thời gian hoặc theo task; không kể chuyện dài.
- Verification evidence phải cụ thể, có command hoặc cách kiểm tra.
- Không đưa nội dung secret, diff dài hoặc output command dài nếu không cần.

## Workflow

1. Đọc `PLAN.md`.
2. Xác nhận task tiếp theo và dependency đã thỏa.
3. Nêu rõ file sẽ chỉnh trước khi edit.
4. Kiểm tra safety trước khi tạo, sửa hoặc xóa file.
5. Thực hiện thay đổi nhỏ, đúng scope.
6. Chạy format/test/check phù hợp.
7. Ghi kết quả vào `EXECUTION.md`.
8. Nếu failure, ghi nguyên nhân và cách xử lý.
9. Nếu có nhiều task độc lập và provider hỗ trợ subagent/multiple task, chỉ đề xuất dùng khi lợi ích rõ và có thể review/merge an toàn.
10. Lặp lại cho tới khi task hoàn tất hoặc blocked.

## Template Artifact

```markdown
# Execution

## Context

## Steps

## Files Changed

## Commands Run

## Verification Evidence

## Issues / Blockers

## Next Step
```

## Operating Principles

- Không sửa ngoài scope plan.
- Không revert thay đổi không phải của mình nếu chưa được phép.
- Mỗi thay đổi nên nhỏ và có thể review.
- Không claim hoàn tất nếu chưa verify.
- Không tạo file chứa secret, credential, token hoặc dữ liệu nhạy cảm.
- Không xóa file config, credential hoặc file ảnh hưởng môi trường nếu chưa có plan rõ hoặc confirm user.
- Subagent không phải mặc định; chỉ dùng cho task độc lập, có lợi rõ, và provider hỗ trợ.

## Checklist Trước Khi Hoàn Tất

- [ ] Đã đọc plan hoặc xác nhận scope.
- [ ] File chỉnh sửa nằm trong scope.
- [ ] Safety của file tạo/sửa/xóa đã kiểm tra.
- [ ] Lệnh kiểm tra đã chạy nếu có thể.
- [ ] Failure hoặc skipped verification đã ghi rõ.
- [ ] `EXECUTION.md` đã cập nhật.

## Limitations

- Skill này không dùng để review độc lập; sau execution nên dùng `review`.
- Nếu plan sai, phải dừng và quay lại `planning`.

## References

Không có reference bắt buộc trong MVP.
