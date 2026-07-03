#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { buildPreviewShell, launchHtmlPreview } from "../../src/tooling/preview-launcher.js";
import { escapeHtml } from "../../src/tooling/io.js";
import { renderBadge, renderCard, renderCardHeader, renderHero } from "../../src/tooling/preview-ui.js";
import { applyCommonPreviewArg, createCommonPreviewOptions } from "../../src/tooling/preview-cli.js";

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const files = options.files.map((filePath) => path.resolve(filePath)).filter((filePath) => existsSync(filePath) && statSync(filePath).isFile());
  if (files.length === 0) {
    throw new Error("Khong co artifact hop le");
  }
  const html = buildPreviewShell({
    title: "artifact-bundle",
    body: `
      ${renderHero({
        title: "Artifact Bundle",
        description: `files=${files.length}`,
      })}
      <section class="columns">
        ${files.map((filePath) => renderArtifact(filePath)).join("")}
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

function parseArgs(args: string[]): { files: string[]; open: boolean; snapshot: boolean; timeoutMs: number } {
  const options = { files: [] as string[], ...createCommonPreviewOptions() };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--file") { options.files.push(args[index + 1] ?? ""); index += 1; continue; }
    const nextIndex = applyCommonPreviewArg(arg, args, index, options);
    if (nextIndex !== index || arg === "--open" || arg === "--snapshot" || arg.startsWith("--timeout")) { index = nextIndex; continue; }
    if (arg === "-h" || arg === "--help") { console.log(`artifact-bundle --file PLAN.md --file output.json --open`); process.exit(0); }
    throw new Error(`Khong ho tro option: ${arg}`);
  }
  return options;
}

function renderArtifact(filePath: string): string {
  const name = path.basename(filePath);
  const content = readFileSync(filePath, "utf8");
  return renderCard({
    header: renderCardHeader(
      `${renderBadge(escapeHtml(name))}<span class="muted">${escapeHtml(filePath)}</span>`,
      `<button type="button" data-agent-preview-value="${escapeHtml(filePath)}">Select</button>`,
    ),
    body: `<pre class="mono">${escapeHtml(content.slice(0, 8000))}</pre>`,
  });
}

void main();
