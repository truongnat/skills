# html-preview

Tool CLI để preview HTML cho user xem và nhận kết quả trả về từ chính trang preview.

## Entry

`index.ts`

## Cách dùng

```bash
node dist/tools/html-preview/index.js --file preview.html
node dist/tools/html-preview/index.js --html "<button data-agent-preview-value='ok'>OK</button>"
Get-Content .\preview.html | node dist/tools/html-preview/index.js --mode stream --format ndjson
node dist/tools/html-preview/index.js --file preview.html --open --snapshot
```

## Mô tả nhanh

- nhận input từ `--file`, `--html`, hoặc stdin
- mở local preview URL để user xem trong browser
- có thể tự mở browser với `--open`
- HTML có thể gọi `window.agentPreview.emit(payload)` để gửi dữ liệu về tool
- có thể đính kèm HTML hiện tại vào event với `--snapshot`
- auto listen:
  - click trên element có `data-agent-preview-value`
  - submit form có `data-agent-preview-submit`
- `--mode once`: nhận event đầu tiên rồi thoát
- `--mode stream`: tiếp tục lắng nghe nhiều event
