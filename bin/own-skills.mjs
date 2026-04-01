#!/usr/bin/env node
/**
 * own-skills — npx-friendly installer / uninstaller.
 * Node-only flow (no bash): fetch bundle with degit/git clone, then run Python installer per skill.
 * Requires: Node 18+, git, python3/python on PATH.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import degit from 'degit';
import inquirer from 'inquirer';
import ora from 'ora';

const DEFAULT_REPO = 'truongnat/skills';

function printHelp() {
  console.log(`
${chalk.bold.cyan('own-skills')} — install or uninstall the skills bundle in a project

${chalk.bold('Usage')}
  npx github:${DEFAULT_REPO}  [install|uninstall] [options]
  own-skills                    [install|uninstall] [options]

${chalk.bold('Commands')}
  install     Full or skills-only install (default)
  uninstall   Remove bundle symlinks / vendor

${chalk.bold('Install options')}
  --repo <user/repo|https://github.com/...>   Source repo (default: ${DEFAULT_REPO})
  --project-dir <path>   Target project root (default: current directory)
  --full                 Copy to vendor/own-skills + link rules + skills (default)
  --skills-only          Install copied skills only (no full bundle)
  --cursor-only          Cursor skills only (omit --all-ides)
  --yes, -y              Skip prompts (use defaults / flags only)

${chalk.bold('Uninstall options')}
  --repo <user/repo>     Reserved for compatibility (default: ${DEFAULT_REPO})
  --project-dir <path>   Project root (default: cwd)
  --force                No confirmation
  --nuclear              Remove entire .cursor (dangerous)

${chalk.bold('Environment')}
  Requires ${chalk.yellow('git')} and ${chalk.yellow('python3')} (or ${chalk.yellow('python')}) on PATH.

${chalk.bold('Examples')}
  npx github:${DEFAULT_REPO} install --yes
  npx github:${DEFAULT_REPO} install --project-dir . --full --yes
  npx github:${DEFAULT_REPO} uninstall --force --yes
`);
}

/** @returns {string} "user/repo" for degit */
function normalizeRepo(input) {
  const s = String(input).trim();
  if (!s) return DEFAULT_REPO;
  if (/^[\w.-]+\/[\w.-]+$/.test(s) && !s.includes('://')) return s;
  const m = s.match(/github\.com[:/]([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i);
  if (m) return `${m[1]}/${m[2]}`;
  throw new Error(`Could not parse repo: ${input}`);
}

function httpsCloneUrl(userRepo) {
  return `https://github.com/${userRepo}.git`;
}

function parseFlags(argv, command) {
  const out =
    command === 'uninstall'
      ? {
          repo: DEFAULT_REPO,
          projectDir: process.cwd(),
          force: false,
          nuclear: false,
          yes: false,
        }
      : {
          repo: DEFAULT_REPO,
          projectDir: process.cwd(),
          full: true,
          skillsOnly: false,
          cursorOnly: false,
          yes: false,
        };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
    if (command === 'uninstall') {
      if (a === '--repo') out.repo = argv[++i] ?? DEFAULT_REPO;
      else if (a === '--project-dir') out.projectDir = resolve(argv[++i] ?? '');
      else if (a === '--force') out.force = true;
      else if (a === '--nuclear') out.nuclear = true;
      else if (a === '--yes' || a === '-y') out.yes = true;
      else throw new Error(`Unknown flag: ${a}`);
    } else {
      if (a === '--repo') out.repo = argv[++i] ?? DEFAULT_REPO;
      else if (a === '--project-dir') out.projectDir = resolve(argv[++i] ?? '');
      else if (a === '--full') {
        out.full = true;
        out.skillsOnly = false;
      } else if (a === '--skills-only') {
        out.skillsOnly = true;
        out.full = false;
      } else if (a === '--cursor-only') out.cursorOnly = true;
      else if (a === '--yes' || a === '-y') out.yes = true;
      else throw new Error(`Unknown flag: ${a}`);
    }
  }
  return out;
}

function detectPythonExecutable() {
  for (const bin of ['python3', 'python']) {
    try {
      execFileSync(bin, ['--version'], { stdio: 'pipe' });
      return bin;
    } catch {
      // keep trying
    }
  }
  throw new Error('Python not found. Install Python 3 and add python3/python to PATH.');
}

async function fetchToTempImpl(userRepo) {
  const parent = join(tmpdir(), 'own-skills-');
  let tempDir = mkdtempSync(parent);
  const spinner = ora({ text: chalk.cyan('Fetching bundle (degit)…'), color: 'cyan' }).start();
  try {
    const emitter = degit(userRepo, { cache: false, force: true });
    await emitter.clone(tempDir);
    spinner.succeed(chalk.green('Bundle ready'));
    return { tempDir: tempDir };
  } catch {
    spinner.warn(chalk.yellow('degit failed; using git clone'));
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
    tempDir = mkdtempSync(parent);
    const oraGit = ora({ text: chalk.cyan('git clone (shallow)…'), color: 'cyan' }).start();
    execFileSync('git', ['clone', '--depth', '1', httpsCloneUrl(userRepo), tempDir], {
      stdio: 'pipe',
    });
    oraGit.succeed(chalk.green('Repository cloned'));
    return { tempDir: tempDir };
  }
}

function shouldIgnoreCopy(relativePath) {
  const p = relativePath.replace(/\\/g, '/');
  if (!p || p === '.') return false;
  if (p.startsWith('.git/')) return true;
  if (p.startsWith('.venv/')) return true;
  if (p.startsWith('knowledge-base/embeddings/')) return true;
  if (p.includes('/__pycache__/') || p.endsWith('/__pycache__')) return true;
  if (p.endsWith('.pyc')) return true;
  if (p.endsWith('.DS_Store')) return true;
  if (p.startsWith('node_modules/')) return true;
  return false;
}

function syncToVendor(src, dest) {
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, {
    recursive: true,
    filter: (_source, destination) => {
      const rel = destination.replace(dest, '').replace(/^[\\/]/, '');
      return !shouldIgnoreCopy(rel);
    },
  });
  writeFileSync(join(dest, '.own-skills-bundle'), '');
}

