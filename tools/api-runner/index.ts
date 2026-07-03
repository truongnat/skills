#!/usr/bin/env node

import { parseJsonText, resolveTextInput } from "../../src/tooling/io.js";

type RequestConfig = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const input = await resolveTextInput({ filePath: options.filePath, inlineText: options.configInline });
  const config = parseJsonText<RequestConfig>(input.content, "API config");
  const response = await fetch(config.url, {
    method: config.method ?? "GET",
    headers: config.headers,
    body: config.body == null ? undefined : typeof config.body === "string" ? config.body : JSON.stringify(config.body),
  });
  const text = await response.text();
  const output = {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    body: text,
  };
  if (options.json) {
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
    return;
  }
  process.stdout.write(`status=${response.status} ${response.statusText}\n${text}\n`);
}

function parseArgs(args: string[]): { filePath: string | null; configInline: string | null; json: boolean } {
  const options = { filePath: null as string | null, configInline: null as string | null, json: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--file") { options.filePath = args[index + 1] ?? null; index += 1; continue; }
    if (arg === "--config") { options.configInline = args[index + 1] ?? null; index += 1; continue; }
    if (arg === "--json") { options.json = true; continue; }
    if (arg === "-h" || arg === "--help") { console.log(`api-runner --file request.json --json`); process.exit(0); }
    throw new Error(`Khong ho tro option: ${arg}`);
  }
  return options;
}

void main();
