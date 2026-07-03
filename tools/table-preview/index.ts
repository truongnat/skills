#!/usr/bin/env node

import { buildPreviewShell, launchHtmlPreview } from "../../src/tooling/preview-launcher.js";
import { parseCsv, parseJsonText, resolveTextInput, escapeHtml } from "../../src/tooling/io.js";
import { renderBadge, renderCard, renderHero, renderScrollFrame, renderToolbar } from "../../src/tooling/preview-ui.js";
import { applyCommonPreviewArg, createCommonPreviewOptions } from "../../src/tooling/preview-cli.js";
import path from "node:path";

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const input = await resolveTextInput({ filePath: options.filePath, inlineText: options.inlineData });
  const table = parseTable(input.content, options.format ?? detectFormat(input.filePath));
  const html = buildPreviewShell({
    title: "table-preview",
    body: `
      ${renderHero({
        title: "Table Preview",
        description: `rows=${table.rows.length} columns=${table.headers.length}`,
      })}
      ${renderCard({
        body: `
        ${renderToolbar(`
          <input id="filter" class="grow" placeholder="Tim kiem..." />
          ${renderBadge(`${table.headers.length} cot`)}
        `)}
        ${renderScrollFrame(`
          <table id="table">
            <thead><tr>${table.headers.map((header, index) => `<th data-index="${index}">${escapeHtml(header)}</th>`).join("")}</tr></thead>
            <tbody>
              ${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        `)}
      `,
      })}
    `,
    extraScript: `
      const filter = document.getElementById("filter");
      const rows = Array.from(document.querySelectorAll("#table tbody tr"));
      filter.addEventListener("input", () => {
        const query = filter.value.toLowerCase();
        rows.forEach((row) => {
          row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
        });
      });
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

function parseArgs(args: string[]): { filePath: string | null; inlineData: string | null; format: "json" | "csv" | null; open: boolean; snapshot: boolean; timeoutMs: number } {
  const options = { filePath: null as string | null, inlineData: null as string | null, format: null as "json" | "csv" | null, ...createCommonPreviewOptions() };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--file") { options.filePath = args[index + 1] ?? null; index += 1; continue; }
    if (arg === "--data") { options.inlineData = args[index + 1] ?? null; index += 1; continue; }
    if (arg === "--format") { options.format = (args[index + 1] as "json" | "csv" | undefined) ?? null; index += 1; continue; }
    const nextIndex = applyCommonPreviewArg(arg, args, index, options);
    if (nextIndex !== index || arg === "--open" || arg === "--snapshot" || arg.startsWith("--timeout")) { index = nextIndex; continue; }
    if (arg === "-h" || arg === "--help") { console.log(`table-preview --file data.csv --open`); process.exit(0); }
    throw new Error(`Khong ho tro option: ${arg}`);
  }
  return options;
}

function detectFormat(filePath?: string): "json" | "csv" {
  return path.extname(filePath ?? "").toLowerCase() === ".csv" ? "csv" : "json";
}

function parseTable(content: string, format: "json" | "csv"): { headers: string[]; rows: string[][] } {
  if (format === "csv") {
    const rows = parseCsv(content);
    const headers = rows[0] ?? [];
    return { headers, rows: rows.slice(1) };
  }
  const data = parseJsonText<Array<Record<string, unknown>>>(content, "Table JSON");
  const headers = Array.from(new Set(data.flatMap((row) => Object.keys(row))));
  const rows = data.map((row) => headers.map((header) => String(row[header] ?? "")));
  return { headers, rows };
}

void main();
