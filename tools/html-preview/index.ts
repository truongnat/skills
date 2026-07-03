#!/usr/bin/env node

import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { spawn } from "node:child_process";
import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { URL } from "node:url";

type Format = "text" | "json" | "ndjson";
type Mode = "once" | "stream";

type Options = {
  filePath: string | null;
  htmlInline: string | null;
  host: string;
  port: number;
  mode: Mode;
  format: Format;
  timeoutMs: number;
  openBrowser: boolean;
  snapshot: boolean;
};

type PreviewEvent = {
  id: number;
  type: string;
  payload: unknown;
  source: "browser";
  timestamp: string;
  snapshotHtml?: string;
};

type SourceData = {
  html: string;
  baseDir: string | null;
  source: "file" | "inline" | "stdin";
  filePath?: string;
};

type OnceResult = {
  ok: true;
  mode: "once";
  url: string;
  source: SourceData["source"];
  event: PreviewEvent | null;
  timedOut: boolean;
};

function main(): void {
  run().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}

async function run(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const sourceData = await resolveSource(options);
  const state = createState(options, sourceData);
  const server = createPreviewServer(state);

  const timeoutHandle =
    options.timeoutMs > 0
      ? setTimeout(() => {
          state.timedOut = true;
          if (state.mode === "once") {
            finishOnce(state, null);
          } else {
            writeTextLine(state, "timeout reached, server will stop");
            shutdown(state);
          }
        }, options.timeoutMs)
      : null;

  state.cleanup.push(() => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  });

  process.on("SIGINT", () => shutdown(state));
  process.on("SIGTERM", () => shutdown(state));

  await new Promise<void>((resolve) => {
    server.listen(options.port, options.host, () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Khong lay duoc dia chi server");
  }

  state.url = `http://${options.host}:${address.port}/`;
  if (state.openBrowser) {
    tryOpenPreview(state.url);
  }
  announceServer(state);
}

function parseArgs(args: string[]): Options {
  const options: Options = {
    filePath: null,
    htmlInline: null,
    host: "127.0.0.1",
    port: 0,
    mode: "once",
    format: "text",
    timeoutMs: 0,
    openBrowser: false,
    snapshot: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }

    if (arg === "--file") {
      options.filePath = requireValue(args[index + 1], "file");
      index += 1;
      continue;
    }

    if (arg.startsWith("--file=")) {
      options.filePath = requireValue(arg.slice("--file=".length), "file");
      continue;
    }

    if (arg === "--html") {
      options.htmlInline = requireValue(args[index + 1], "html");
      index += 1;
      continue;
    }

    if (arg.startsWith("--html=")) {
      options.htmlInline = requireValue(arg.slice("--html=".length), "html");
      continue;
    }

    if (arg === "--host") {
      options.host = requireValue(args[index + 1], "host");
      index += 1;
      continue;
    }

    if (arg.startsWith("--host=")) {
      options.host = requireValue(arg.slice("--host=".length), "host");
      continue;
    }

    if (arg === "--port") {
      options.port = parsePort(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--port=")) {
      options.port = parsePort(arg.slice("--port=".length));
      continue;
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

    if (arg === "--timeout") {
      options.timeoutMs = parseTimeout(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg.startsWith("--timeout=")) {
      options.timeoutMs = parseTimeout(arg.slice("--timeout=".length));
      continue;
    }

    if (arg === "--open") {
      options.openBrowser = true;
      continue;
    }

    if (arg === "--snapshot") {
      options.snapshot = true;
      continue;
    }

    throw new Error(`Khong ho tro option: ${arg}`);
  }

  return options;
}

function printHelp(): void {
  console.log(`html-preview

Preview HTML de user xem va gui ket qua tu trang ve tool theo thoi gian thuc.

Options:
  --file <path>               Duong dan file HTML
  --html <content>            HTML inline
  --host <host>               Host bind server, mac dinh: 127.0.0.1
  --port <port>               Port bind server, mac dinh: 0 (chon tu dong)
  --mode <once|stream>        once: nhan event dau tien roi thoat, mac dinh: once
  --format <text|json|ndjson> Dinh dang output, mac dinh: text
  --timeout <ms>              Tu dong stop sau timeout, mac dinh: 0
  --open                      Tu mo preview URL trong browser mac dinh
  --snapshot                  Gan HTML hien tai cua trang vao moi event
  -h, --help                  Hien tro giup

Input:
  - Dung --file <path>
  - Dung --html "<html>..."
  - Hoac pipe HTML vao stdin

Bridge trong browser:
  window.agentPreview.emit(payload, { type?: string, close?: boolean })
  window.agentPreview.close(payload, type?)

Auto emit:
  - click vao element co data-agent-preview-value
  - submit form co data-agent-preview-submit
`);
}

async function resolveSource(options: Options): Promise<SourceData> {
  if (options.filePath) {
    const resolved = path.resolve(options.filePath);
    if (!existsSync(resolved)) {
      throw new Error(`Khong tim thay file: ${resolved}`);
    }
    const html = readFileSync(resolved, "utf8");
    return {
      html,
      baseDir: path.dirname(resolved),
      source: "file",
      filePath: resolved,
    };
  }

  if (options.htmlInline != null) {
    return {
      html: options.htmlInline,
      baseDir: null,
      source: "inline",
    };
  }

  if (!process.stdin.isTTY) {
    const html = await readStdin();
    if (html.trim().length > 0) {
      return {
        html,
        baseDir: null,
        source: "stdin",
      };
    }
  }

  throw new Error("Thieu input HTML. Dung --file, --html, hoac pipe stdin");
}

function createState(options: Options, sourceData: SourceData) {
  const state = {
    mode: options.mode,
    format: options.format,
    sourceData,
    bridgeScript: createBridgeScript({ snapshot: options.snapshot }),
    designCss: loadDesignSystemCss(),
    openBrowser: options.openBrowser,
    eventId: 0,
    url: "",
    serverClosed: false,
    timedOut: false,
    cleanup: [] as Array<() => void>,
    server: null as ReturnType<typeof createServer> | null,
  };

  return state;
}

function createPreviewServer(state: ReturnType<typeof createState>) {
  const server = createServer(async (request, response) => {
    const method = request.method ?? "GET";
    const url = new URL(request.url ?? "/", "http://localhost");

    if (method === "GET" && url.pathname === "/") {
      respondHtml(
        response,
        injectBridge(state.sourceData.html, state.bridgeScript, state.designCss ?? null),
      );
      return;
    }

    if (method === "POST" && url.pathname === "/__agent_preview/event") {
      const payload = await readJsonBody(request);
      const event = createEvent(state, payload);
      handleEvent(state, event);
      respondJson(response, { ok: true, received: event.id });
      return;
    }

    if (
      method === "GET" &&
      state.sourceData.baseDir &&
      url.pathname !== "/favicon.ico"
    ) {
      serveStaticAsset(state.sourceData.baseDir, url.pathname, response);
      return;
    }

    respondNotFound(response);
  });

  state.server = server;
  return server;
}

function createEvent(
  state: ReturnType<typeof createState>,
  payload: unknown,
): PreviewEvent {
  state.eventId += 1;
  const parsed =
    payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};

  return {
    id: state.eventId,
    type: typeof parsed.type === "string" ? parsed.type : "event",
    payload: "payload" in parsed ? parsed.payload : payload,
    source: "browser",
    timestamp: new Date().toISOString(),
    snapshotHtml:
      typeof parsed.snapshotHtml === "string" ? parsed.snapshotHtml : undefined,
  };
}

function handleEvent(
  state: ReturnType<typeof createState>,
  event: PreviewEvent,
): void {
  if (state.mode === "once") {
    finishOnce(state, event);
    return;
  }

  if (state.format === "ndjson" || state.format === "json") {
    process.stdout.write(`${JSON.stringify(event)}\n`);
    return;
  }

  writeTextLine(state, formatEventText(event));
}

function finishOnce(
  state: ReturnType<typeof createState>,
  event: PreviewEvent | null,
): void {
  const payload: OnceResult = {
    ok: true,
    mode: "once",
    url: state.url,
    source: state.sourceData.source,
    event,
    timedOut: state.timedOut,
  };

  if (state.format === "json" || state.format === "ndjson") {
    process.stdout.write(`${JSON.stringify(payload)}\n`);
  } else {
    if (event) {
      writeTextLine(state, `event received: ${formatEventText(event)}`);
    } else {
      writeTextLine(state, "no event received before stop");
    }
  }

  shutdown(state);
}

function announceServer(state: ReturnType<typeof createState>): void {
  if (state.mode === "once" && (state.format === "json" || state.format === "ndjson")) {
    process.stdout.write(
      `${JSON.stringify({
        ok: true,
        status: "listening",
        mode: state.mode,
        url: state.url,
        source: state.sourceData.source,
      })}\n`,
    );
    return;
  }

  writeTextLine(
    state,
    `preview listening at ${state.url} (source=${state.sourceData.source}, mode=${state.mode})`,
  );
}

function shutdown(state: ReturnType<typeof createState>): void {
  if (state.serverClosed) {
    return;
  }

  state.serverClosed = true;
  for (const cleanup of state.cleanup) {
    cleanup();
  }

  if (state.server) {
    state.server.close(() => {
      process.exit(0);
    });
    return;
  }

  process.exit(0);
}



function loadDesignSystemCss(): string | null {
  try {
    const cssPath = path.resolve(process.cwd(), "docs", "design-system-astryx.css");
    if (existsSync(cssPath)) {
      return readFileSync(cssPath, "utf8");
    }

    const mdPath = path.resolve(process.cwd(), "docs", "design-system-astryx.md");
    if (existsSync(mdPath)) {
      const md = readFileSync(mdPath, "utf8");
      const m = md.match(/```css\n([\s\S]*?)```/i);
      if (m) return m[1];
    }
  } catch (err) {
    // ignore
  }
  return null;
}

function injectBridge(html: string, bridgeScript: string, designCss: string | null): string {
  const scriptTag = `<script>${bridgeScript}</script>`;
  const styleTag = designCss ? `<style data-design-system>${designCss}</style>` : "";

  // Try inject into head if present
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${styleTag}${scriptTag}</head>`);
  }

  // Otherwise inject before closing body
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${styleTag}${scriptTag}</body>`);
  }

  return `${styleTag}\n${scriptTag}\n${html}`;
}

