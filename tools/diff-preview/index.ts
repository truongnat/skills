#!/usr/bin/env node

import { buildPreviewShell, launchHtmlPreview } from "../../src/tooling/preview-launcher.js";
import { escapeHtml, resolveTextInput } from "../../src/tooling/io.js";
import { renderBadge, renderCard, renderHero, renderScrollFrame, renderSectionTitle } from "../../src/tooling/preview-ui.js";
import { applyCommonPreviewArg, createCommonPreviewOptions } from "../../src/tooling/preview-cli.js";

type Options = {
  leftFile: string | null;
  rightFile: string | null;
  leftText: string | null;
  rightText: string | null;
  open: boolean;
  snapshot: boolean;
  timeoutMs: number;
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const left = await resolveTextInput({
    filePath: options.leftFile,
    inlineText: options.leftText,
    allowStdin: false,
  });
  const right = await resolveTextInput({
    filePath: options.rightFile,
    inlineText: options.rightText,
    allowStdin: false,
  });

  const rows = buildDiffRows(left.content, right.content);
  const html = buildPreviewShell({
    title: "diff-preview",
    body: `
      ${renderHero({
        title: "Diff Preview",
        description: `left=${left.source} right=${right.source}`,
      })}
      ${renderCard({
        header: renderSectionTitle(renderBadge(`${rows.length} dong`)),
        body: renderScrollFrame(`
          <table>
            <thead><tr><th style="width:50%">Left</th><th style="width:50%">Right</th></tr></thead>
            <tbody>
              ${rows.map((row) => `<tr><td class="${row.leftClass} mono">${escapeHtml(row.left)}</td><td class="${row.rightClass} mono">${escapeHtml(row.right)}</td></tr>`).join("")}
            </tbody>
          </table>
        `),
      })}
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

function parseArgs(args: string[]): Options {
  const options: Options = {
    leftFile: null,
    rightFile: null,
    leftText: null,
    rightText: null,
    ...createCommonPreviewOptions(),
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--left-file") {
      options.leftFile = args[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg === "--right-file") {
      options.rightFile = args[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg === "--left") {
      options.leftText = args[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg === "--right") {
      options.rightText = args[index + 1] ?? null;
      index += 1;
      continue;
    }
    const nextIndex = applyCommonPreviewArg(arg, args, index, options);
    if (nextIndex !== index || arg === "--open" || arg === "--snapshot" || arg.startsWith("--timeout")) {
      index = nextIndex;
      continue;
    }
    if (arg === "-h" || arg === "--help") {
      console.log(`diff-preview --left-file before.txt --right-file after.txt --open`);
      process.exit(0);
    }
    throw new Error(`Khong ho tro option: ${arg}`);
  }
  return options;
}

function buildDiffRows(leftText: string, rightText: string): Array<{
  left: string;
  right: string;
  leftClass: string;
  rightClass: string;
}> {
  const leftLines = leftText.split(/\r?\n/);
  const rightLines = rightText.split(/\r?\n/);
  const length = Math.max(leftLines.length, rightLines.length);
  const rows: Array<{ left: string; right: string; leftClass: string; rightClass: string }> = [];
  for (let index = 0; index < length; index += 1) {
    const left = leftLines[index] ?? "";
    const right = rightLines[index] ?? "";
    const same = left === right;
    rows.push({
      left,
      right,
      leftClass: same ? "" : left && !right ? "removed" : !same ? "removed" : "",
      rightClass: same ? "" : right && !left ? "added" : !same ? "added" : "",
    });
  }
  return rows;
}

void main();
