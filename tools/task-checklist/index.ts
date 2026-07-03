#!/usr/bin/env node

import { buildPreviewShell, launchHtmlPreview } from "../../src/tooling/preview-launcher.js";
import { escapeHtml, parseJsonText, resolveTextInput } from "../../src/tooling/io.js";
import { renderCard, renderHero } from "../../src/tooling/preview-ui.js";
import { applyCommonPreviewArg, createCommonPreviewOptions } from "../../src/tooling/preview-cli.js";

type Checklist = {
  title?: string;
  description?: string;
  items: Array<{ id: string; label: string; checked?: boolean }>;
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const input = await resolveTextInput({ filePath: options.filePath, inlineText: options.inlineJson });
  const checklist = parseJsonText<Checklist>(input.content, "Checklist");
  const html = buildPreviewShell({
    title: "task-checklist",
    body: `
      ${renderHero({
        title: escapeHtml(checklist.title ?? "Task Checklist"),
        description: escapeHtml(checklist.description ?? "Tick items roi submit"),
      })}
      <form class="grid" data-agent-preview-submit>
        ${renderCard({
          className: "grid",
          body: `
        ${checklist.items.map((item) => `<label class="actions"><input type="checkbox" name="${escapeHtml(item.id)}" value="true" ${item.checked ? "checked" : ""}/> <span>${escapeHtml(item.label)}</span></label>`).join("")}
        <div class="actions"><button type="submit" class="button-primary">Xac nhan</button></div>
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

function parseArgs(args: string[]): { filePath: string | null; inlineJson: string | null; open: boolean; snapshot: boolean; timeoutMs: number } {
  const options = { filePath: null as string | null, inlineJson: null as string | null, ...createCommonPreviewOptions() };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--file") { options.filePath = args[index + 1] ?? null; index += 1; continue; }
    if (arg === "--json") { options.inlineJson = args[index + 1] ?? null; index += 1; continue; }
    const nextIndex = applyCommonPreviewArg(arg, args, index, options);
    if (nextIndex !== index || arg === "--open" || arg === "--snapshot" || arg.startsWith("--timeout")) { index = nextIndex; continue; }
    if (arg === "-h" || arg === "--help") { console.log(`task-checklist --file checklist.json --open`); process.exit(0); }
    throw new Error(`Khong ho tro option: ${arg}`);
  }
  return options;
}

void main();
