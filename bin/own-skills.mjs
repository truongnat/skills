#!/usr/bin/env node
/**
 * own-skills — npx-friendly installer / uninstaller.
 * Fetches this repo with degit (no .git history), then runs install.sh / uninstall.sh via bash.
 * Requires: Node 18+, git, bash, python3 (required by the bundled install engine).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
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
  uninstall   Remove bundle symlinks / vendor (see uninstall.sh)

${chalk.bold('Install options')}
  --repo <user/repo|https://github.com/...>   Source repo (default: ${DEFAULT_REPO})
  --project-dir <path>   Target project root (default: current directory)
  --full                 Copy to vendor/own-skills + link rules + skills (default)
  --skills-only          Install copied skills only (no full bundle)
  --cursor-only          Cursor skills only (omit --all-ides)
  --yes, -y              Skip prompts (use defaults / flags only)

${chalk.bold('Uninstall options')}
  --repo <user/repo>     Repo to fetch uninstall.sh from (default: ${DEFAULT_REPO})
  --project-dir <path>   Project root (default: cwd)
  --force                No confirmation
  --nuclear              Remove entire .cursor (dangerous; see uninstall.sh)

${chalk.bold('Environment')}
  Requires ${chalk.yellow('bash')}, ${chalk.yellow('git')}, ${chalk.yellow('python3')} on PATH (used by install.sh / uninstall.sh).

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

function runBash(scriptPath, args) {
  execFileSync('bash', [scriptPath, ...args], { stdio: 'inherit' });
}

async function cmdInstall(flags) {
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
        type: 'confirm',
        name: 'allIdes',
        message: 'Install for Cursor + Claude Code + Antigravity (.cursor, .claude, .agent)?',
        default: !cursorOnly,
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
  const installSh = join(tempDir, 'install.sh');
  if (!existsSync(installSh)) {
    console.error(chalk.red(`install.sh not found in fetched repo (${installSh})`));
    process.exit(1);
  }

  /**
   * Full bundle: first arg `.` — install.sh uses SCRIPT_DIR (this temp tree) as source (see install.sh).
   * Skills-only: first arg must be a git URL so install.sh takes the remote branch (copy mode). Using `.`
   * from another cwd breaks skills-only unless the URL form is used (see install.sh).
   */
  const bashArgs = skillsOnly
    ? [httpsCloneUrl(repo), '--project-dir', projectDir, '--skills-only']
    : ['.', '--project-dir', projectDir, '--full'];
  if (!cursorOnly) bashArgs.push('--all-ides');

  try {
    runBash(installSh, bashArgs);
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
        type: 'confirm',
        name: 'force',
        message: 'Proceed without extra confirmation (non-destructive for normal uninstall)?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'nuclear',
        message: chalk.red('NUCLEAR: delete entire .cursor directory?'),
        default: false,
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

  const { tempDir } = await fetchToTempImpl(repo);
  const uninstallSh = join(tempDir, 'uninstall.sh');
  if (!existsSync(uninstallSh)) {
    console.error(chalk.red(`uninstall.sh not found (${uninstallSh})`));
    process.exit(1);
  }

  const uargs = ['--project-dir', projectDir];
  if (force) uargs.push('--force');
  if (nuclear) uargs.push('--nuclear');

  try {
    runBash(uninstallSh, uargs);
  } finally {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
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