function createBridgeScript(config: { snapshot: boolean }): string {
  return `
(function () {
  var endpoint = "/__agent_preview/event";
  var includeSnapshot = ${config.snapshot ? "true" : "false"};

  function post(message) {
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });
  }

  function emit(payload, options) {
    var meta = options || {};
    return post({
      type: typeof meta.type === "string" ? meta.type : "event",
      payload: payload,
      snapshotHtml: includeSnapshot ? document.documentElement.outerHTML : undefined
    }).then(function () {
      if (meta.close) {
        try { window.close(); } catch (error) {}
      }
    });
  }

  function close(payload, type) {
    return emit(payload, { type: type || "close", close: true });
  }

  function serializeForm(form) {
    var data = {};
    var formData = new FormData(form);
    formData.forEach(function (value, key) {
      if (key in data) {
        var current = data[key];
        data[key] = Array.isArray(current) ? current.concat(value) : [current, value];
      } else {
        data[key] = value;
      }
    });
    return data;
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;
    var node = target.closest("[data-agent-preview-value]");
    if (!node) return;

    emit({
      value: node.getAttribute("data-agent-preview-value"),
      text: (node.textContent || "").trim(),
      tagName: node.tagName,
      id: node.id || null
    }, { type: "select" });
  });

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.hasAttribute("data-agent-preview-submit")) return;
    event.preventDefault();

    emit({
      formId: form.id || null,
      action: form.getAttribute("action"),
      method: form.getAttribute("method") || "GET",
      values: serializeForm(form)
    }, { type: "submit" });
  });

  window.agentPreview = {
    emit: emit,
    close: close
  };
})();
`.trim();
}

