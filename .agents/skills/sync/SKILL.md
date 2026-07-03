---
name: sync
description: Đồng bộ trạng thái trước khi execution: đọc codebase, map context, kiểm tra git/dependency/session artifact. Dùng khi cần sync, update knowledge, refresh context, kiểm tra drift, hoặc chuẩn bị trước khi sửa code.
---

# Sync

## Mục Đích

Đảm bảo agent có trạng thái mới nhất trước khi thực thi: codebase, artifact session, dependency, git state và knowledge liên quan.

## Khi Dùng

- Sau planning và trước execution.
- Khi session đã lâu hoặc context có thể stale.
- Khi cần kiểm tra dependency, git state, hoặc artifact hiện có.
- Khi cần map codebase trước khi sửa.

## Khi Không Dùng

- Task chỉ là brainstorming hoặc planning chưa cần đọc sâu repo.
- Người dùng yêu cầu không kiểm tra repo.
- Không có workspace hoặc artifact để đồng bộ.

## Inputs

- Session path.
- `PLAN.md` nếu có.
- Workspace hiện tại.
- Constraint của người dùng.

## Outputs

- Cập nhật ngắn trong `EXECUTION.md` hoặc artifact phù hợp nếu workflow yêu cầu.
- Danh sách facts, drift, risks, blocked items.
- Không bắt buộc tạo file riêng trong MVP.

## XML Contract

```xml
<Contract>
  <Inputs>Session path, PLAN.md, workspace state, constraint của user.</Inputs>
  <Outputs>Facts, drift, risks, blockers, suggestion nếu cần.</Outputs>
  <Safety>Read-only mặc định; không đọc secret hoặc mutate workspace khi chưa có lý do/approval.</Safety>
</Contract>
```

## Template Quality

- Output sync phải ngắn, tập trung vào facts, drift, blockers và suggestion.
- Tách rõ `Observed`, `Inferred`, `Blocked`, `Next step` nếu nội dung nhiều.
- Không liệt kê toàn bộ file tree nếu không phục vụ plan/execution.
- Không copy nội dung nhạy cảm vào artifact.

## Workflow

1. Xác nhận session path và artifact hiện có.
2. Kiểm tra path/metadata trước khi đọc nội dung file có khả năng nhạy cảm.
3. Kiểm tra workspace files liên quan.
4. Kiểm tra trạng thái git nếu repo đã init.
5. Kiểm tra dependency/config chỉ khi plan cần.
6. So sánh plan với trạng thái thực tế.
7. Nếu có conflict, dirty changes ngoài scope, destructive action hoặc mutation chưa nằm trong plan, dừng và hỏi user hoặc đưa suggestion.
8. Ghi drift hoặc blocker.
9. Chỉ chuyển sang execution khi trạng thái đủ tin cậy.

## Sensitive File Policy

Không đọc nội dung các file sau nếu chưa có lý do rõ và chưa được user cho phép khi cần:

- `.env`, `.env.*`.
- Private key, certificate, credential, token.
- Dump dữ liệu, backup database, file chứa thông tin cá nhân.
- Production config hoặc deployment secret.
- File có tên/path thể hiện rõ nội dung nhạy cảm.

## Operating Principles

- Mặc định read-only.
- Không update dependency, git, lockfile hoặc generated files nếu không có yêu cầu rõ.
- Facts phải dựa trên file/lệnh đã đọc.
- Nếu plan stale, quay lại planning thay vì cố execute.
- Với file nghi ngờ nhạy cảm, chỉ đọc metadata/path trước.
- Không tự xử lý git conflict hoặc unrelated dirty changes.

## Checklist Trước Khi Hoàn Tất

- [ ] Session path đã xác nhận.
- [ ] Artifact liên quan đã đọc nếu tồn tại.
- [ ] Workspace state đã kiểm tra ở mức cần thiết.
- [ ] File nhạy cảm đã được tránh hoặc có approval rõ nếu cần đọc.
- [ ] Drift hoặc blocker đã ghi rõ.
- [ ] Không mutate workspace ngoài scope.

## Limitations

- Skill này không thay thế execution.
- Không tự viết tool hoặc automation.

## References

Không có reference bắt buộc trong MVP.
