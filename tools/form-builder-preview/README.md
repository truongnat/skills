# form-builder-preview

Render form từ schema JSON và trả submit event về agent.

## Entry

`index.ts`

## Cách dùng

```bash
node dist/tools/form-builder-preview/index.js --file schema.json --open
```

## Mô tả nhanh

- nhận schema JSON
- dựng input/select/textarea/checkbox
- submit tự emit qua `html-preview`