function serveStaticAsset(
  baseDir: string,
  requestPath: string,
  response: ServerResponse,
): void {
  const relativePath = decodeURIComponent(requestPath.replace(/^\/+/, ""));
  const absolutePath = path.resolve(baseDir, relativePath);
  const normalizedBaseDir = ensureTrailingSeparator(path.resolve(baseDir));

  if (!absolutePath.startsWith(normalizedBaseDir)) {
    respondNotFound(response);
    return;
  }

  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    respondNotFound(response);
    return;
  }

  const content = readFileSync(absolutePath);
  response.statusCode = 200;
  response.setHeader("Content-Type", getContentType(absolutePath));
  response.end(content);
}

function respondHtml(response: ServerResponse, html: string): void {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(html);
}

function respondJson(response: ServerResponse, payload: unknown): void {
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function respondNotFound(response: ServerResponse): void {
  response.statusCode = 404;
  response.end("Not Found");
}

function readJsonBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    request.setEncoding("utf8");
    request.on("data", (chunk: string) => {
      data += chunk;
    });
    request.on("end", () => {
      try {
        resolve(data.length > 0 ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function readStdin(): Promise<string> {
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

function writeTextLine(state: ReturnType<typeof createState>, message: string): void {
  process.stdout.write(`${message}\n`);
}

function formatEventText(event: PreviewEvent): string {
  const snapshotInfo =
    typeof event.snapshotHtml === "string"
      ? ` snapshotBytes=${Buffer.byteLength(event.snapshotHtml, "utf8")}`
      : "";
  return `id=${event.id} type=${event.type} payload=${JSON.stringify(event.payload)}${snapshotInfo}`;
}

function requireValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Thieu gia tri cho ${name}`);
  }
  return value;
}

function parseMode(value: string | undefined): Mode {
  if (value === "once" || value === "stream") {
    return value;
  }
  throw new Error(`Mode khong hop le: ${value ?? "(thieu gia tri)"}`);
}

function parseFormat(value: string | undefined): Format {
  if (value === "text" || value === "json" || value === "ndjson") {
    return value;
  }
  throw new Error(`Format khong hop le: ${value ?? "(thieu gia tri)"}`);
}

function parsePort(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 65535) {
    throw new Error(`Port khong hop le: ${value ?? "(thieu gia tri)"}`);
  }
  return parsed;
}

function parseTimeout(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Timeout khong hop le: ${value ?? "(thieu gia tri)"}`);
  }
  return parsed;
}

function ensureTrailingSeparator(value: string): string {
  return value.endsWith(path.sep) ? value : `${value}${path.sep}`;
}

function getContentType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

function tryOpenPreview(url: string): void {
  if (process.platform === "win32") {
    const child = spawn("cmd.exe", ["/c", "start", "", url], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
    return;
  }

  if (process.platform === "darwin") {
    const child = spawn("open", [url], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
    return;
  }

  const child = spawn("xdg-open", [url], {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}

main();
