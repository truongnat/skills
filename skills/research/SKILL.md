---
name: research
description: Nghiên cứu nội bộ hoặc external trước khi ra quyết định. Dùng khi cần RESEARCH.md, source-backed findings, technical research, product research, API docs, comparison, hoặc recommendation có citation/evidence.
---

# Research

## Mục Đích

Thu thập và tổng hợp bằng chứng để hỗ trợ quyết định kỹ thuật hoặc sản phẩm. Skill này yêu cầu phân biệt local evidence, external sources, inference và residual risk.

## Khi Dùng

- Người dùng yêu cầu nghiên cứu trước khi implement.
- Cần so sánh lựa chọn kỹ thuật.
- Cần kiểm tra tài liệu chính thống hoặc thông tin mới.
- Cần tạo `RESEARCH.md`.

## Khi Không Dùng

- Câu trả lời đã có rõ trong repo và không cần freshness.
- Task chỉ cần execution theo plan.
- Review PR hoặc debug cụ thể.

## Inputs

- Research question.
- Local docs/code nếu có.
- External sources nếu cần.
- Constraint về độ sâu, thời gian, source quality.

## Outputs

- `.agents/sessions/<Task-...>/RESEARCH.md`
- Findings có evidence.
- Recommendation, caveats, residual risks.

## XML Contract

```xml
<Contract>
  <Inputs>Research question, local evidence, external source constraints.</Inputs>
  <Outputs>RESEARCH.md, source strategy, findings, recommendation, caveats, residual risks.</Outputs>
  <Artifacts>.agents/sessions/&lt;Task-...&gt;/RESEARCH.md</Artifacts>
  <Safety>Không bịa citation; không copy dài nội dung nguồn.</Safety>
</Contract>
```

## Template Quality

- `RESEARCH.md` phải source-backed, rõ câu hỏi, nguồn, findings, caveats và recommendation.
- Đặt kết luận/recommendation sớm nếu đã đủ evidence.
- Không copy dài nội dung nguồn; chỉ tóm tắt phần liên quan.
- Không lan man sang implementation plan trừ khi ghi rõ là follow-up.

## Workflow

1. Xác định research question và decision cần hỗ trợ.
2. Đọc local evidence trước nếu có.
3. Với thông tin có thể thay đổi, dùng nguồn chính thống hoặc source đáng tin.
4. Ghi source strategy.
5. Tổng hợp findings, không copy dài.
6. Tách facts, inference, caveats.
7. Ghi recommendation và residual risks.
8. Lưu `RESEARCH.md`.

## Template Artifact

```markdown
# Research

## Question

## Source Strategy

## Local Evidence

## External Evidence

## Findings

## Recommendation

## Caveats

## Residual Risks
```

## Operating Principles

- Ưu tiên nguồn chính thống cho API/framework.
- Với thông tin dễ stale, phải kiểm tra freshness.
- Không bịa citation hoặc URL.
- Không biến research thành plan; sau research cần `planning` nếu implement.
- Nếu provider hỗ trợ chọn model, ưu tiên Tier 1 cho research khó hoặc thông tin mâu thuẫn.

## Checklist Trước Khi Hoàn Tất

- [ ] Research question rõ.
- [ ] Source strategy ghi rõ.
- [ ] Findings có evidence.
- [ ] Caveats và residual risks có.
- [ ] Recommendation rõ.
- [ ] `RESEARCH.md` đã lưu đúng path.

## Limitations

- Research không tự implement.
- Không thay thế tư vấn pháp lý/tài chính/y tế chuyên nghiệp.

## References

Không có reference bắt buộc trong MVP.
