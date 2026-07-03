import path from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { mkdtempSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

type PreviewOptions = {
  callerUrl: string;
  html: string;
  mode?: "once" | "stream";
  format?: "text" | "json" | "ndjson";
  open?: boolean;
  snapshot?: boolean;
  timeoutMs?: number;
};

export async function launchHtmlPreview(options: PreviewOptions): Promise<void> {
  const callerDir = path.dirname(fileURLToPath(options.callerUrl));
  const previewEntry = path.resolve(callerDir, "..", "html-preview", "index.js");
  const workDir = mkdtempSync(path.join(tmpdir(), "html-preview-"));
  const htmlPath = path.join(workDir, "preview.html");
  writeFileSync(htmlPath, options.html, "utf8");

  const args = [
    previewEntry,
    "--file",
    htmlPath,
    "--mode",
    options.mode ?? "once",
    "--format",
    options.format ?? "text",
  ];

  if (options.open) {
    args.push("--open");
  }
  if (options.snapshot) {
    args.push("--snapshot");
  }
  if ((options.timeoutMs ?? 0) > 0) {
    args.push("--timeout", String(options.timeoutMs));
  }

  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: "inherit",
      shell: false,
    });

    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`html-preview exited with code ${code ?? "null"}`));
    });
  });
}

export function buildPreviewShell(options: {
  title: string;
  body: string;
  extraHead?: string;
  extraScript?: string;
}): string {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${options.title}</title>
  <style>
    :root {
      color-scheme: light;
      --color-background-body: #F8F4ED;
      --color-background-surface: #FFFFFF;
      --color-background-muted: rgba(5, 54, 89, 0.05);
      --color-text-primary: #15110C;
      --color-text-secondary: #4E606F;
      --color-text-disabled: #A4B0BC;
      --color-accent: #15110C;
      --color-accent-muted: rgba(21, 17, 12, 0.08);
      --color-on-accent: #FFFFFF;
      --color-border: rgba(5, 54, 89, 0.16);
      --color-border-strong: rgba(21, 17, 12, 0.22);
      --color-overlay-hover: rgba(5, 54, 89, 0.05);
      --color-overlay-pressed: rgba(5, 54, 89, 0.10);
      --color-success: #1A7F37;
      --color-danger: #B42318;
      --color-warning: #9A6700;
      --radius-none: 0px;
      --radius-inner: 8px;
      --radius-element: 12px;
      --radius-container: 16px;
      --radius-page: 32px;
      --radius-chat: 28px;
      --radius-full: 9999px;
      --spacing-0: 0px;
      --spacing-0-5: 2px;
      --spacing-1: 4px;
      --spacing-1-5: 6px;
      --spacing-2: 8px;
      --spacing-3: 12px;
      --spacing-4: 16px;
      --spacing-5: 20px;
      --spacing-6: 24px;
      --spacing-7: 28px;
      --spacing-8: 32px;
      --spacing-10: 40px;
      --font-family-body: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --font-family-heading: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --font-family-code: "SFMono-Regular", Consolas, "Cascadia Code", monospace;
      --font-size-body: 14px;
      --font-size-label: 12px;
      --font-size-title-sm: 16px;
      --font-size-title-md: 20px;
      --font-size-title-lg: 24px;
      --line-height-body: 1.5;
      --line-height-heading: 1.2;
      --duration-fast: 175ms;
      --duration-medium: 410ms;
      --ease-standard: cubic-bezier(0.24, 1, 0.4, 1);
    }
    * { box-sizing: border-box; }
    html, body { min-height: 100%; }
    body {
      margin: 0;
      font-family: var(--font-family-body);
      font-size: var(--font-size-body);
      line-height: var(--line-height-body);
      background: var(--color-background-body);
      color: var(--color-text-primary);
    }
    main { max-width: 1200px; margin: 0 auto; padding: var(--spacing-6); }
    h1, h2, h3 { margin: 0 0 12px; }
    h1 {
      font-family: var(--font-family-heading);
      font-size: var(--font-size-title-lg);
      line-height: var(--line-height-heading);
      letter-spacing: -0.02em;
    }
    h2 {
      font-family: var(--font-family-heading);
      font-size: var(--font-size-title-md);
      line-height: var(--line-height-heading);
      letter-spacing: -0.01em;
    }
    h3 {
      font-family: var(--font-family-heading);
      font-size: var(--font-size-title-sm);
      line-height: var(--line-height-heading);
    }
    .hero {
      margin-bottom: var(--spacing-4);
      padding: var(--spacing-4);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-container);
      background: var(--color-background-surface);
    }
    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-3);
    }
    .muted { color: var(--color-text-secondary); }
    .card {
      background: var(--color-background-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-container);
      padding: var(--spacing-4);
      box-shadow: 0 1px 2px rgba(21, 17, 12, 0.04), 0 8px 24px rgba(21, 17, 12, 0.04);
    }
    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-3);
    }
    .grid { display: grid; gap: var(--spacing-4); }
    .stack { display: grid; gap: var(--spacing-2); }
    .toolbar {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      flex-wrap: wrap;
      margin-bottom: var(--spacing-3);
    }
    .toolbar > * {
      flex: 0 0 auto;
    }
    .toolbar .grow {
      flex: 1 1 240px;
      min-width: 220px;
    }
    .field {
      display: grid;
      gap: var(--spacing-2);
    }
    .field-label {
      font-size: var(--font-size-label);
      color: var(--color-text-secondary);
      font-weight: 600;
    }
    .mono, code, pre { font-family: var(--font-family-code); }
    code {
      padding: 0 var(--spacing-1);
      border-radius: var(--radius-inner);
      background: var(--color-background-muted);
    }
    pre {
      overflow: auto;
      white-space: pre-wrap;
      margin: 0;
      padding: var(--spacing-4);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-element);
      background: var(--color-background-muted);
    }
    button, input, select, textarea { font: inherit; }
    button,
    input,
    select,
    textarea {
      color: var(--color-text-primary);
      background: var(--color-background-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-element);
      transition:
        border-color var(--duration-fast) var(--ease-standard),
        background-color var(--duration-fast) var(--ease-standard),
        box-shadow var(--duration-fast) var(--ease-standard);
    }
    button {
      cursor: pointer;
      padding: 10px 14px;
      background: var(--color-background-surface);
    }
    .button-primary {
      background: var(--color-accent);
      color: var(--color-on-accent);
      border-color: var(--color-accent);
    }
    .button-primary:hover {
      background: color-mix(in srgb, var(--color-accent) 92%, white);
      border-color: color-mix(in srgb, var(--color-accent) 92%, white);
    }
    button:hover,
    input:hover,
    select:hover,
    textarea:hover {
      background: var(--color-overlay-hover);
      border-color: var(--color-border-strong);
    }
    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px var(--color-accent-muted);
      border-color: var(--color-text-primary);
    }
    input,
    select,
    textarea {
      width: 100%;
      padding: 10px 12px;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td {
      border-bottom: 1px solid var(--color-border);
      padding: 10px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: var(--color-background-surface);
      position: sticky;
      top: 0;
      z-index: 1;
    }
    .scroll-frame {
      overflow: auto;
      max-height: 70vh;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-element);
      background: var(--color-background-surface);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: var(--radius-full);
      border: 1px solid var(--color-border);
      font-size: var(--font-size-label);
      color: var(--color-text-secondary);
      background: var(--color-background-surface);
    }
    .actions { display: flex; gap: var(--spacing-2); flex-wrap: wrap; }
    .columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-4); }
    .empty-state {
      padding: var(--spacing-6);
      text-align: center;
      color: var(--color-text-secondary);
      border: 1px dashed var(--color-border);
      border-radius: var(--radius-container);
      background: var(--color-background-muted);
    }
    .added { background: color-mix(in srgb, var(--color-success) 12%, transparent); }
    .removed { background: color-mix(in srgb, var(--color-danger) 12%, transparent); }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    }
  </style>
  ${options.extraHead ?? ""}
</head>
<body>
  <main>
    ${options.body}
  </main>
  ${options.extraScript ? `<script>${options.extraScript}</script>` : ""}
</body>
</html>`;
}
