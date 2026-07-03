#!/usr/bin/env node

import { spawn, execFileSync, type ChildProcess } from "node:child_process";
import os from "node:os";

type Format = "json" | "text";
type Mode = "run" | "benchmark";

type Options = {
  format: Format;
  mode: Mode;
  intervalMs: number;
  timeoutMs: number;
  outputLimit: number;
  runs: number;
  warmupRuns: number;
  command: string[];
};

type ResourceSample = {
  timestampMs: number;
  rssBytes: number | null;
  cpuPercent: number | null;
};

type RunMetrics = {
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  timedOut: boolean;
  success: boolean;
  samples: number;
  cpuPercent: {
    max: number | null;
    avg: number | null;
    last: number | null;
  };
  memory: {
    maxRssBytes: number | null;
    lastRssBytes: number | null;
  };
  output: {
    stdoutBytes: number;
    stderrBytes: number;
    stdoutPreview: string;
    stderrPreview: string;
  };
  warnings?: string[];
};

type RunSummary = {
  kind: "run";
  command: string[];
  platform: NodeJS.Platform;
  result: RunMetrics;
};

type BenchmarkSummary = {
  kind: "benchmark";
  command: string[];
  platform: NodeJS.Platform;
  runs: number;
  warmupRuns: number;
  stats: {
    durationMs: {
      min: number | null;
      avg: number | null;
      max: number | null;
      p95: number | null;
    };
    cpuPercentMax: {
      min: number | null;
      avg: number | null;
      max: number | null;
      p95: number | null;
    };
    memoryMaxRssBytes: {
      min: number | null;
      avg: number | null;
      max: number | null;
      p95: number | null;
    };
  };
  allSucceeded: boolean;
  results: RunMetrics[];
};

async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv.slice(2));
    const summary =
      options.mode === "benchmark"
        ? await runBenchmark(options)
        : await runSingle(options);

    if (options.format === "json") {
      console.log(JSON.stringify(summary, null, 2));
      return;
    }

    console.log(formatText(summary));
  } catch (error) {
    console.error(normalizeSpawnError(error));
    process.exitCode = 1;
  }
}

function parseArgs(args: string[]): Options {
  const separatorIndex = args.indexOf("--");
  const optionArgs = separatorIndex >= 0 ? args.slice(0, separatorIndex) : args;
  const command = separatorIndex >= 0 ? args.slice(separatorIndex + 1) : [];

  const options: Options = {
    format: "text",
    mode: "run",
    intervalMs: 500,
    timeoutMs: 0,
    outputLimit: 4000,
    runs: 5,
    warmupRuns: 0,
    command,
  };

  for (let index = 0; index < optionArgs.length; index += 1) {
    const arg = optionArgs[index];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }

    if (arg === "--format") {
      options.format = parseFormat(optionArgs[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--format=")) {
      options.format = parseFormat(arg.slice("--format=".length));
      continue;
    }

    if (arg === "--mode") {
      options.mode = parseMode(optionArgs[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--mode=")) {
      options.mode = parseMode(arg.slice("--mode=".length));
      continue;
    }

    if (arg === "--interval") {
      options.intervalMs = parsePositiveInt(optionArgs[index + 1], "interval");
      index += 1;
      continue;
    }

    if (arg.startsWith("--interval=")) {
      options.intervalMs = parsePositiveInt(
        arg.slice("--interval=".length),
        "interval",
      );
      continue;
    }

    if (arg === "--timeout") {
      options.timeoutMs = parseNonNegativeInt(optionArgs[index + 1], "timeout");
      index += 1;
      continue;
    }

    if (arg.startsWith("--timeout=")) {
      options.timeoutMs = parseNonNegativeInt(
        arg.slice("--timeout=".length),
        "timeout",
      );
      continue;
    }

    if (arg === "--output-limit") {
      options.outputLimit = parseNonNegativeInt(
        optionArgs[index + 1],
        "output-limit",
      );
      index += 1;
      continue;
    }

    if (arg.startsWith("--output-limit=")) {
      options.outputLimit = parseNonNegativeInt(
        arg.slice("--output-limit=".length),
        "output-limit",
      );
      continue;
    }

    if (arg === "--runs") {
      options.runs = parsePositiveInt(optionArgs[index + 1], "runs");
      index += 1;
      continue;
    }

    if (arg.startsWith("--runs=")) {
      options.runs = parsePositiveInt(arg.slice("--runs=".length), "runs");
      continue;
    }

    if (arg === "--warmup") {
      options.warmupRuns = parseNonNegativeInt(optionArgs[index + 1], "warmup");
      index += 1;
      continue;
    }

    if (arg.startsWith("--warmup=")) {
      options.warmupRuns = parseNonNegativeInt(
        arg.slice("--warmup=".length),
        "warmup",
      );
      continue;
    }

    throw new Error(`Khong ho tro option: ${arg}`);
  }

  if (options.command.length === 0) {
    throw new Error("Thieu command can do. Dung cu phap: exec-metrics -- <command> [args...]");
  }

  return options;
}

function printHelp(): void {
  console.log(`exec-metrics

Chay command va do metric trong luc thuc thi.

Options:
  --mode <run|benchmark>      Kieu chay, mac dinh: run
  --format <text|json>        Dinh dang output, mac dinh: text
  --interval <ms>             Chu ky sample CPU/RAM, mac dinh: 500
  --timeout <ms>              Tu dong kill neu qua thoi gian, mac dinh: 0
  --output-limit <bytes>      Gioi han preview stdout/stderr, mac dinh: 4000
  --runs <n>                  So lan chay khi benchmark, mac dinh: 5
  --warmup <n>                So lan warmup truoc benchmark, mac dinh: 0
  -h, --help                  Hien tro giup

Usage:
  node dist/tools/exec-metrics/index.js -- node script.js
  node dist/tools/exec-metrics/index.js --mode benchmark --runs 10 -- npm run build
`);
}

function parseFormat(value: string | undefined): Format {
  if (value === "json" || value === "text") {
    return value;
  }
  throw new Error(`Format khong hop le: ${value ?? "(thieu gia tri)"}`);
}

function parseMode(value: string | undefined): Mode {
  if (value === "run" || value === "benchmark") {
    return value;
  }
  throw new Error(`Mode khong hop le: ${value ?? "(thieu gia tri)"}`);
}

function parsePositiveInt(value: string | undefined, name: string): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} khong hop le: ${value ?? "(thieu gia tri)"}`);
  }
  return parsed;
}

function parseNonNegativeInt(value: string | undefined, name: string): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${name} khong hop le: ${value ?? "(thieu gia tri)"}`);
  }
  return parsed;
}

