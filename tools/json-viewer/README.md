# json-viewer

Preview JSON dạng tree để user xem nhanh.

## Entry

`index.ts`

## Cách dùng

```bash
node dist/tools/json-viewer/index.js --file data.json --open
node dist/tools/json-viewer/index.js --json "{\"ok\":true}"
```

## Mô tả nhanh

- nhận JSON từ file, inline, hoặc stdin
- render tree object/array có thể thu gọn
- dùng `html-preview` để mở browser nếu cần
