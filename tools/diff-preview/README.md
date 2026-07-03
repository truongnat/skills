# diff-preview

Preview khác biệt giữa 2 text hoặc 2 file.

## Entry

`index.ts`

## Cách dùng

```bash
node dist/tools/diff-preview/index.js --left-file before.txt --right-file after.txt --open
node dist/tools/diff-preview/index.js --left "a" --right "b"
```

## Mô tả nhanh

- so sánh line-by-line
- tô màu phần khác nhau
- phù hợp để show before/after nhanh cho user