async function runSingle(options: Options): Promise<RunSummary> {
  return {
    kind: "run",
    command: options.command,
    platform: os.platform(),
    result: await collectRunMetrics(options),
  };
}

async function runBenchmark(options: Options): Promise<BenchmarkSummary> {
  for (let index = 0; index < options.warmupRuns; index += 1) {
    await collectRunMetrics(options);
  }

  const results: RunMetrics[] = [];
  for (let index = 0; index < options.runs; index += 1) {
    results.push(await collectRunMetrics(options));
  }

  const durations = results.map((result) => result.durationMs);
  const cpuPeaks = results
    .map((result) => result.cpuPercent.max)
    .filter((value): value is number => value != null);
  const memoryPeaks = results
    .map((result) => result.memory.maxRssBytes)
    .filter((value): value is number => value != null);

  return {
    kind: "benchmark",
    command: options.command,
    platform: os.platform(),
    runs: options.runs,
    warmupRuns: options.warmupRuns,
    stats: {
      durationMs: createStats(durations),
      cpuPercentMax: createStats(cpuPeaks),
      memoryMaxRssBytes: createStats(memoryPeaks),
    },
    allSucceeded: results.every((result) => result.success),
    results,
  };
}

async function collectRunMetrics(options: Options): Promise<RunMetrics> {
  const startedAt = new Date();
  const startedHr = process.hrtime.bigint();
  const warnings: string[] = [];
  let stdout = "";
  let stderr = "";
  let timedOut = false;

  const child = spawn(options.command[0], options.command.slice(1), {
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
  });

  if (!child.pid) {
    throw new Error("Khong lay duoc PID cua tien trinh con");
  }

  child.stdout?.setEncoding("utf8");
  child.stderr?.setEncoding("utf8");

  child.stdout?.on("data", (chunk: string) => {
    stdout += chunk;
  });

  child.stderr?.on("data", (chunk: string) => {
    stderr += chunk;
  });

  const samples: ResourceSample[] = [];
  const sampler = setInterval(() => {
    const sample = safeSampleProcess(child, warnings, startedHr);
    if (sample) {
      samples.push(sample);
    }
  }, options.intervalMs);

  let timeoutHandle: NodeJS.Timeout | null = null;
  if (options.timeoutMs > 0) {
    timeoutHandle = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, options.timeoutMs);
  }

  const result = await waitForExit(child);
  clearInterval(sampler);
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
  }

  const finalSample = safeSampleProcess(child, warnings, startedHr);
  if (finalSample) {
    samples.push(finalSample);
  }

  const finishedAt = new Date();
  const durationMs = Number(process.hrtime.bigint() - startedHr) / 1_000_000;
  const rssValues = samples
    .map((sample) => sample.rssBytes)
    .filter((value): value is number => value != null);
  const cpuValues = samples
    .map((sample) => sample.cpuPercent)
    .filter((value): value is number => value != null);

  const metrics: RunMetrics = {
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: round(durationMs, 2),
    exitCode: result.exitCode,
    signal: result.signal,
    timedOut,
    success: !timedOut && result.exitCode === 0,
    samples: samples.length,
    cpuPercent: {
      max: cpuValues.length > 0 ? round(Math.max(...cpuValues), 2) : null,
      avg: cpuValues.length > 0 ? round(average(cpuValues), 2) : null,
      last: cpuValues.length > 0 ? round(cpuValues[cpuValues.length - 1], 2) : null,
    },
    memory: {
      maxRssBytes: rssValues.length > 0 ? Math.max(...rssValues) : null,
      lastRssBytes: rssValues.length > 0 ? rssValues[rssValues.length - 1] : null,
    },
    output: {
      stdoutBytes: Buffer.byteLength(stdout, "utf8"),
      stderrBytes: Buffer.byteLength(stderr, "utf8"),
      stdoutPreview: clipText(stdout, options.outputLimit),
      stderrPreview: clipText(stderr, options.outputLimit),
    },
  };

  if (warnings.length > 0) {
    metrics.warnings = Array.from(new Set(warnings));
  }

  return metrics;
}

