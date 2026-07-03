#!/usr/bin/env node

import { buildPreviewShell, launchHtmlPreview } from "../../src/tooling/preview-launcher.js";
import { escapeHtml, parseJsonText, resolveTextInput } from "../../src/tooling/io.js";
import { renderCard, renderField, renderHero } from "../../src/tooling/preview-ui.js";
import { applyCommonPreviewArg, createCommonPreviewOptions } from "../../src/tooling/preview-cli.js";

type Field = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string | number | boolean;
  options?: Array<{ label: string; value: string }>;
};

type Schema = {
  title?: string;
  description?: string;
  submitLabel?: string;
  fields: Field[];
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const input = await resolveTextInput({ filePath: options.filePath, inlineText: options.schemaInline });
  const schema = parseJsonText<Schema>(input.content, "Schema");
  const html = buildPreviewShell({
    title: "form-builder-preview",
    body: `
      ${renderHero({
        title: escapeHtml(schema.title ?? "Form Preview"),
        description: escapeHtml(schema.description ?? "Schema-driven form preview"),
      })}
      <form class="grid" id="generated-form" data-agent-preview-submit>
        ${renderCard({
          className: "grid",
          body: `
        ${schema.fields.map(renderSchemaField).join("")}
        <div class="actions">
          <button type="submit" class="button-primary">${escapeHtml(schema.submitLabel ?? "Submit")}</button>
        </div>
      `,
        })}
      </form>
    `,
  });
  await launchHtmlPreview({
    callerUrl: import.meta.url,
    html,
    open: options.open,
    snapshot: options.snapshot,
    timeoutMs: options.timeoutMs,
  });
}

function parseArgs(args: string[]): { filePath: string | null; schemaInline: string | null; open: boolean; snapshot: boolean; timeoutMs: number } {
  const options = { filePath: null as string | null, schemaInline: null as string | null, ...createCommonPreviewOptions() };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--file") { options.filePath = args[index + 1] ?? null; index += 1; continue; }
    if (arg === "--schema") { options.schemaInline = args[index + 1] ?? null; index += 1; continue; }
    const nextIndex = applyCommonPreviewArg(arg, args, index, options);
    if (nextIndex !== index || arg === "--open" || arg === "--snapshot" || arg.startsWith("--timeout")) { index = nextIndex; continue; }
    if (arg === "-h" || arg === "--help") { console.log(`form-builder-preview --file schema.json --open`); process.exit(0); }
    throw new Error(`Khong ho tro option: ${arg}`);
  }
  return options;
}

function renderSchemaField(field: Field): string {
  const label = escapeHtml(field.label ?? field.name);
  const name = escapeHtml(field.name);
  const placeholder = escapeHtml(field.placeholder ?? "");
  const required = field.required ? "required" : "";
  const value = field.value == null ? "" : escapeHtml(String(field.value));
  const type = field.type ?? "text";
  if (type === "textarea") {
    return renderField(label, `<textarea name="${name}" placeholder="${placeholder}" ${required}></textarea>`);
  }
  if (type === "select") {
    return renderField(label, `<select name="${name}" ${required}>${(field.options ?? []).map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join("")}</select>`);
  }
  if (type === "checkbox") {
    return `<label class="actions"><input type="checkbox" name="${name}" ${field.value ? "checked" : ""}/> <span>${label}</span></label>`;
  }
  return renderField(label, `<input type="${escapeHtml(type)}" name="${name}" value="${value}" placeholder="${placeholder}" ${required}/>`);
}

void main();