function linkCursorRules(vendorDir, projectDir) {
  const rulesSrc = join(vendorDir, '.cursor', 'rules');
  const rulesDest = join(projectDir, '.cursor', 'rules');
  if (!existsSync(rulesSrc)) return;
  try {
    cpSync(rulesSrc, rulesDest, { recursive: true, force: true });
    for (const f of readdirSync(rulesSrc)) {
      if (!f.endsWith('.mdc')) continue;
      const src = join(rulesSrc, f);
      const dst = join(rulesDest, f);
      try {
        rmSync(dst, { force: true });
        symlinkSync(src, dst, 'file');
      } catch {
        // Fall back to copied file (already copied above).
      }
    }
  } catch {
    // Non-fatal; install can continue without rule links.
  }
}

function listValidSkillDirs(skillsRoot) {
  if (!existsSync(skillsRoot)) return [];
  const entries = readdirSync(skillsRoot, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = join(skillsRoot, e.name);
    if (existsSync(join(dir, 'SKILL.md'))) out.push(dir);
  }
  return out;
}

function runInstallSkill(pyBin, bundleRoot, skillDir, projectDir, mode, allIdes) {
  const args = [
    join(bundleRoot, 'scripts', 'install_skill.py'),
    skillDir,
    '--project-dir',
    projectDir,
    '--mode',
    mode,
    '--force',
  ];
  if (allIdes) args.push('--all-ides');
  execFileSync(pyBin, args, { stdio: 'pipe' });
}

function installAllSkills(pyBin, bundleRoot, skillsRoot, projectDir, mode, allIdes) {
  const skillDirs = listValidSkillDirs(skillsRoot);
  if (skillDirs.length === 0) {
    throw new Error(`No valid skills found under: ${skillsRoot}`);
  }
  const spinner = ora({ text: `Installing ${skillDirs.length} skills...`, color: 'cyan' }).start();
  let ok = 0;
  let fail = 0;
  for (const skillDir of skillDirs) {
    const name = skillDir.split(/[\\/]/).pop();
    spinner.text = `Installing ${name}...`;
    try {
      runInstallSkill(pyBin, bundleRoot, skillDir, projectDir, mode, allIdes);
      ok++;
    } catch {
      fail++;
    }
  }
  if (fail > 0) {
    spinner.warn(chalk.yellow(`Installed ${ok}/${skillDirs.length} skills (${fail} failed)`));
  } else {
    spinner.succeed(chalk.green(`Installed ${ok} skills`));
  }
}

