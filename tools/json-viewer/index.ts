#!/usr/bin/env node

import { buildPreviewShell, launchHtmlPreview } from "../../src/tooling/preview-launcher.js";
import { resolveTextInput, parseJsonText, escapeHtml } from "../../src/tooling/io.js";
import { renderBadge, renderCard, renderHero, renderSectionTitle } from "../../src/tooling/preview-ui.js";
import { applyCommonPreviewArg, createCommonPreviewOptions } from "../../src/tooling/preview-cli.js";

type Options = {
  filePath: string | null;
  jsonInline: string | null;
  open: boolean;
  snapshot: boolean;
  timeoutMs: number;
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const input = await resolveTextInput({
    filePath: options.filePath,
    inlineText: options.jsonInline,
  });
  const value = parseJsonText<unknown>(input.content, "JSON input");
  const html = buildPreviewShell({
    title: "json-viewer",
    body: `
      ${renderHero({
        title: "JSON Viewer",
        description: `source=${input.source}`,
      })}
      ${renderCard({
        header: renderSectionTitle(renderBadge("tree")),
        body: `
        ${renderJsonNode("root", value)}
      `,
      })}
    `,
    extraHead: `<style>details{margin-left:16px;padding:6px 0} summary{cursor:pointer;font-weight:600}.json-leaf{padding:6px 0 6px 20px}.json-key{color:var(--color-text-primary)}.json-type{color:var(--color-text-secondary);font-size:var(--font-size-label)}.json-string{color:var(--color-success)}.json-number{color:var(--color-warning)}.json-boolean{color:var(--color-text-primary)}.json-null{color:var(--color-danger)}</style>`,
  });

  await launchHtmlPreview({
    callerUrl: import.meta.url,
    html,
    open: options.open,
    snapshot: options.snapshot,
    timeoutMs: options.timeoutMs,
  });
}

function parseArgs(args: string[]): Options {
  const options: Options = {
    filePath: null,
    jsonInline: null,
    ...createCommonPreviewOptions(),
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--file") {
      options.filePath = args[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--file=")) {
      options.filePath = arg.slice("--file=".length);
      continue;
    }
    if (arg === "--json") {
      options.jsonInline = args[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--json=")) {
      options.jsonInline = arg.slice("--json=".length);
      continue;
    }
    const nextIndex = applyCommonPreviewArg(arg, args, index, options);
    if (nextIndex !== index) {
      index = nextIndex;
      continue;
    }
    if (arg === "--open" || arg === "--snapshot" || arg.startsWith("--timeout")) {
      continue;
    }
    if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    }
    throw new Error(`Khong ho tro option: ${arg}`);
  }

  return options;
}

function printHelp(): void {
  console.log(`json-viewer

Preview JSON dang tree.

Usage:
  node dist/tools/json-viewer/index.js --file data.json --open
  node dist/tools/json-viewer/index.js --json "{\\"ok\\":true}"
`);
}

function renderJsonNode(key: string, value: unknown): string {
  if (Array.isArray(value)) {
    return `<details open><summary><span class="json-key">${escapeHtml(key)}</span> <span class="json-type">array(${value.length})</span></summary>${value.map((item, index) => renderJsonNode(String(index), item)).join("")}</details>`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return `<details open><summary><span class="json-key">${escapeHtml(key)}</span> <span class="json-type">object(${entries.length})</span></summary>${entries.map(([childKey, childValue]) => renderJsonNode(childKey, childValue)).join("")}</details>`;
  }

  return `<div class="json-leaf"><span class="json-key">${escapeHtml(key)}</span>: ${renderJsonValue(value)}</div>`;
}

function renderJsonValue(value: unknown): string {
  if (typeof value === "string") {
    return `<span class="json-string">"${escapeHtml(value)}"</span>`;
  }
  if (typeof value === "number") {
    return `<span class="json-number">${value}</span>`;
  }
  if (typeof value === "boolean") {
    return `<span class="json-boolean">${value}</span>`;
  }
  if (value == null) {
    return `<span class="json-null">null</span>`;
  }
  return `<span>${escapeHtml(String(value))}</span>`;
}

void main();
