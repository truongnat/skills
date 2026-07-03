---
name: business-analysis
description: Hỗ trợ Business Analyst: làm rõ yêu cầu, scope, process, stakeholder needs, data sources, acceptance criteria và tài liệu nghiệp vụ. Dùng khi cần BA, requirement analysis, user stories, business rules, hoặc functional spec.
---

# Business Analysis

## Mục Đích

Làm rõ yêu cầu nghiệp vụ trước khi planning hoặc implementation. Skill này tập trung vào problem statement, stakeholder, scope, business rules, acceptance criteria và tài liệu functional.

## Khi Dùng

- Yêu cầu nghiệp vụ chưa rõ.
- Cần viết user story hoặc functional spec.
- Cần xác định business rules.
- Cần phân tích process, data source, Excel/CSV/SQL input.

## Khi Không Dùng

- Task thuần kỹ thuật đã có spec rõ.
- Chỉ cần code review hoặc execution.
- Cần nghiên cứu external source sâu; dùng `research`.

## Inputs

- Yêu cầu người dùng.
- Context nghiệp vụ.
- Tài liệu, data sample, process hiện có nếu có.

## Outputs

- Requirement notes trong artifact session phù hợp.
- Scope, non-goals, business rules.
- Acceptance criteria.
- Open questions cho stakeholder.

## XML Contract

```xml
<Contract>
  <Inputs>Yêu cầu user, context nghiệp vụ, tài liệu/data sample/process nếu có.</Inputs>
  <Outputs>Requirement notes, scope, non-goals, business rules, acceptance criteria, open questions.</Outputs>
  <Safety>Không biến assumption thành requirement; không tự quyết thay stakeholder.</Safety>
</Contract>
```

## Template Quality

- Requirement notes phải đẹp, rõ problem, scope, business rules, acceptance criteria và open questions.
- Không biến tài liệu BA thành bài luận; dùng bullet/table khi có nhiều rule hoặc actor.
- Ghi assumption và open question tách riêng để tránh nhầm thành requirement.
- Chỉ giữ nội dung giúp stakeholder hoặc planning ra quyết định.

## Workflow

1. Restate business problem.
2. Xác định actors/stakeholders.
3. Xác định current state và desired state.
4. Ghi in-scope, out-of-scope, non-goals.
5. Ghi business rules và data assumptions.
6. Viết acceptance criteria kiểm chứng được.
7. Ghi open questions.
8. Chuyển sang `brainstorming` hoặc `planning` nếu đủ rõ.

## Template Artifact Section

```markdown
## Business Analysis

### Problem Statement

### Stakeholders / Actors

### Scope

### Business Rules

### Data Assumptions

### Acceptance Criteria

### Open Questions
```

## Operating Principles

- Không biến assumption thành requirement.
- Acceptance criteria phải kiểm chứng được.
- Ghi rõ non-goals để tránh scope creep.
- Nếu thiếu stakeholder answer, ghi open question thay vì tự quyết.

## Checklist Trước Khi Hoàn Tất

- [ ] Problem statement rõ.
- [ ] Scope và non-goals có.
- [ ] Business rules đã ghi.
- [ ] Acceptance criteria kiểm chứng được.
- [ ] Open questions được ghi.

## Limitations

- Không thay thế quyết định của stakeholder.
- Không tự implement.

## References

Không có reference bắt buộc trong MVP.
