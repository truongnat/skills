#!/usr/bin/env node

import os from "node:os";
import { execFileSync } from "node:child_process";

type Mode = "summary" | "processes" | "all";
type Format = "json" | "text";
type ProcessSort = "cpu" | "memory" | "pid" | "name";

type Options = {
  mode: Mode;
  format: Format;
  limit: number;
  sort: ProcessSort;
};

type MemoryInfo = {
  totalBytes: number;
  freeBytes: number;
  usedBytes: number;
  usedPercent: number;
};

type CpuInfo = {
  model: string;
  cores: number;
  architecture: string;
  loadAverage: number[];
};

type DriveInfo = {
  name: string;
  mountPoint: string;
  totalBytes: number;
  freeBytes: number;
  usedBytes: number;
  usedPercent: number;
  volumeName?: string;
  fileSystem?: string;
};

type ProcessInfo = {
  pid: number;
  name: string;
  cpuPercent: number | null;
  memoryBytes: number;
};

type SystemSummary = {
  hostname: string;
  platform: NodeJS.Platform;
  release: string;
  uptimeSeconds: number;
  uptimeHuman: string;
  cpu: CpuInfo;
  memory: MemoryInfo;
  storage: DriveInfo[];
  processCount: number | null;
};

type Snapshot = {
  capturedAt: string;
  mode: Mode;
  summary?: SystemSummary;
  processes?: ProcessInfo[];
  warnings?: string[];
};

