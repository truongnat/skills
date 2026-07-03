---
name: brainstorming
description: Làm rõ mục tiêu, phạm vi, lựa chọn, trade-off và hướng đề xuất trước khi lập kế hoạch. Dùng khi bắt đầu task mới, yêu cầu còn mơ hồ, cần DISCUSSION.md, brainstorm, align, scope, hoặc phân tích hướng làm.
---

# Brainstorming

## Mục Đích

Biến yêu cầu ban đầu thành một hướng làm rõ ràng trước khi planning hoặc implement. Skill này tập trung vào làm rõ vấn đề, phạm vi, lựa chọn khả thi, trade-off, rủi ro và recommendation.

## Khi Dùng

- Bắt đầu một task mới.
- Người dùng muốn thảo luận ý tưởng trước khi implement.
- Scope, mục tiêu, non-goals hoặc acceptance criteria chưa rõ.
- Cần tạo hoặc cập nhật `DISCUSSION.md`.

## Khi Không Dùng

- Task đã có `DISCUSSION.md` đầy đủ và người dùng yêu cầu execution.
- Chỉ cần review code hoặc điều tra lỗi cụ thể.
- Người dùng yêu cầu sửa nhỏ, scope rõ, không cần phase thảo luận riêng.

## Inputs

- Yêu cầu ban đầu của người dùng.
- Context repo liên quan.
- Constraint về scope, thời gian, công nghệ, artifact.

## Outputs

- `.agents/sessions/<Task-...>/DISCUSSION.md`
- Recommendation rõ ràng cho bước planning.
- Danh sách câu hỏi mở nếu chưa thể chốt hướng.

## XML Contract

```xml
<Contract>
  <Inputs>Yêu cầu ban đầu, context repo, constraint.</Inputs>
  <Outputs>DISCUSSION.md, recommendation, câu hỏi mở.</Outputs>
  <Artifacts>.agents/sessions/&lt;Task-...&gt;/DISCUSSION.md</Artifacts>
  <Safety>Không implement code trong phase brainstorming.</Safety>
</Contract>
```

## Tool Contracts

- `Ask`: dùng khi chỉ cần hỏi user một câu ngắn để làm rõ.
- `Visualize`: dùng khi vấn đề phức tạp cần trực quan hóa; phải confirm user trước vì có thể tốn token hoặc sinh artifact phụ.
- `Generate`: dùng để tạo bản nháp ý tưởng/code/tài liệu, nhưng không thay thế planning hoặc execution.

## Template Quality

- `DISCUSSION.md` phải đẹp, dễ scan, ưu tiên bullet ngắn và bảng trade-off nếu có nhiều lựa chọn.
- Đặt recommendation hoặc hướng đề xuất rõ ở phần dễ thấy; không viết mở bài dài.
- Chỉ giữ nội dung giúp chốt scope, trade-off, risk hoặc câu hỏi mở.
- Không lan man sang planning chi tiết hoặc implementation.

## Workflow

1. Xác định hoặc tạo session id theo dạng `Task-<number>-<short-description>`.
2. Restate yêu cầu bằng ngôn ngữ cụ thể.
3. Tách facts, assumptions và unknowns.
4. Xác định in-scope, out-of-scope và non-goals.
5. Chọn tool contract nếu cần: `Ask`, `Visualize`, hoặc `Generate`.
6. Liệt kê các hướng giải quyết khả thi.
7. So sánh trade-off: độ phức tạp, rủi ro, effort, khả năng verify.
8. Chọn recommendation tối giản nhất có thể kiểm chứng.
9. Ghi `DISCUSSION.md`.

## Template Artifact

```markdown
# Discussion

## Mục Tiêu

## Context Đã Xác Nhận

## Phạm Vi

## Non-Goals

## Lựa Chọn Đã Cân Nhắc

## Recommendation

## Rủi Ro Và Unknowns

## Tool / Model Note

## Điều Kiện Chuyển Sang Planning
```

## Operating Principles

- Không nhảy thẳng vào implement khi scope còn mơ hồ.
- Ưu tiên hướng nhỏ nhất giải quyết được mục tiêu.
- Recommendation phải đi kèm lý do và trade-off.
- Unknown phải được ghi rõ, không giấu trong assumption.
- Nếu provider hỗ trợ chọn model, ưu tiên Tier 1 cho brainstorming khó hoặc mơ hồ.
- Không giả định `Ask`, `Visualize`, `Generate` là command đã tồn tại trong `tools/`.

## Checklist Trước Khi Hoàn Tất

- [ ] Mục tiêu đã được restate rõ.
- [ ] Scope và non-goals đã có.
- [ ] Ít nhất một hướng đề xuất đã được phân tích.
- [ ] Tool contract đã được chọn hoặc ghi rõ không cần.
- [ ] Rủi ro và câu hỏi mở đã được ghi.
- [ ] `DISCUSSION.md` đã lưu đúng session path.

## Limitations

- Skill này không implement code.
- Skill này không thay thế planning chi tiết.

## References

Không có reference bắt buộc trong MVP.
