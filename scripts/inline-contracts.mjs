#!/usr/bin/env node
/**
 * Inline agents/openai.yaml contracts into sibling SKILL.md files.
 * Uses a small parser for this repo's openai.yaml shape (no yaml package required).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HARD_CONTRACT_NOTE = "(Hard contract in this SKILL.md — MUST follow.)";

function tryLoadYamlParser() {
  const require = createRequire(import.meta.url);
  for (const name of ["yaml", "js-yaml"]) {
    try {
      const mod = require(name);
      const parse = mod.parse || mod.load;
      if (typeof parse === "function") {
        return (text) => parse(text);
      }
    } catch {
      // not installed
    }
  }
  return null;
}

/**
 * Unquote a YAML scalar: "..." or '...' or bare.
 */
function unquote(raw) {
  const s = raw.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    const q = s[0];
    let out = "";
    for (let i = 1; i < s.length - 1; i++) {
      const c = s[i];
      if (c === "\\" && i + 1 < s.length - 1) {
        const n = s[i + 1];
        if (n === q || n === "\\") {
          out += n;
          i++;
          continue;
        }
      }
      out += c;
    }
    return out;
  }
  const hash = s.indexOf(" #");
  return (hash >= 0 ? s.slice(0, hash) : s).trim();
}

/**
 * Indent-based nested map parser for this repo's openai.yaml shape.
 * Coerces booleans; otherwise unquotes strings.
 */
function parseYamlMap(lines, startIndex, baseIndent) {
  const indentOf = (line) => {
    const m = line.match(/^( *)/);
    return m ? m[1].length : 0;
  };

  const obj = {};
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }
    const ind = indentOf(line);
    if (ind < baseIndent) break;
    if (ind > baseIndent) {
      throw new Error(
        `Unexpected indent ${ind} (expected ${baseIndent}) at line ${i + 1}: ${line}`
      );
    }

    const km = line.match(/^( *)([^:]+):\s*(.*)$/);
    if (!km) throw new Error(`Cannot parse map line ${i + 1}: ${line}`);
    const key = km[2].trim();
    const rest = km[3].trim();

    if (rest === "" || rest === "|" || rest === ">") {
      const childIndent = baseIndent + 2;
      // peek: if next non-empty is deeper, parse nested map; else empty object
      let j = i + 1;
      while (j < lines.length && (!lines[j].trim() || lines[j].trim().startsWith("#"))) j++;
      if (j < lines.length && indentOf(lines[j]) >= childIndent) {
        const [child, next] = parseYamlMap(lines, i + 1, childIndent);
        obj[key] = child;
        i = next;
      } else {
        obj[key] = {};
        i++;
      }
      continue;
    }

    if (rest === "true" || rest === "false") {
      obj[key] = rest === "true";
    } else if (rest === "null" || rest === "~") {
      obj[key] = null;
    } else {
      obj[key] = unquote(rest);
    }
    i++;
  }

  return [obj, i];
}

/**
 * Parse this repo's openai.yaml:
 * - top-level flat string keys
 * - artifacts: map of filename -> { required, description?, schema?: { field: { type, required, description } } }
 * - sync-style shared `schema` sibling under artifacts is also supported
 */
function parseOpenaiYaml(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const result = {};
  let i = 0;

  const indentOf = (line) => {
    const m = line.match(/^( *)/);
    return m ? m[1].length : 0;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }
    const ind = indentOf(line);
    if (ind !== 0) {
      throw new Error(`Unexpected indented top-level line ${i + 1}: ${line}`);
    }

    const m = line.match(/^([A-Za-z0-9_./-]+):\s*(.*)$/);
    if (!m) {
      throw new Error(`Cannot parse top-level line ${i + 1}: ${line}`);
    }
    const key = m[1];
    const rest = m[2].trim();

    if (key === "artifacts") {
      if (rest !== "" && rest !== "|" && rest !== ">") {
        result.artifacts = rest === "null" || rest === "~" ? null : unquote(rest);
        i++;
        continue;
      }
      const [artifacts, next] = parseYamlMap(lines, i + 1, 2);
      result.artifacts = artifacts;
      i = next;
      continue;
    }

    if (rest === "" || rest === "|" || rest === ">") {
      const [child, next] = parseYamlMap(lines, i + 1, 2);
      result[key] = child;
      i = next;
      continue;
    }

    if (rest === "true" || rest === "false") {
      result[key] = rest === "true";
    } else {
      result[key] = unquote(rest);
    }
    i++;
  }

  return result;
}

function looksLikeSchemaMap(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  const vals = Object.values(obj);
  if (vals.length === 0) return false;
  return vals.every(
    (v) =>
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      ("type" in v || "description" in v || "required" in v)
  );
}

