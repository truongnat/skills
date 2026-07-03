# system-monitor

Tool CLI để xem nhanh trạng thái hệ thống và tiến trình đang chạy.

## Entry

`index.ts`

## Cách dùng

```bash
node dist/tools/system-monitor/index.js --mode all --format text
node dist/tools/system-monitor/index.js --mode summary --format json
node dist/tools/system-monitor/index.js --mode processes --sort memory --limit 20
```

## Mô tả nhanh

- `summary`: hostname, OS, uptime, CPU, RAM, storage free
- `processes`: danh sách tiến trình với PID, CPU, RAM
- `all`: gộp cả `summary` và `processes`
- hỗ trợ output `text` hoặc `json`