function cleanupGitExclude(projectDir, skillNames) {
  const excludePath = join(projectDir, '.git', 'info', 'exclude');
  if (!existsSync(excludePath)) return;
  try {
    const lines = readFileSync(excludePath, 'utf8').split(/\r?\n/);
    const deny = new Set();
    for (const s of skillNames) {
      deny.add(`.cursor/skills/${s}/`);
      deny.add(`.claude/skills/${s}/`);
      deny.add(`.agent/skills/${s}/`);
    }
    const kept = lines.filter((l) => !deny.has(l.trim()));
    writeFileSync(excludePath, `${kept.join('\n').replace(/\n+$/,'')}\n`, 'utf8');
  } catch {
    // Non-fatal
  }
}

function removeIfExists(path) {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true });
}

function listInstalledSkills(projectDir) {
  const cursorSkills = join(projectDir, '.cursor', 'skills');
  if (!existsSync(cursorSkills)) return [];
  const entries = readdirSync(cursorSkills, { withFileTypes: true });
  const names = [];
  for (const e of entries) {
    if (e.name === '.install-manifest') continue;
    names.push(e.name);
  }
  return Array.from(new Set(names)).sort();
}

function cleanupEmptyDirs(path) {
  if (!existsSync(path)) return;
  for (const name of readdirSync(path)) {
    const child = join(path, name);
    if (statSync(child).isDirectory()) cleanupEmptyDirs(child);
  }
  try {
    if (readdirSync(path).length === 0) rmSync(path, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

function uninstallNode(projectDir, force, nuclear) {
  const skills = listInstalledSkills(projectDir);
  if (!force && process.stdin.isTTY && skills.length > 0) {
    console.log(chalk.yellow(`\nSkills to uninstall from ${projectDir}:`));
    skills.forEach((s) => console.log(` - ${s}`));
  }

  const spinner = ora({ text: 'Removing installed skills...', color: 'cyan' }).start();
  for (const s of skills) {
    removeIfExists(join(projectDir, '.cursor', 'skills', s));
    removeIfExists(join(projectDir, '.claude', 'skills', s));
    removeIfExists(join(projectDir, '.agent', 'skills', s));
  }
  cleanupGitExclude(projectDir, skills);
  removeIfExists(join(projectDir, '.cursor', 'skills', '.install-manifest'));

  if (nuclear) {
    removeIfExists(join(projectDir, '.cursor'));
  } else {
    const removableRuleNames = new Set();
    const vendorRules = join(projectDir, 'vendor', 'own-skills', '.cursor', 'rules');
    if (existsSync(vendorRules)) {
      for (const f of readdirSync(vendorRules)) {
        if (f.endsWith('.mdc')) removableRuleNames.add(f);
      }
    }
    const rulesDir = join(projectDir, '.cursor', 'rules');
    if (existsSync(rulesDir)) {
      for (const f of readdirSync(rulesDir)) {
        if (f.endsWith('.mdc') && removableRuleNames.has(f)) {
          const p = join(rulesDir, f);
          try {
            unlinkSync(p);
          } catch {
            removeIfExists(p);
          }
        }
      }
    }
    removeIfExists(join(projectDir, 'vendor', 'own-skills'));
    cleanupEmptyDirs(join(projectDir, 'vendor'));
    cleanupEmptyDirs(join(projectDir, '.cursor'));
    cleanupEmptyDirs(join(projectDir, '.claude'));
    cleanupEmptyDirs(join(projectDir, '.agent'));
  }

  spinner.succeed(chalk.green('Uninstall completed'));
}

async function cmdInstall(flags) {
  const pyBin = detectPythonExecutable();
  let repo = flags.repo;
  let projectDir = flags.projectDir;
  let full = flags.full;
  let skillsOnly = flags.skillsOnly;
  let cursorOnly = flags.cursorOnly;

  const interactive = !flags.yes && process.stdin.isTTY;

  if (interactive) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'repo',
        message: 'GitHub repo (user/repo or HTTPS)',
        default: normalizeRepo(repo),
      },
      {
        type: 'input',
        name: 'projectDir',
        message: 'Target project directory',
        default: projectDir,
      },
      {
        type: 'list',
        name: 'mode',
        message: 'Install mode',
        choices: [
          { name: 'Full bundle (vendor/own-skills + rules + all IDE skills)', value: 'full' },
          { name: 'Skills only (copy into project; no vendor bundle)', value: 'skills' },
        ],
        default: skillsOnly ? 'skills' : 'full',
      },
      {
        type: 'list',
        name: 'allIdes',
        message: 'IDE targets',
        choices: [
          { name: 'All IDEs (.cursor + .claude + .agent)', value: true },
          { name: 'Cursor only (.cursor)', value: false },
        ],
        default: !cursorOnly ? 0 : 1,
        when: (a) => a.mode === 'full' || a.mode === 'skills',
      },
    ]);
    repo = normalizeRepo(answers.repo);
    projectDir = resolve(answers.projectDir);
    if (answers.mode === 'skills') {
      skillsOnly = true;
      full = false;
      cursorOnly = answers.allIdes === false;
    } else {
      skillsOnly = false;
      full = true;
      cursorOnly = answers.allIdes === false;
    }
  } else {
    repo = normalizeRepo(repo);
    projectDir = resolve(projectDir);
  }

  if (!existsSync(projectDir)) {
    console.error(chalk.red(`Project directory does not exist: ${projectDir}`));
    process.exit(1);
  }
  if (full && skillsOnly) {
    console.error(chalk.red('Use either --full or --skills-only, not both.'));
    process.exit(1);
  }

  const { tempDir } = await fetchToTempImpl(repo);
  const scriptsDir = join(tempDir, 'scripts');
  if (!existsSync(join(scriptsDir, 'install_skill.py'))) {
    console.error(chalk.red(`install_skill.py not found in fetched repo (${scriptsDir})`));
    process.exit(1);
  }

  try {
    if (skillsOnly) {
      installAllSkills(pyBin, tempDir, join(tempDir, 'skills'), projectDir, 'copy', !cursorOnly);
    } else {
      const vendorDir = join(projectDir, 'vendor', 'own-skills');
      const spinner = ora({ text: `Syncing bundle to ${vendorDir} ...`, color: 'cyan' }).start();
      syncToVendor(tempDir, vendorDir);
      linkCursorRules(vendorDir, projectDir);
      spinner.succeed(chalk.green('Bundle synced'));
      installAllSkills(pyBin, vendorDir, join(vendorDir, 'skills'), projectDir, 'symlink', !cursorOnly);
      console.log(chalk.cyan('Verify: python3 vendor/own-skills/scripts/verify_bundle_install.py'));
    }
  } finally {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

async function cmdUninstall(flags) {
  let repo = flags.repo;
  let projectDir = flags.projectDir;
  let force = flags.force;
  let nuclear = flags.nuclear;

  const interactive = !flags.yes && process.stdin.isTTY;

  if (interactive) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'repo',
        message: 'GitHub repo (for uninstall.sh script)',
        default: normalizeRepo(repo),
      },
      {
        type: 'input',
        name: 'projectDir',
        message: 'Project directory to uninstall from',
        default: projectDir,
      },
      {
        type: 'list',
        name: 'force',
        message: 'Confirmation behavior',
        choices: [
          { name: 'Ask confirmation (safe default)', value: false },
          { name: 'Force remove without confirmation', value: true },
        ],
        default: 0,
      },
      {
        type: 'list',
        name: 'nuclear',
        message: chalk.red('NUCLEAR: delete entire .cursor directory?'),
        choices: [
          { name: 'No (keep .cursor except own-skills artifacts)', value: false },
          { name: 'Yes (remove entire .cursor)', value: true },
        ],
        default: 0,
      },
    ]);
    repo = normalizeRepo(answers.repo);
    projectDir = resolve(answers.projectDir);
    force = answers.force;
    nuclear = answers.nuclear;
  } else {
    repo = normalizeRepo(repo);
    projectDir = resolve(projectDir);
  }

  uninstallNode(projectDir, force, nuclear);
}

async function main() {
  const raw = process.argv.slice(2);
  let cmd = 'install';
  if (raw[0] === 'install' || raw[0] === 'uninstall') {
    cmd = raw.shift();
  }
  if (raw[0] === '--help' || raw[0] === '-h') {
    printHelp();
    process.exit(0);
  }

  try {
    if (cmd === 'uninstall') {
      const flags = parseFlags(raw, 'uninstall');
      await cmdUninstall(flags);
    } else {
      const flags = parseFlags(raw, 'install');
      await cmdInstall(flags);
    }
  } catch (e) {
    console.error(chalk.red((e && e.message) || e));
    printHelp();
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(chalk.red((e && e.message) || e));
  process.exit(1);
});