function loadYaml(text) {
  const pkg = tryLoadYamlParser();
  if (pkg) return pkg(text);
  return parseOpenaiYaml(text);
}

function buildContractSection(doc) {
  const requiredInput = doc.required_input ?? "";
  const requiredOutput = doc.required_output ?? "";
  const noteImportant = doc.note_important ?? "";

  const lines = [
    "## Contract (mandatory)",
    "",
    "This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.",
    "",
    "| Field | Requirement |",
    "|-------|-------------|",
    `| Inputs | ${requiredInput} |`,
    `| Outputs | ${requiredOutput} |`,
    `| Safety | ${noteImportant} |`,
    "",
    "### Required artifacts",
    "",
  ];

  const artifacts = doc.artifacts;
  if (!artifacts || typeof artifacts !== "object" || Object.keys(artifacts).length === 0) {
    lines.push("_No file artifacts — follow Outputs above._");
    lines.push("");
  } else {
    for (const [filename, art] of Object.entries(artifacts)) {
      lines.push(`#### \`${filename}\``);
      if (art && typeof art === "object") {
        // Shared schema map listed as artifacts.schema (sync)
        if (
          (filename === "schema" || (!(("required" in art) || ("description" in art) || ("schema" in art)))) &&
          looksLikeSchemaMap(art)
        ) {
          lines.push("- Required: shared (applies to sync report content)");
          for (const [field, meta] of Object.entries(art)) {
            const m = meta && typeof meta === "object" ? meta : {};
            const reqLabel = m.required === false ? "optional" : "required";
            const typ = m.type ?? "unknown";
            const desc = m.description ?? "";
            lines.push(`- **${field}** (${reqLabel}, ${typ}): ${desc}`);
          }
        } else {
          lines.push(`- Required: ${art.required === false ? "no" : "yes"}`);
          if (art.schema && typeof art.schema === "object") {
            for (const [field, meta] of Object.entries(art.schema)) {
              const m = meta && typeof meta === "object" ? meta : {};
              const reqLabel = m.required === false ? "optional" : "required";
              const typ = m.type ?? "unknown";
              const desc = m.description ?? "";
              lines.push(`- **${field}** (${reqLabel}, ${typ}): ${desc}`);
            }
          } else if (art.description) {
            lines.push(`- ${art.description}`);
          }
        }
      } else {
        lines.push(`- Required: yes`);
      }
      lines.push("");
    }
  }

  lines.push("### Reference");
  lines.push("");
  lines.push(
    "`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents."
  );
  lines.push("");

  return lines.join("\n");
}

/**
 * Update frontmatter description without duplicating the hard-contract note.
 */
function updateFrontmatterDescription(md) {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("\n---", 3);
  if (end < 0) return md;
  const fm = md.slice(0, end + 4); // includes closing ---
  const body = md.slice(end + 4);

  const descMatch = fm.match(/^description:\s*(.*)$/m);
  if (!descMatch) return md;

  let descRaw = descMatch[1].trim();
  // Skip YAML block scalars (`>` / `|`) — their value spans multiple lines, so a
  // single-line rewrite would corrupt the frontmatter. Leave them untouched.
  if (descRaw === "" || descRaw.startsWith(">") || descRaw.startsWith("|")) {
    return md;
  }
  // Only handle single-line quoted/unquoted descriptions (this repo's shape)
  let desc = unquote(descRaw);
  if (desc.includes(HARD_CONTRACT_NOTE)) {
    return md;
  }
  const trimmed = desc.replace(/\s+$/, "");
  const sep = /[.!?]$/.test(trimmed) ? " " : ". ";
  const newDesc = `${trimmed}${sep}${HARD_CONTRACT_NOTE}`;
  const newFm = fm.replace(
    /^description:\s*.*$/m,
    `description: ${JSON.stringify(newDesc)}`
  );
  return newFm + body;
}

/**
 * Find ## XML Contract / ## Contract (...optional suffix) section range [start, endExclusive).
 * Headings must be at beginning of line.
 */
