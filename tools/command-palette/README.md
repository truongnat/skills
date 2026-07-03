# command-palette

Hiển thị danh sách tool hiện có và cách gọi nhanh.

## Entry

`index.ts`

## Cách dùng

```bash
node dist/tools/command-palette/index.js --open
```

## Mô tả nhanh

- scan `tools/*/index.ts`
- đọc mô tả ngắn từ README
- click chọn tool để emit tên tool về agent
