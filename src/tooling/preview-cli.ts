export type CommonPreviewOptions = {
  open: boolean;
  snapshot: boolean;
  timeoutMs: number;
};

export function createCommonPreviewOptions(): CommonPreviewOptions {
  return {
    open: false,
    snapshot: false,
    timeoutMs: 0,
  };
}

export function applyCommonPreviewArg(
  arg: string,
  args: string[],
  index: number,
  options: CommonPreviewOptions,
): number {
  if (arg === "--open") {
    options.open = true;
    return index;
  }

  if (arg === "--snapshot") {
    options.snapshot = true;
    return index;
  }

  if (arg === "--timeout") {
    options.timeoutMs = Number.parseInt(args[index + 1] ?? "0", 10);
    return index + 1;
  }

  if (arg.startsWith("--timeout=")) {
    options.timeoutMs = Number.parseInt(arg.slice("--timeout=".length), 10);
    return index;
  }

  return index;
}