function waitForExit(child: ChildProcess): Promise<{
  exitCode: number | null;
  signal: NodeJS.Signals | null;
}> {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (exitCode, signal) => {
      resolve({ exitCode, signal });
    });
  });
}

function safeSampleProcess(
  child: ChildProcess,
  warnings: string[],
  startedHr: bigint,
): ResourceSample | null {
  if (!child.pid || child.exitCode != null) {
    return null;
  }

  try {
    if (process.platform === "win32") {
      return sampleWindowsProcess(child.pid, startedHr);
    }

    return samplePosixProcess(child.pid, startedHr);
  } catch (error) {
    warnings.push(`Khong lay duoc process metrics: ${normalizeSpawnError(error)}`);
    return null;
  }
}

function sampleWindowsProcess(pid: number, startedHr: bigint): ResourceSample {
  const output = execFileSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      "Get-Process -Id " +
        pid +
        " -ErrorAction Stop | " +
        "Select-Object WorkingSet64, CPU | ConvertTo-Json -Compress",
    ],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  ).trim();

  const payload = JSON.parse(output) as {
    WorkingSet64?: string | number | null;
    CPU?: string | number | null;
  };
  const cpuSeconds = Number(payload.CPU ?? 0);
  const elapsedSeconds =
    Number(process.hrtime.bigint() - startedHr) / 1_000_000_000;

  return {
    timestampMs: round(elapsedSeconds * 1000, 2),
    rssBytes: Number(payload.WorkingSet64 ?? 0),
    cpuPercent:
      elapsedSeconds > 0
        ? round((cpuSeconds / elapsedSeconds) * 100 / os.cpus().length, 2)
        : 0,
  };
}

function samplePosixProcess(pid: number, startedHr: bigint): ResourceSample {
  const output = execFileSync("ps", ["-p", String(pid), "-o", "rss=,%cpu="], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  })
    .trim()
    .split(/\r?\n/)[0];

  if (!output) {
    throw new Error("Process da ket thuc");
  }

  const parts = output.trim().split(/\s+/);
  const rssKb = Number(parts[0] ?? 0);
  const cpuPercent = Number(parts[1] ?? 0);
  const elapsedSeconds =
    Number(process.hrtime.bigint() - startedHr) / 1_000_000_000;

  return {
    timestampMs: round(elapsedSeconds * 1000, 2),
    rssBytes: rssKb * 1024,
    cpuPercent: elapsedSeconds > 0 ? round(cpuPercent, 2) : 0,
  };
}

function createStats(values: number[]): {
  min: number | null;
  avg: number | null;
  max: number | null;
  p95: number | null;
} {
  if (values.length === 0) {
    return { min: null, avg: null, max: null, p95: null };
  }

  const sorted = [...values].sort((left, right) => left - right);
  return {
    min: round(sorted[0], 2),
    avg: round(average(sorted), 2),
    max: round(sorted[sorted.length - 1], 2),
    p95: round(percentile(sorted, 0.95), 2),
  };
}

function percentile(sortedValues: number[], ratio: number): number {
  if (sortedValues.length === 1) {
    return sortedValues[0];
  }

  const index = (sortedValues.length - 1) * ratio;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) {
    return sortedValues[lower];
  }

  const weight = index - lower;
  return (
    sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight
  );
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clipText(value: string, limit: number): string {
  if (limit === 0 || value.length <= limit) {
    return value;
  }
  return `${value.slice(0, limit)}\n... [truncated ${value.length - limit} chars]`;
}

function formatText(summary: RunSummary | BenchmarkSummary): string {
  return summary.kind === "benchmark"
    ? formatBenchmarkText(summary)
    : formatRunText(summary);
}

