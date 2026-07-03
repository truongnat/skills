#!/usr/bin/env node

import { existsSync, readFileSync, statSync, watchFile } from "node:fs";
import path from "node:path";

type Options = {
  filePath: string;
  filter: string | null;
  follow: boolean;
  json: boolean;
};

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const resolved = path.resolve(options.filePath);
  if (!existsSync(resolved)) {
    throw new Error(`Khong tim thay file log: ${resolved}`);
  }

  let cursor = 0;
  const printCurrent = (): void => {
    const content = readFileSync(resolved, "utf8");
    cursor = Buffer.byteLength(content, "utf8");
    printLines(content.split(/\r?\n/), options);
  };

  printCurrent();

  if (!options.follow) {
    return;
  }

  watchFile(resolved, { interval: 500 }, (current, previous) => {
    if (current.size <= previous.size) {
      cursor = 0;
    }
    const content = readFileSync(resolved, "utf8");
    const next = content.slice(cursor);
    cursor = Buffer.byteLength(content, "utf8");
    printLines(next.split(/\r?\n/), options);
  });
}

function parseArgs(args: string[]): Options {
  const options: Options = {
    filePath: "",
    filter: null,
    follow: false,
    json: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--file") { options.filePath = args[index + 1] ?? ""; index += 1; continue; }
    if (arg === "--filter") { options.filter = args[index + 1] ?? null; index += 1; continue; }
    if (arg === "--follow") { options.follow = true; continue; }
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "-h" || arg === "--help") { console.log(`log-stream-viewer --file app.log --follow --filter ERROR`); process.exit(0); }
    throw new Error(`Khong ho tro option: ${arg}`);
  }
  if (!options.filePath) {
    throw new Error("Thieu --file");
  }
  return options;
}

function printLines(lines: string[], options: Options): void {
  for (const line of lines) {
    if (line.length === 0) {
      continue;
    }
    if (options.filter && !line.includes(options.filter)) {
      continue;
    }
    if (options.json) {
      process.stdout.write(`${JSON.stringify({ timestamp: new Date().toISOString(), line })}\n`);
    } else {
      process.stdout.write(`${line}\n`);
    }
  }
}

main();
