#!/usr/bin/env node

import { readdirSync, existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { buildPreviewShell, launchHtmlPreview } from "../../src/tooling/preview-launcher.js";
import { escapeHtml } from "../../src/tooling/io.js";
import { renderBadge, renderCard, renderCardHeader, renderHero } from "../../src/tooling/preview-ui.js";
import { applyCommonPreviewArg, createCommonPreviewOptions } from "../../src/tooling/preview-cli.js";

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const toolsRoot = path.resolve("tools");
  const tools = readdirSync(toolsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(path.join(toolsRoot, name, "index.ts")));

  const html = buildPreviewShell({
    title: "command-palette",
    body: `
      ${renderHero({
        title: "Command Palette",
        description: `tools=${tools.length}`,
      })}
      <section class="columns">
        ${tools.map((tool) => renderToolCard(toolsRoot, tool)).join("")}
      </section>
    `,
  });
  await launchHtmlPreview({
    callerUrl: import.meta.url,
    html,
    open: options.open,
    snapshot: options.snapshot,
    mode: "stream",
    format: "ndjson",
    timeoutMs: options.timeoutMs,
  });
}

function parseArgs(args: string[]): { open: boolean; snapshot: boolean; timeoutMs: number } {
  const options = createCommonPreviewOptions();
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const nextIndex = applyCommonPreviewArg(arg, args, index, options);
    if (nextIndex !== index || arg === "--open" || arg === "--snapshot" || arg.startsWith("--timeout")) { index = nextIndex; continue; }
    if (arg === "-h" || arg === "--help") { console.log(`command-palette --open`); process.exit(0); }
    throw new Error(`Khong ho tro option: ${arg}`);
  }
  return options;
}

function renderToolCard(toolsRoot: string, tool: string): string {
  const readmePath = path.join(toolsRoot, tool, "README.md");
  const summary = existsSync(readmePath) && statSync(readmePath).isFile()
    ? extractSummary(readFileSync(readmePath, "utf8"))
    : "Khong co mo ta";
  return renderCard({
    header: renderCardHeader(
      `${renderBadge(escapeHtml(tool))}<span class="muted">tool</span>`,
      `<button type="button" data-agent-preview-value="${escapeHtml(tool)}">Chon</button>`,
    ),
    body: `<p>${escapeHtml(summary)}</p><pre class="mono">node dist/tools/${escapeHtml(tool)}/index.js --help</pre>`,
  });
}

function extractSummary(readme: string): string {
  const lines = readme.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
  return lines[1] ?? lines[0] ?? "";
}

void main();
