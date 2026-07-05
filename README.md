# simple-skills

Bộ kỹ năng và quy tắc tối giản cho AI agent. Mục tiêu là giữ hệ thống đơn giản, dễ đọc, dễ mở rộng — không biến skill thành framework phức tạp.

## Cài đặt

Chạy lệnh trong **thư mục dự án** cần cài skill. Script sẽ tạo `.agents/` tại đó:

```text
.agents/
├── AGENTS.md
├── DESIGN_SYSTEM.md
├── TOOLS.md
└── skills/
    ├── brainstorming/
    ├── planning/
    └── ...
```

### Linux / macOS

```bash
curl -fsSL https://raw.githubusercontent.com/truongnat/simple-skills/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/truongnat/simple-skills/main/install.ps1 | iex
```

### Cài từ repo đã clone (tùy chọn)

Nếu đã clone repo này, có thể chạy script trực tiếp:

```bash
# Linux / macOS
./install.sh

# Windows (PowerShell)
.\install.ps1

# Windows (CMD)
install.cmd
```

## Skills có sẵn

| Skill | Mục đích |
| --- | --- |
| `brainstorming` | Làm rõ mục tiêu, phạm vi, trade-off trước khi làm |
| `planning` | Chia task, dependency, acceptance criteria, DoD |
| `sync` | Đồng bộ hiểu biết codebase, git state (read-only mặc định) |
| `execution` | Ghi lại từng bước thực thi và thay đổi |
| `review` | Review correctness, regression, security |
| `done` | Tổng kết, PR message, handoff |
| `investigate` | Tìm hiểu / debug khi chưa chắc cần implement |
| `research` | Nghiên cứu nội bộ hoặc bên ngoài |
| `review-pr` | Review pull request hoặc diff |
| `tester` | Test cases, verification evidence |
| `business-analysis` | Yêu cầu nghiệp vụ, scope, tài liệu quy trình |

## Cấu trúc repo

```text
simple-skills/
├── docs/
│   ├── AGENTS.md          # Entrypoint quy tắc chung cho agent
│   └── DESIGN_SYSTEM.md   # Chuẩn thiết kế artifact
│   └── TOOLS.md           # Reference tới các công cụ, tools support
├── skills/
│   └── <skill-name>/
│       └── SKILL.md       # Mô tả skill, workflow, contract
├── install.sh             # Cài đặt cho Linux / macOS
├── install.ps1            # Cài đặt cho Windows (PowerShell)
└── install.cmd            # Wrapper gọi install.ps1 trên Windows
```

## Sau khi cài đặt

Agent đọc `.agents/AGENTS.md` làm entrypoint. Mỗi task nên tạo session riêng:

```text
.agents/sessions/<Task-<number>-<short-description>>/
├── DISCUSSION.md    # brainstorming
├── PLAN.md          # planning
├── EXECUTION.md     # execution
├── REVIEW.md        # review
└── DONE.md          # done
```

Chi tiết workflow xem [docs/AGENTS.md](docs/AGENTS.md).

## Phát triển

Repo vẫn có `package.json` cho tooling TypeScript/Rolldown khi cần. Cài đặt skill **không** yêu cầu Node.js — chỉ cần `curl` (Linux/macOS) hoặc PowerShell (Windows).
