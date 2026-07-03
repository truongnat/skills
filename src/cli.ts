import { log } from "node:console";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type CommandName = "install" | "update" | "uninstall" | "doctor";

type Options = {
  command: CommandName | "help";
  targetDir: string;
  force: boolean;
  json: boolean;
  skills: string[];
};

type ManifestEntry = {
  sourceRelative: string;
  targetRelative: string;
  hash: string;
};

type Manifest = {
  tool: "simple-skills";
  version: 1;
  sourceRoot: string;
  installedAt: string;
  updatedAt: string;
  installedSkills: string[];
  files: ManifestEntry[];
};

type DoctorCheck = {
  name: string;
  ok: boolean;
  detail: string;
};

const TOOL_NAME = "simple-skills";
const MANIFEST_BASENAME = ".simple-skills-manifest.json";
const LEGACY_MANIFEST_BASENAMES = [".aix-install-manifest.json"];
const COMMON_SOURCE_FILES = [
  { source: "AGENTS.md", target: path.join(".agents", "AGENTS.md") },
  { source: path.join("docs", "agents-readme.md"), target: path.join(".agents", "README.md") },
  {
    source: path.join("docs", "sessions-readme.md"),
    target: path.join(".agents", "sessions", "README.md"),
  },
] as const;

// Root-level dependency files copied into target .agents/tools/
const TOOLS_DEPS_PATHS = [
  "node_modules",
  "package.json",
  "package-lock.json",
] as const;

