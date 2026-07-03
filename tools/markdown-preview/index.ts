#!/usr/bin/env node

import { buildPreviewShell, launchHtmlPreview } from "../../src/tooling/preview-launcher.js";
import { escapeHtml, resolveTextInput } from "../../src/tooling/io.js";
import { renderBadge, renderCard, renderHero, renderSectionTitle } from "../../src/tooling/preview-ui.js";
import { applyCommonPreviewArg, createCommonPreviewOptions } from "../../src/tooling/preview-cli.js";

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const input = await resolveTextInput({ filePath: options.filePath, inlineText: options.markdownInline });
  const html = buildPreviewShell({
    title: "markdown-preview",
    body: `
      ${renderHero({
        title: "Markdown Preview",
        description: `source=${input.source}`,
      })}
      ${renderCard({
        className: "markdown",
        header: renderSectionTitle(renderBadge("markdown")),
        body: `
        ${renderMarkdown(input.content)}
      `,
      })}
    `,
    extraHead: `<style>.markdown h1,.markdown h2,.markdown h3{margin-top:20px}.markdown p,.markdown li{line-height:1.6}.markdown pre{background:var(--color-background-muted);color:var(--color-text-primary);padding:14px;border-radius:var(--radius-element)}.markdown blockquote{border-left:4px solid var(--color-border-strong);padding-left:12px;color:var(--color-text-secondary)}</style>`,
  });
  await launchHtmlPreview({
    callerUrl: import.meta.url,
    html,
    open: options.open,
    snapshot: options.snapshot,
    timeoutMs: options.timeoutMs,
  });
}

function parseArgs(args: string[]): { filePath: string | null; markdownInline: string | null; open: boolean; snapshot: boolean; timeoutMs: number } {
  const options = { filePath: null as string | null, markdownInline: null as string | null, ...createCommonPreviewOptions() };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--file") { options.filePath = args[index + 1] ?? null; index += 1; continue; }
    if (arg === "--markdown") { options.markdownInline = args[index + 1] ?? null; index += 1; continue; }
    const nextIndex = applyCommonPreviewArg(arg, args, index, options);
    if (nextIndex !== index || arg === "--open" || arg === "--snapshot" || arg.startsWith("--timeout")) { index = nextIndex; continue; }
    if (arg === "-h" || arg === "--help") { console.log(`markdown-preview --file README.md --open`); process.exit(0); }
    throw new Error(`Khong ho tro option: ${arg}`);
  }
  return options;
}

function renderMarkdown(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const output: string[] = [];
  let inCode = false;
  let inList = false;
  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.startsWith("```")) {
      if (inList) { output.push("</ul>"); inList = false; }
      output.push(inCode ? "</code></pre>" : "<pre><code>");
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      output.push(`${escapeHtml(rawLine)}\n`);
      continue;
    }
    if (line.startsWith("# ")) { if (inList) { output.push("</ul>"); inList = false; } output.push(`<h1>${escapeHtml(line.slice(2))}</h1>`); continue; }
    if (line.startsWith("## ")) { if (inList) { output.push("</ul>"); inList = false; } output.push(`<h2>${escapeHtml(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("### ")) { if (inList) { output.push("</ul>"); inList = false; } output.push(`<h3>${escapeHtml(line.slice(4))}</h3>`); continue; }
    if (line.startsWith("- ")) { if (!inList) { output.push("<ul>"); inList = true; } output.push(`<li>${inlineMarkdown(line.slice(2))}</li>`); continue; }
    if (line.startsWith("> ")) { if (inList) { output.push("</ul>"); inList = false; } output.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`); continue; }
    if (line.length === 0) { if (inList) { output.push("</ul>"); inList = false; } continue; }
    if (inList) { output.push("</ul>"); inList = false; }
    output.push(`<p>${inlineMarkdown(line)}</p>`);
  }
  if (inList) {
    output.push("</ul>");
  }
  if (inCode) {
    output.push("</code></pre>");
  }
  return output.join("");
}

function inlineMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

void main();