function findContractSectionRange(md) {
  const re = /^## (?:XML )?Contract(?:\b.*)?$/gm;
  const m = re.exec(md);
  if (!m) return null;
  const start = m.index;
  const after = md.slice(start + m[0].length);
  const next = after.search(/^## /m);
  const end = next < 0 ? md.length : start + m[0].length + next;
  return { start, end };
}

function findSectionEnd(md, headingRe) {
  const re = new RegExp(headingRe, "gm");
  const m = re.exec(md);
  if (!m) return null;
  const afterHeading = m.index + m[0].length;
  const after = md.slice(afterHeading);
  const next = after.search(/^## /m);
  if (next < 0) return md.length;
  return afterHeading + next;
}

/** Prefer insert point after Purpose, or after Dynamic depth if that follows Purpose. */
function findPreferredContractInsertPoint(md) {
  const purposeEnd = findSectionEnd(md, "^## Purpose\\b.*$");
  if (purposeEnd == null) return null;
  const rest = md.slice(purposeEnd);
  const nextHeading = rest.match(/^## .+$/m);
  if (nextHeading && /^## Dynamic depth\b/.test(nextHeading[0])) {
    const dynStart = purposeEnd + nextHeading.index;
    const afterDynHeading = dynStart + nextHeading[0].length;
    const afterDyn = md.slice(afterDynHeading);
    const next = afterDyn.search(/^## /m);
    return next < 0 ? md.length : afterDynHeading + next;
  }
  return purposeEnd;
}

/**
 * After frontmatter + title (# ...) block: insert point after first H1 section's... 
 * User said: after frontmatter+title if no purpose.
 * Insert after the first # Title line and its following content until next ## OR after title line.
 * Prefer: after the H1 line (and blank line if present), before first ## — actually "after frontmatter+title"
 * meaning right after the `# Title` paragraph block ends (until next ##).
 */
function findInsertAfterTitle(md) {
  let offset = 0;
  if (md.startsWith("---")) {
    const end = md.indexOf("\n---", 3);
    if (end >= 0) offset = end + 4;
  }
  const rest = md.slice(offset);
  const title = rest.match(/^\s*\n*# .+$/m);
  if (!title) {
    // after frontmatter only
    return offset;
  }
  const titleAbs = offset + title.index + title[0].length;
  const afterTitle = md.slice(titleAbs);
  const nextH2 = afterTitle.search(/^## /m);
  if (nextH2 < 0) return md.length;
  return titleAbs + nextH2;
}

function transformSkillMd(md, contractSection) {
  let content = updateFrontmatterDescription(md);
  const section = contractSection.endsWith("\n")
    ? contractSection
    : contractSection + "\n";

  // Always remove any existing Contract / XML Contract, then insert early.
  const range = findContractSectionRange(content);
  if (range) {
    const before = content.slice(0, range.start).replace(/\n*$/, "\n\n");
    const after = content.slice(range.end).replace(/^\n*/, "");
    content = before + (after ? after : "");
  }

  const insertAt = findPreferredContractInsertPoint(content);
  if (insertAt != null) {
    const before = content.slice(0, insertAt).replace(/\n*$/, "\n\n");
    const after = content.slice(insertAt).replace(/^\n*/, "");
    return before + section + (after ? "\n" + after : "");
  }

  const atTitle = findInsertAfterTitle(content);
  const before = content.slice(0, atTitle).replace(/\n*$/, "\n\n");
  const after = content.slice(atTitle).replace(/^\n*/, "");
  return before + section + (after ? "\n" + after : "");
}

function findOpenaiYamls(root) {
  const skillsDir = path.join(root, "skills");
  const out = [];
  if (!fs.existsSync(skillsDir)) return out;
  for (const name of fs.readdirSync(skillsDir)) {
    const yamlPath = path.join(skillsDir, name, "agents", "openai.yaml");
    if (fs.existsSync(yamlPath)) out.push(yamlPath);
  }
  return out.sort();
}

function main() {
  const yamlPaths = findOpenaiYamls(ROOT);
  const updated = [];

  for (const yamlPath of yamlPaths) {
    const skillDir = path.dirname(path.dirname(yamlPath));
    const skillName = path.basename(skillDir);
    const skillMdPath = path.join(skillDir, "SKILL.md");
    if (!fs.existsSync(skillMdPath)) {
      console.warn(`skip ${skillName}: no SKILL.md`);
      continue;
    }

    const yamlText = fs.readFileSync(yamlPath, "utf8");
    let doc;
    try {
      doc = loadYaml(yamlText);
    } catch (err) {
      console.error(`parse fail ${skillName}: ${err.message}`);
      process.exitCode = 1;
      continue;
    }
    if (
      !("required_input" in doc) ||
      !("required_output" in doc) ||
      !("note_important" in doc)
    ) {
      console.log(`skip third-party metadata: ${skillName} (${yamlPath})`);
      continue;
    }

    const contract = buildContractSection(doc);
    const original = fs.readFileSync(skillMdPath, "utf8");
    const next = transformSkillMd(original, contract);
    if (next === original) {
      console.log(`unchanged: ${skillName} (${skillMdPath})`);
      continue;
    }
    fs.writeFileSync(skillMdPath, next, "utf8");
    console.log(`updated: ${skillName} (${skillMdPath})`);
    updated.push(skillName);
  }

  console.log("");
  console.log(`Updated ${updated.length} skill(s): ${updated.join(", ") || "(none)"}`);
  return updated;
}

const isMain =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  main();
}

export { parseOpenaiYaml, buildContractSection, transformSkillMd, main };
