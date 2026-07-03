# api-runner

Chạy HTTP request từ config JSON.

## Entry

`index.ts`

## Cách dùng

```bash
node dist/tools/api-runner/index.js --file request.json --json
```

## Mô tả nhanh

- nhận config `{ url, method, headers, body }`
- gọi API bằng `fetch`
- trả response dạng text hoặc JSON