function main(): void {
  try {
    const options = parseArgs(process.argv.slice(2));
    const sourceRoot = findSourceRoot();

    if (options.command === "help") {
      printHelp();
      return;
    }

    switch (options.command) {
      case "install":
        runInstall(sourceRoot, options);
        return;
      case "update":
        runUpdate(sourceRoot, options);
        return;
      case "uninstall":
        runUninstall(options);
        return;
      case "doctor":
        runDoctor(sourceRoot, options);
        return;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Loi: ${message}`);
    process.exitCode = 1;
  }
}

function parseArgs(args: string[]): Options {
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    return {
      command: "help",
      targetDir: process.cwd(),
      force: false,
      json: false,
      skills: [],
    };
  }

  const [rawCommand, ...rest] = args;

  if (!["install", "update", "uninstall", "doctor"].includes(rawCommand)) {
    throw new Error(`Lenh khong hop le: ${rawCommand}`);
  }

  const command = rawCommand as CommandName;
  let targetDir = process.cwd();
  let force = false;
  let json = false;
  const skills: string[] = [];

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === "--force") {
      force = true;
      continue;
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--skill") {
      const skillName = rest[index + 1];
      if (!skillName) {
        throw new Error("Thieu gia tri sau --skill");
      }
      skills.push(skillName);
      index += 1;
      continue;
    }
    if (arg.startsWith("--skill=")) {
      skills.push(arg.slice("--skill=".length));
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`Option khong ho tro: ${arg}`);
    }
    targetDir = path.resolve(arg);
  }

  return {
    command,
    targetDir,
    force,
    json,
    skills,
  };
}

function printHelp(): void {
  console.log(`${TOOL_NAME} <command> [target-dir] [options]

Commands:
  install     Cai AGENTS va skills vao .agents cua project dich
  update      Cap nhat cac file da cai dat tu manifest
  uninstall   Go cac file do tool quan ly
  doctor      Kiem tra suc khoe source repo va ban cai dat

Options:
  --skill <name>   Chi dinh skill de cai dat/cap nhat
  --force          Bo qua canh bao file da bi chinh sua tay
  --json           In ket qua doctor dang JSON
  -h, --help       Hien tro giup
`);
}

function findSourceRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    currentDir,
    path.resolve(currentDir, ".."),
    path.resolve(currentDir, "..", ".."),
    path.resolve(currentDir, "..", "..", ".."),
  ];

  const seen = new Set<string>();
  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    if (
      existsSync(path.join(resolved, "AGENTS.md")) &&
      existsSync(path.join(resolved, "skills"))
    ) {
      return resolved;
    }
  }

  throw new Error("Khong tim thay source root chua AGENTS.md va skills/");
}

function runInstall(sourceRoot: string, options: Options): void {
  const skillNames = resolveRequestedSkills(sourceRoot, options.skills, false);
  // log("skillNames", skillNames);
  const assets = collectAssets(sourceRoot, skillNames);
  log("assets", assets);
  const agentsDir = path.join(options.targetDir, ".agents");
  const manifestPath = getManifestPath(options.targetDir);
  const legacyManifestPath = findExistingManifestPath(options.targetDir);
  const manifest = readManifest(manifestPath);
  const nextManifest = buildManifest(sourceRoot, skillNames, assets);

  mkdirSync(agentsDir, { recursive: true });
  mkdirSync(path.join(agentsDir, "skills"), { recursive: true });
  mkdirSync(path.join(agentsDir, "sessions"), { recursive: true });

  for (const asset of assets) {
    const targetPath = path.join(options.targetDir, asset.targetRelative);
    ensureParentDir(targetPath);
    assertCanWriteTarget(
      options.targetDir,
      targetPath,
      asset.hash,
      manifest,
      options.force,
    );
    copyFileSync(asset.sourcePath, targetPath);
  }

  writeManifest(manifestPath, nextManifest);
  if (
    legacyManifestPath &&
    legacyManifestPath !== manifestPath &&
    existsSync(legacyManifestPath)
  ) {
    unlinkSync(legacyManifestPath);
  }

  console.log(
    `Da cai ${skillNames.length} skill vao ${path.join(options.targetDir, ".agents")}`,
  );
}

function runUpdate(sourceRoot: string, options: Options): void {
  const manifestPath = requireExistingManifestPath(options.targetDir);
  const manifest = requireManifest(manifestPath);
  const installedSkillSet = new Set(manifest.installedSkills);

  const requestedSkills =
    options.skills.length > 0
      ? resolveRequestedSkills(sourceRoot, options.skills, true)
      : manifest.installedSkills;

  for (const skill of requestedSkills) {
    if (!installedSkillSet.has(skill)) {
      throw new Error(`Skill chua duoc cai dat, khong the update: ${skill}`);
    }
  }

  const assets = collectAssets(sourceRoot, requestedSkills);
  const nextEntries = new Map(
    manifest.files.map((entry) => [entry.targetRelative, entry]),
  );

  for (const asset of assets) {
    const targetPath = path.join(options.targetDir, asset.targetRelative);
    assertManagedFileNotModified(
      options.targetDir,
      targetPath,
      manifest,
      options.force,
    );
    ensureParentDir(targetPath);
    copyFileSync(asset.sourcePath, targetPath);
    nextEntries.set(asset.targetRelative, {
      sourceRelative: asset.sourceRelative,
      targetRelative: asset.targetRelative,
      hash: asset.hash,
    });
  }

  const nextManifest: Manifest = {
    ...manifest,
    sourceRoot,
    updatedAt: new Date().toISOString(),
    files: Array.from(nextEntries.values()).sort(sortManifestEntries),
  };

  writeManifest(manifestPath, nextManifest);
  console.log(
    `Da cap nhat ${requestedSkills.length} skill trong ${options.targetDir}`,
  );
}

function runUninstall(options: Options): void {
  const manifestPath = requireExistingManifestPath(options.targetDir);
  const manifest = requireManifest(manifestPath);

  const files = [...manifest.files].sort((left, right) =>
    right.targetRelative.localeCompare(left.targetRelative),
  );

  for (const entry of files) {
    const absolutePath = path.join(options.targetDir, entry.targetRelative);
    if (!existsSync(absolutePath)) {
      continue;
    }
    assertManagedFileNotModified(
      options.targetDir,
      absolutePath,
      manifest,
      options.force,
    );
    unlinkSync(absolutePath);
    pruneEmptyDirectories(
      path.dirname(absolutePath),
      path.join(options.targetDir, ".agents"),
    );
  }

  if (existsSync(manifestPath)) {
    unlinkSync(manifestPath);
  }

  pruneEmptyDirectories(
    path.join(options.targetDir, ".agents"),
    options.targetDir,
  );
  console.log(
    `Da go cai dat do ${TOOL_NAME} quan ly trong ${options.targetDir}`,
  );
}

function runDoctor(sourceRoot: string, options: Options): void {
  const manifestPath = findExistingManifestPath(options.targetDir);
  const checks: DoctorCheck[] = [];

  checks.push({
    name: "source.AGENTS",
    ok: existsSync(path.join(sourceRoot, "AGENTS.md")),
    detail: path.join(sourceRoot, "AGENTS.md"),
  });
  checks.push({
    name: "source.skills",
    ok: existsSync(path.join(sourceRoot, "skills")),
    detail: `${listInstalledSkills(sourceRoot).length} skill trong source`,
  });

  if (!manifestPath || !existsSync(manifestPath)) {
    checks.push({
      name: "target.manifest",
      ok: false,
      detail: "Chua tim thay manifest cai dat trong .agents",
    });
  } else {
    const manifest = requireManifest(manifestPath);
    checks.push({
      name: "target.manifest",
      ok: true,
      detail: `${manifest.installedSkills.length} skill da cai`,
    });

    for (const entry of manifest.files) {
      const absolutePath = path.join(options.targetDir, entry.targetRelative);
      checks.push({
        name: `file.${entry.targetRelative}`,
        ok: existsSync(absolutePath),
        detail: existsSync(absolutePath) ? "Ton tai" : "Bi thieu",
      });
      if (existsSync(absolutePath)) {
        const currentHash = hashFile(absolutePath);
        checks.push({
          name: `hash.${entry.targetRelative}`,
          ok: currentHash === entry.hash,
          detail:
            currentHash === entry.hash
              ? "Khong bi sua tay"
              : "Da bi thay doi sau khi cai",
        });
      }
    }
  }

  const payload = {
    targetDir: options.targetDir,
    sourceRoot,
    ok: checks.every((check) => check.ok),
    checks,
  };

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log(`Doctor cho ${options.targetDir}`);
  for (const check of checks) {
    console.log(`${check.ok ? "OK " : "ERR"} ${check.name}: ${check.detail}`);
  }
  console.log(payload.ok ? "Trang thai: on" : "Trang thai: can xu ly");
}

function resolveRequestedSkills(
  sourceRoot: string,
  requestedSkills: string[],
  allowEmptySelection: boolean,
): string[] {
  const available = new Set(listInstalledSkills(sourceRoot));
  if (requestedSkills.length === 0) {
    if (allowEmptySelection) {
      return [];
    }
    return Array.from(available).sort();
  }

  const unique = Array.from(new Set(requestedSkills)).sort();
  for (const skill of unique) {
    if (!available.has(skill)) {
      throw new Error(`Skill khong ton tai trong source: ${skill}`);
    }
  }
  return unique;
}

function listInstalledSkills(sourceRoot: string): string[] {
  const skillsDir = path.join(sourceRoot, "skills");
  log("skillsDir", skillsDir);
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry: { isDirectory(): boolean }) => entry.isDirectory())
    .map((entry: { name: string }) => entry.name)
    .sort();
}

function collectAssets(sourceRoot: string, skillNames: string[]) {
  const assets: Array<{
    sourcePath: string;
    sourceRelative: string;
    targetRelative: string;
    hash: string;
  }> = [];

  for (const entry of COMMON_SOURCE_FILES) {
    const sourcePath = path.join(sourceRoot, entry.source);
    if (!existsSync(sourcePath)) {
      throw new Error(`Thieu file nguon bat buoc: ${entry.source}`);
    }
    const targetRelative = normalizeSlashes(entry.target);
    assets.push({
      sourcePath,
      sourceRelative: normalizeSlashes(entry.source),
      targetRelative,
      hash: hashFile(sourcePath),
    });
  }

  for (const skillName of skillNames) {
    const skillDir = path.join(sourceRoot, "skills", skillName);
    for (const sourcePath of walkFiles(skillDir)) {
      const sourceRelative = normalizeSlashes(
        path.relative(sourceRoot, sourcePath),
      );
      const targetRelative = normalizeSlashes(
        path.join(".agents", sourceRelative),
      );
      assets.push({
        sourcePath,
        sourceRelative,
        targetRelative,
        hash: hashFile(sourcePath),
      });
    }
  }

  // Copy root-level deps into .agents/tools/
  for (const depsRel of TOOLS_DEPS_PATHS) {
    const sourcePath = path.join(sourceRoot, depsRel);
    if (!existsSync(sourcePath)) {
      continue;
    }
    if (statSync(sourcePath).isDirectory()) {
      for (const filePath of walkFiles(sourcePath)) {
        const sourceRelative = normalizeSlashes(
          path.relative(sourceRoot, filePath),
        );
        const targetRelative = normalizeSlashes(
          path.join(".agents", "tools", sourceRelative),
        );
        assets.push({
          sourcePath: filePath,
          sourceRelative,
          targetRelative,
          hash: hashFile(filePath),
        });
      }
    } else {
      const sourceRelative = normalizeSlashes(depsRel);
      const targetRelative = normalizeSlashes(
        path.join(".agents", "tools", sourceRelative),
      );
      assets.push({
        sourcePath,
        sourceRelative,
        targetRelative,
        hash: hashFile(sourcePath),
      });
    }
  }

  // Copy each tool's dist/ content flat into .agents/tools/
  const toolsSrcDir = path.join(sourceRoot, "tools");
  if (existsSync(toolsSrcDir)) {
    for (const entry of readdirSync(toolsSrcDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const toolDistDir = path.join(toolsSrcDir, entry.name, "dist");
      if (!existsSync(toolDistDir)) continue;
      for (const filePath of walkFiles(toolDistDir)) {
        const sourceRelative = normalizeSlashes(
          path.relative(sourceRoot, filePath),
        );
        const targetRelative = normalizeSlashes(
          path.join(".agents", "tools", path.basename(filePath)),
        );
        assets.push({
          sourcePath: filePath,
          sourceRelative,
          targetRelative,
          hash: hashFile(filePath),
        });
      }
    }
  }

  return assets.sort((left, right) =>
    left.targetRelative.localeCompare(right.targetRelative),
  );
}

function walkFiles(directory: string): string[] {
  const result: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      result.push(...walkFiles(absolutePath));
      continue;
    }
    result.push(absolutePath);
  }
  return result.sort();
}

function buildManifest(
  sourceRoot: string,
  skillNames: string[],
  assets: Array<{
    sourceRelative: string;
    targetRelative: string;
    hash: string;
  }>,
): Manifest {
  return {
    tool: "simple-skills",
    version: 1,
    sourceRoot,
    installedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    installedSkills: [...skillNames].sort(),
    files: assets
      .map((asset) => ({
        sourceRelative: asset.sourceRelative,
        targetRelative: asset.targetRelative,
        hash: asset.hash,
      }))
      .sort(sortManifestEntries),
  };
}

function sortManifestEntries(
  left: ManifestEntry,
  right: ManifestEntry,
): number {
  return left.targetRelative.localeCompare(right.targetRelative);
}

function readManifest(manifestPath: string): Manifest | null {
  if (!existsSync(manifestPath)) {
    return null;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  return {
    ...manifest,
    files: manifest.files.map((entry) => ({
      ...entry,
      sourceRelative: normalizeSlashes(entry.sourceRelative),
      targetRelative: normalizeSlashes(entry.targetRelative),
    })),
  };
}

function getManifestPath(targetDir: string): string {
  return path.join(targetDir, ".agents", MANIFEST_BASENAME);
}

function findExistingManifestPath(targetDir: string): string | null {
  const agentsDir = path.join(targetDir, ".agents");
  const candidates = [MANIFEST_BASENAME, ...LEGACY_MANIFEST_BASENAMES];

  for (const basename of candidates) {
    const candidate = path.join(agentsDir, basename);
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function requireExistingManifestPath(targetDir: string): string {
  const manifestPath = findExistingManifestPath(targetDir);
  if (!manifestPath) {
    throw new Error("Chua tim thay manifest cai dat trong .agents");
  }
  return manifestPath;
}

function requireManifest(manifestPath: string): Manifest {
  const manifest = readManifest(manifestPath);
  if (!manifest) {
    throw new Error(`Chua tim thay manifest cai dat: ${manifestPath}`);
  }
  return manifest;
}

function writeManifest(manifestPath: string, manifest: Manifest): void {
  ensureParentDir(manifestPath);
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function ensureParentDir(filePath: string): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
}

function hashFile(filePath: string): string {
  const content = readFileSync(filePath);
  return createHash("sha256").update(content).digest("hex");
}

function assertCanWriteTarget(
  targetRoot: string,
  targetPath: string,
  sourceHash: string,
  manifest: Manifest | null,
  force: boolean,
): void {
  if (!existsSync(targetPath)) {
    return;
  }

  const currentHash = hashFile(targetPath);
  if (currentHash === sourceHash) {
    return;
  }

  const targetRelative = getTargetRelative(targetRoot, targetPath);
  const trackedEntry = manifest?.files.find(
    (entry) => entry.targetRelative === targetRelative,
  );

  if (trackedEntry) {
    if (currentHash !== trackedEntry.hash && !force) {
      throw new Error(
        `File da bi sua tay, dung --force neu muon ghi de: ${targetPath}`,
      );
    }
    return;
  }

  if (!force) {
    throw new Error(`File da ton tai va khong do tool quan ly: ${targetPath}`);
  }
}

function assertManagedFileNotModified(
  targetRoot: string,
  targetPath: string,
  manifest: Manifest,
  force: boolean,
): void {
  if (!existsSync(targetPath)) {
    return;
  }
  const relativeFromTarget = getTargetRelative(targetRoot, targetPath);
  const trackedEntry = manifest.files.find(
    (entry) => entry.targetRelative === relativeFromTarget,
  );
  if (!trackedEntry) {
    if (!force) {
      throw new Error(`File khong nam trong manifest: ${targetPath}`);
    }
    return;
  }
  const currentHash = hashFile(targetPath);
  if (currentHash !== trackedEntry.hash && !force) {
    throw new Error(
      `File da bi sua tay, can --force de tiep tuc: ${targetPath}`,
    );
  }
}

function pruneEmptyDirectories(startDir: string, stopDir: string): void {
  let currentDir = startDir;
  const absoluteStopDir = path.resolve(stopDir);

  while (
    currentDir.startsWith(absoluteStopDir) &&
    currentDir !== absoluteStopDir
  ) {
    if (!existsSync(currentDir) || !statSync(currentDir).isDirectory()) {
      currentDir = path.dirname(currentDir);
      continue;
    }
    const contents = readdirSync(currentDir);
    if (contents.length > 0) {
      break;
    }
    rmdirSync(currentDir);
    currentDir = path.dirname(currentDir);
  }
}

function normalizeSlashes(value: string): string {
  return value.replace(/[\\/]+/g, "/");
}

function getTargetRelative(targetRoot: string, targetPath: string): string {
  return normalizeSlashes(path.relative(targetRoot, targetPath));
}

main();
