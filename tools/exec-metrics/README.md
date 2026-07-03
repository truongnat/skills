# exec-metrics

Tool CLI để chạy command và đo metric trong lúc thực thi.

## Entry

`index.ts`

## Cách dùng

```bash
node dist/tools/exec-metrics/index.js -- node script.js
node dist/tools/exec-metrics/index.js --format json -- npm run build
node dist/tools/exec-metrics/index.js --mode benchmark --runs 10 --warmup 2 -- node app.js
```

## Mô tả nhanh

- `run`: chạy 1 lần và đo thời gian, CPU, RAM, stdout, stderr
- `benchmark`: chạy nhiều lần và tính `min`, `avg`, `max`, `p95`
- hỗ trợ `--interval`, `--timeout`, `--output-limit`, `--runs`, `--warmup`