function main(): void {
  try {
    const options = parseArgs(process.argv.slice(2));
    const warnings: string[] = [];
    const snapshot: Snapshot = {
      capturedAt: new Date().toISOString(),
      mode: options.mode,
    };

    if (options.mode === "summary" || options.mode === "all") {
      snapshot.summary = getSystemSummary(warnings);
    }

    if (options.mode === "processes" || options.mode === "all") {
      snapshot.processes = getProcesses(options, warnings);
      if (snapshot.summary) {
        snapshot.summary.processCount = snapshot.processes.length;
      }
    }

    if (warnings.length > 0) {
      snapshot.warnings = warnings;
    }

    if (options.format === "json") {
      console.log(JSON.stringify(snapshot, null, 2));
      return;
    }

    console.log(formatText(snapshot, options));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}

function parseArgs(args: string[]): Options {
  const options: Options = {
    mode: "all",
    format: "text",
    limit: 15,
    sort: "cpu",
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }

    if (arg === "--mode") {
      options.mode = parseMode(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--mode=")) {
      options.mode = parseMode(arg.slice("--mode=".length));
      continue;
    }

    if (arg === "--format") {
      options.format = parseFormat(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--format=")) {
      options.format = parseFormat(arg.slice("--format=".length));
      continue;
    }

    if (arg === "--limit") {
      options.limit = parseLimit(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--limit=")) {
      options.limit = parseLimit(arg.slice("--limit=".length));
      continue;
    }

    if (arg === "--sort") {
      options.sort = parseSort(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--sort=")) {
      options.sort = parseSort(arg.slice("--sort=".length));
      continue;
    }

    throw new Error(`Khong ho tro option: ${arg}`);
  }

  return options;
}

function printHelp(): void {
  console.log(`system-monitor

Hien thong tin he thong va tien trinh dang chay.

Options:
  --mode <summary|processes|all>   Chon pham vi thong tin, mac dinh: all
  --format <text|json>             Dinh dang output, mac dinh: text
  --limit <n>                      So tien trinh tra ve, mac dinh: 15
  --sort <cpu|memory|pid|name>     Cach sap xep tien trinh, mac dinh: cpu
  -h, --help                       Hien tro giup
`);
}

function parseMode(value: string | undefined): Mode {
  if (value === "summary" || value === "processes" || value === "all") {
    return value;
  }
  throw new Error(`Mode khong hop le: ${value ?? "(thieu gia tri)"}`);
}

function parseFormat(value: string | undefined): Format {
  if (value === "json" || value === "text") {
    return value;
  }
  throw new Error(`Format khong hop le: ${value ?? "(thieu gia tri)"}`);
}

function parseSort(value: string | undefined): ProcessSort {
  if (value === "cpu" || value === "memory" || value === "pid" || value === "name") {
    return value;
  }
  throw new Error(`Sort khong hop le: ${value ?? "(thieu gia tri)"}`);
}

function parseLimit(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Limit khong hop le: ${value ?? "(thieu gia tri)"}`);
  }
  return parsed;
}

function getSystemSummary(warnings: string[]): SystemSummary {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const cpuModel = os.cpus()[0]?.model ?? "unknown";

  return {
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    uptimeSeconds: os.uptime(),
    uptimeHuman: formatDuration(os.uptime()),
    cpu: {
      model: cpuModel,
      cores: os.cpus().length,
      architecture: os.arch(),
      loadAverage: os.loadavg().map((value) => round(value, 2)),
    },
    memory: {
      totalBytes: totalMemory,
      freeBytes: freeMemory,
      usedBytes: usedMemory,
      usedPercent: percentage(usedMemory, totalMemory),
    },
    storage: getStorage(warnings),
    processCount: null,
  };
}

function getStorage(warnings: string[]): DriveInfo[] {
  try {
    if (process.platform === "win32") {
      return getWindowsStorage();
    }

    return getPosixStorage();
  } catch (error) {
    warnings.push(`Khong lay duoc storage: ${stringifyError(error)}`);
    return [];
  }
}

function getWindowsStorage(): DriveInfo[] {
  const args = [
    "-NoProfile",
    "-Command",
    "Get-CimInstance Win32_LogicalDisk -Filter \"DriveType=3\" | " +
      "Select-Object DeviceID, VolumeName, Size, FreeSpace | ConvertTo-Json -Compress",
  ];
  const rows = parseWindowsJsonOutput<WindowsDriveRow | WindowsDriveRow[]>(args);
  const list = Array.isArray(rows) ? rows : rows ? [rows] : [];

  return list.map((row) => {
    const totalBytes = Number(row.Size ?? 0);
    const freeBytes = Number(row.FreeSpace ?? 0);
    const usedBytes = Math.max(totalBytes - freeBytes, 0);
    return {
      name: row.DeviceID ?? "unknown",
      mountPoint: row.DeviceID ?? "unknown",
      totalBytes,
      freeBytes,
      usedBytes,
      usedPercent: percentage(usedBytes, totalBytes),
      volumeName: row.VolumeName ?? undefined,
    };
  });
}

function getPosixStorage(): DriveInfo[] {
  const output = execFileSync("df", ["-kP"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const rows: string[][] = output
    .split(/\r?\n/)
    .slice(1)
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0)
    .map((line: string) => line.split(/\s+/))
    .filter((parts: string[]) => parts.length >= 6);

  return rows.map((parts: string[]) => {
      const totalBytes = Number(parts[1]) * 1024;
      const usedBytes = Number(parts[2]) * 1024;
      const freeBytes = Number(parts[3]) * 1024;
      return {
        name: parts[0],
        mountPoint: parts[5],
        totalBytes,
        freeBytes,
        usedBytes,
        usedPercent: percentage(usedBytes, totalBytes),
        fileSystem: parts[0],
      };
    });
}

function getProcesses(options: Options, warnings: string[]): ProcessInfo[] {
  try {
    if (process.platform === "win32") {
      return getWindowsProcesses(options);
    }

    return getPosixProcesses(options);
  } catch (error) {
    warnings.push(`Khong lay duoc danh sach tien trinh: ${stringifyError(error)}`);
    return [];
  }
}

function getWindowsProcesses(options: Options): ProcessInfo[] {
  const args = [
    "-NoProfile",
    "-Command",
    "Get-Process | " +
      "Select-Object Id, ProcessName, CPU, @{Name='MemoryBytes';Expression={$_.WorkingSet64}} | " +
      "ConvertTo-Json -Compress",
  ];
  const rows = parseWindowsJsonOutput<WindowsProcessRow | WindowsProcessRow[]>(args);
  const list = Array.isArray(rows) ? rows : rows ? [rows] : [];

  return sortProcesses(
    list.map((row) => ({
      pid: Number(row.Id ?? 0),
      name: row.ProcessName ?? "unknown",
      cpuPercent: row.CPU == null ? null : round(Number(row.CPU), 2),
      memoryBytes: Number(row.MemoryBytes ?? 0),
    })),
    options.sort,
  ).slice(0, options.limit);
}

function getPosixProcesses(options: Options): ProcessInfo[] {
  const output = execFileSync("ps", ["-axo", "pid=,comm=,%cpu=,rss="], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const rows: string[][] = output
    .split(/\r?\n/)
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0)
    .map((line: string) => line.split(/\s+/, 4))
    .filter((parts: string[]) => parts.length === 4);

  const processes = rows.map((parts: string[]) => ({
      pid: Number(parts[0]),
      name: parts[1],
      cpuPercent: Number.isFinite(Number(parts[2])) ? round(Number(parts[2]), 2) : null,
      memoryBytes: Number(parts[3]) * 1024,
    }));

  return sortProcesses(processes, options.sort).slice(0, options.limit);
}

function sortProcesses(processes: ProcessInfo[], sort: ProcessSort): ProcessInfo[] {
  return [...processes].sort((left, right) => {
    switch (sort) {
      case "cpu":
        return (right.cpuPercent ?? -1) - (left.cpuPercent ?? -1);
      case "memory":
        return right.memoryBytes - left.memoryBytes;
      case "pid":
        return left.pid - right.pid;
      case "name":
        return left.name.localeCompare(right.name);
    }
  });
}

function formatText(snapshot: Snapshot, options: Options): string {
  const lines: string[] = [];

  lines.push("SYSTEM MONITOR");
  lines.push(`capturedAt: ${snapshot.capturedAt}`);
  lines.push(`mode: ${snapshot.mode}`);

  if (snapshot.summary) {
    const summary = snapshot.summary;
    lines.push("");
    lines.push("SUMMARY");
    lines.push(`hostname: ${summary.hostname}`);
    lines.push(`platform: ${summary.platform} ${summary.release}`);
    lines.push(`uptime: ${summary.uptimeHuman}`);
    lines.push(
      `cpu: ${summary.cpu.model} | cores=${summary.cpu.cores} | arch=${summary.cpu.architecture} | load=${summary.cpu.loadAverage.join(", ")}`,
    );
    lines.push(
      `memory: used=${formatBytes(summary.memory.usedBytes)} / total=${formatBytes(summary.memory.totalBytes)} (${summary.memory.usedPercent}%) | free=${formatBytes(summary.memory.freeBytes)}`,
    );
    if (summary.processCount != null) {
      lines.push(`processCount: ${summary.processCount}`);
    }

    lines.push("");
    lines.push("STORAGE");
    if (summary.storage.length === 0) {
      lines.push("khong co du lieu storage");
    } else {
      for (const drive of summary.storage) {
        const label = drive.volumeName ? `${drive.name} (${drive.volumeName})` : drive.name;
        lines.push(
          `${label}: free=${formatBytes(drive.freeBytes)} / total=${formatBytes(drive.totalBytes)} (${drive.usedPercent}% used) mount=${drive.mountPoint}`,
        );
      }
    }
  }

  if (snapshot.processes) {
    lines.push("");
    lines.push(
      `PROCESSES top=${snapshot.processes.length} sort=${options.sort} requestedLimit=${options.limit}`,
    );
    if (snapshot.processes.length === 0) {
      lines.push("khong co du lieu process");
    } else {
      for (const processInfo of snapshot.processes) {
        lines.push(
          `pid=${processInfo.pid} name=${processInfo.name} cpu=${formatCpu(processInfo.cpuPercent)} mem=${formatBytes(processInfo.memoryBytes)}`,
        );
      }
    }
  }

  if (snapshot.warnings && snapshot.warnings.length > 0) {
    lines.push("");
    lines.push("WARNINGS");
    for (const warning of snapshot.warnings) {
      lines.push(`- ${warning}`);
    }
  }

  return lines.join("\n");
}

function parseJsonCommandOutput<T>(command: string, args: string[]): T {
  const output = execFileSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

  if (output.length === 0) {
    return [] as T;
  }

  return JSON.parse(output) as T;
}

function parseWindowsJsonOutput<T>(args: string[]): T {
  const candidates = ["powershell.exe", "pwsh.exe"];
  let lastError: unknown;

  for (const command of candidates) {
    try {
      return parseJsonCommandOutput<T>(command, args);
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(normalizeWindowsSpawnError(lastError));
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${round(value, value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDuration(seconds: number): string {
  const totalSeconds = Math.floor(seconds);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const parts = [
    days > 0 ? `${days}d` : "",
    hours > 0 ? `${hours}h` : "",
    minutes > 0 ? `${minutes}m` : "",
    `${remainingSeconds}s`,
  ].filter(Boolean);

  return parts.join(" ");
}

function formatCpu(value: number | null): string {
  return value == null ? "n/a" : `${round(value, 2)}%`;
}

function percentage(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return round((part / total) * 100, 2);
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function stringifyError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function normalizeWindowsSpawnError(error: unknown): string {
  const message = stringifyError(error);
  if (message.includes("EPERM")) {
    return "PowerShell child process bi chan trong moi truong hien tai";
  }
  if (message.includes("ENOENT")) {
    return "Khong tim thay PowerShell tren may";
  }
  return message;
}

type WindowsDriveRow = {
  DeviceID?: string;
  VolumeName?: string | null;
  Size?: string | number | null;
  FreeSpace?: string | number | null;
};

type WindowsProcessRow = {
  Id?: string | number | null;
  ProcessName?: string | null;
  CPU?: string | number | null;
  MemoryBytes?: string | number | null;
};

main();
