# Tools

Thư mục chứa source code của các tool. Mỗi tool là một thư mục con trong `tools/`.
Entry chuẩn của mỗi tool là `index.ts`.
Mỗi tool cần có README ngắn gọn mô tả mục đích, cách dùng cơ bản, và ví dụ command tối thiểu.

## system-monitor

CLI để xem nhanh thông tin hệ thống và tiến trình đang chạy.

```bash
node dist/tools/system-monitor/index.js --mode all --format text
node dist/tools/system-monitor/index.js --mode summary --format json
node dist/tools/system-monitor/index.js --mode processes --sort memory --limit 20
```

Tool trả về `text` hoặc `json`, có các mode:

- `summary`: hostname, OS, uptime, CPU, RAM, storage free.
- `processes`: danh sách tiến trình, có CPU và RAM.
- `all`: gộp cả summary và processes.

## exec-metrics

CLI để chạy command và đo metric trong lúc thực thi.

```bash
node dist/tools/exec-metrics/index.js -- node script.js
node dist/tools/exec-metrics/index.js --format json -- npm run build
node dist/tools/exec-metrics/index.js --mode benchmark --runs 10 --warmup 2 -- node app.js
```

Tool trả về:

- thời gian chạy (`durationMs`)
- exit code, signal, timeout
- CPU sample (`max`, `avg`, `last`)
- RAM sample (`maxRssBytes`, `lastRssBytes`)
- kích thước và preview của `stdout` / `stderr`
- benchmark stats: `min`, `avg`, `max`, `p95`

## html-preview

CLI để preview HTML và nhận event trả về từ browser theo thời gian thực.

```bash
node dist/tools/html-preview/index.js --file preview.html
node dist/tools/html-preview/index.js --html "<button data-agent-preview-value='ok'>OK</button>"
Get-Content .\preview.html | node dist/tools/html-preview/index.js --mode stream --format ndjson
node dist/tools/html-preview/index.js --file preview.html --open --snapshot
```

Tool hỗ trợ:

- input từ file, inline HTML, hoặc stdin
- bridge `window.agentPreview.emit(payload)`
- auto emit cho click `data-agent-preview-value`
- auto emit cho submit `data-agent-preview-submit`
- `--open` de tu mo browser
- `--snapshot` de gan HTML hien tai vao event
- `once` hoặc `stream`

## json-viewer

Preview JSON dang tree de user xem nhanh.

```bash
node dist/tools/json-viewer/index.js --file data.json --open
```

## diff-preview

Preview khac biet giua 2 text hoac 2 file.

```bash
node dist/tools/diff-preview/index.js --left-file before.txt --right-file after.txt --open
```

## form-builder-preview

Render form tu schema JSON va tra submit event ve agent.

```bash
node dist/tools/form-builder-preview/index.js --file schema.json --open
```

## table-preview

Preview bang tu CSV hoac JSON array.

```bash
node dist/tools/table-preview/index.js --file data.csv --open
```

## markdown-preview

Preview Markdown thanh HTML de doc nhanh.

```bash
node dist/tools/markdown-preview/index.js --file README.md --open
```

## log-stream-viewer

Xem snapshot log hoac follow log theo thoi gian thuc.

```bash
node dist/tools/log-stream-viewer/index.js --file app.log --follow --filter ERROR
```

## api-runner

Chay HTTP request tu config JSON.

```bash
node dist/tools/api-runner/index.js --file request.json --json
```

## task-checklist

Render checklist interactive de user tick va submit.

```bash
node dist/tools/task-checklist/index.js --file checklist.json --open
```

## artifact-bundle

Gom nhieu artifact vao mot preview portal nho.

```bash
node dist/tools/artifact-bundle/index.js --file PLAN.md --file output.json --open
```

## command-palette

Hien thi danh sach tool hien co va cach goi nhanh.

```bash
node dist/tools/command-palette/index.js --open
```

## simple-skills

CLI để cài và quản lý bộ skill vào `.agents` của project đích.

```bash
npm install
npm run build
node tools/simple-skills/dist/simple-skills.js --help
```

Sau build, file output ở `tools/simple-skills/dist/`. Khi `install`, nội dung `dist/` được copy thẳng vào `.agents/tools/` (flat, không lồng thư mục).
