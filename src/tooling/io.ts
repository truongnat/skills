import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

export async function resolveTextInput(options: {
  filePath?: string | null;
  inlineText?: string | null;
  allowStdin?: boolean;
}): Promise<{
  content: string;
  source: "file" | "inline" | "stdin";
  filePath?: string;
}> {
  if (options.filePath) {
    const resolved = path.resolve(options.filePath);
    if (!existsSync(resolved)) {
      throw new Error(`Khong tim thay file: ${resolved}`);
    }
    return {
      content: readFileSync(resolved, "utf8"),
      source: "file",
      filePath: resolved,
    };
  }

  if (options.inlineText != null) {
    return {
      content: options.inlineText,
      source: "inline",
    };
  }

  if (options.allowStdin !== false && !process.stdin.isTTY) {
    const content = await readStdin();
    if (content.length > 0) {
      return {
        content,
        source: "stdin",
      };
    }
  }

  throw new Error("Khong co input hop le");
}

export function parseJsonText<T>(content: string, label: string): T {
  try {
    return JSON.parse(content) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} khong phai JSON hop le: ${message}`);
  }
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function parseCsv(content: string): string[][] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}