function formatRunText(summary: RunSummary): string {
  const result = summary.result;
  const lines: string[] = [];
  lines.push("EXEC METRICS");
  lines.push(`mode: run`);
  lines.push(`command: ${summary.command.join(" ")}`);
  lines.push(`platform: ${summary.platform}`);
  lines.push(`startedAt: ${result.startedAt}`);
  lines.push(`finishedAt: ${result.finishedAt}`);
  lines.push(`durationMs: ${result.durationMs}`);
  lines.push(`exitCode: ${result.exitCode ?? "null"}`);
  lines.push(`signal: ${result.signal ?? "null"}`);
  lines.push(`timedOut: ${result.timedOut}`);
  lines.push(`success: ${result.success}`);
  lines.push(`samples: ${result.samples}`);
  lines.push(
    `cpuPercent: max=${formatNullable(result.cpuPercent.max)} avg=${formatNullable(result.cpuPercent.avg)} last=${formatNullable(result.cpuPercent.last)}`,
  );
  lines.push(
    `memory: maxRss=${formatBytes(result.memory.maxRssBytes)} lastRss=${formatBytes(result.memory.lastRssBytes)}`,
  );
  lines.push(
    `stdoutBytes: ${result.output.stdoutBytes} | stderrBytes: ${result.output.stderrBytes}`,
  );

  appendOutputSections(lines, result);
  return lines.join("\n");
}

function formatBenchmarkText(summary: BenchmarkSummary): string {
  const lines: string[] = [];
  lines.push("EXEC METRICS");
  lines.push("mode: benchmark");
  lines.push(`command: ${summary.command.join(" ")}`);
  lines.push(`platform: ${summary.platform}`);
  lines.push(`runs: ${summary.runs}`);
  lines.push(`warmupRuns: ${summary.warmupRuns}`);
  lines.push(`allSucceeded: ${summary.allSucceeded}`);
  lines.push(
    `durationMs: min=${formatNullable(summary.stats.durationMs.min)} avg=${formatNullable(summary.stats.durationMs.avg)} max=${formatNullable(summary.stats.durationMs.max)} p95=${formatNullable(summary.stats.durationMs.p95)}`,
  );
  lines.push(
    `cpuPercentMax: min=${formatNullable(summary.stats.cpuPercentMax.min)} avg=${formatNullable(summary.stats.cpuPercentMax.avg)} max=${formatNullable(summary.stats.cpuPercentMax.max)} p95=${formatNullable(summary.stats.cpuPercentMax.p95)}`,
  );
  lines.push(
    `memoryMaxRss: min=${formatBytes(summary.stats.memoryMaxRssBytes.min)} avg=${formatBytes(summary.stats.memoryMaxRssBytes.avg)} max=${formatBytes(summary.stats.memoryMaxRssBytes.max)} p95=${formatBytes(summary.stats.memoryMaxRssBytes.p95)}`,
  );

  for (let index = 0; index < summary.results.length; index += 1) {
    const result = summary.results[index];
    lines.push("");
    lines.push(`RUN ${index + 1}`);
    lines.push(
      `durationMs=${result.durationMs} exitCode=${result.exitCode ?? "null"} success=${result.success} cpuMax=${formatNullable(result.cpuPercent.max)} rssMax=${formatBytes(result.memory.maxRssBytes)}`,
    );
    appendOutputSections(lines, result);
  }

  return lines.join("\n");
}

function appendOutputSections(lines: string[], result: RunMetrics): void {
  if (result.output.stdoutPreview.length > 0) {
    lines.push("");
    lines.push("STDOUT PREVIEW");
    lines.push(result.output.stdoutPreview);
  }

  if (result.output.stderrPreview.length > 0) {
    lines.push("");
    lines.push("STDERR PREVIEW");
    lines.push(result.output.stderrPreview);
  }

  if (result.warnings && result.warnings.length > 0) {
    lines.push("");
    lines.push("WARNINGS");
    for (const warning of result.warnings) {
      lines.push(`- ${warning}`);
    }
  }
}

function formatBytes(value: number | null): string {
  if (value == null || !Number.isFinite(value) || value < 0) {
    return "n/a";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let current = value;
  let index = 0;
  while (current >= 1024 && index < units.length - 1) {
    current /= 1024;
    index += 1;
  }
  return `${round(current, current >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatNullable(value: number | null): string {
  return value == null ? "n/a" : String(value);
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function stringifyError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function normalizeSpawnError(error: unknown): string {
  const message = stringifyError(error);
  if (message.includes("EPERM")) {
    return "child process metrics bi chan trong moi truong hien tai";
  }
  if (message.includes("ENOENT")) {
    return "command hoac he thong sampling khong ton tai";
  }
  return message;
}

void main();
