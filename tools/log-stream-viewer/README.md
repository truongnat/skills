# log-stream-viewer

Xem snapshot log hoặc follow log theo thời gian thực.

## Entry

`index.ts`

## Cách dùng

```bash
node dist/tools/log-stream-viewer/index.js --file app.log
node dist/tools/log-stream-viewer/index.js --file app.log --follow --filter ERROR
```

## Mô tả nhanh

- đọc file log hiện tại
- `--follow` để tail
- `--filter` theo keyword
- `--json` để xuất NDJSON
