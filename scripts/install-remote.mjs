#!/usr/bin/env zx
/**
 * Remote installer UI (google/zx): clone repo, then run bundled install.sh.
 * Same flags as install-remote.sh; git clone uses inherited stdio for progress.
 *
 * @see https://github.com/google/zx
 */
import { spawn } from 'node:child_process'
import { constants } from 'node:fs'
import { access, chmod, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chalk, minimist, spinner, which } from 'zx'

$.verbose = false

const DEFAULT_REPO = 'https://github.com/truongnat/skills.git'
const ZX_PIN = '8.8.5'

function printBanner() {
  const bar = '─'.repeat(44)
  console.log('')
  console.log(chalk.cyan('  ╭') + chalk.cyan(bar) + chalk.cyan('╮'))
  console.log(
    '  │  ' +
      chalk.bold.white('own-skills') +
      chalk.gray(' · ') +
      chalk.hex('#2dd4bf')('remote installer') +
      chalk.gray(' · ') +
      chalk.dim('zx ' + ZX_PIN) +
      '  │',
  )
  console.log(
    '  │  ' + chalk.dim('vendor bundle · skills · multi-IDE paths') + '   │',
  )
  console.log(chalk.cyan('  ╰') + chalk.cyan(bar) + chalk.cyan('╯'))
  console.log('')
}

function step(n, title) {
  console.log(
    chalk.gray(`  ${String(n).padStart(2, '0')}`) + chalk.bold.white(`  ${title}`),
  )
}

function ok(msg) {
  console.log(chalk.green('     ✔ ') + msg)
}

function info(msg) {
  console.log(chalk.blue('     ℹ ') + msg)
}

function fail(msg) {
  console.error(chalk.red('     ✖ ') + msg)
}

function printHelp() {
  console.log(`
${chalk.bold('own-skills remote installer')} (${chalk.dim('zx')})

${chalk.bold('Usage:')}
  npx zx@8.8.5 scripts/install-remote.mjs [options]
  curl -fsSL …/install-remote.sh | bash

${chalk.bold('Options:')}
  --repo URL           Git clone URL (default: ${DEFAULT_REPO})
  --project-dir DIR    Target project (default: cwd)
  --cursor-only        Only .cursor/skills
  --skills-only        Skills only (no vendor bundle)
  -h, --help           Show help
`)
}

function parseArgs() {
  const opts = minimist(process.argv.slice(2), {
    string: ['repo', 'project-dir'],
    boolean: ['cursor-only', 'skills-only', 'help'],
    alias: { h: 'help' },
  })
  return {
    repo: opts.repo || DEFAULT_REPO,
    projectDir: resolve(opts['project-dir'] || process.cwd()),
    cursorOnly: Boolean(opts['cursor-only']),
    skillsOnly: Boolean(opts['skills-only']),
    help: Boolean(opts.help),
  }
}

function runGitClone(repoUrl, dest) {
  return new Promise((resolveFn, reject) => {
    const child = spawn(
      'git',
      ['clone', '--progress', '--depth', '1', repoUrl, dest],
      { stdio: 'inherit' },
    )
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolveFn()
      else reject(new Error(`git clone exited with code ${code}`))
    })
  })
}

function runBashInstall({
  tempDir,
  projectDir,
  skillsOnly,
  cursorOnly,
}) {
  const installPath = join(tempDir, 'install.sh')
  const args = [installPath, '.', '--project-dir', projectDir]
  if (skillsOnly) args.push('--skills-only')
  else args.push('--full')
  if (!cursorOnly) args.push('--all-ides')

  return new Promise((resolveFn, reject) => {
    const child = spawn('bash', args, {
      cwd: tempDir,
      stdio: 'inherit',
      env: { ...process.env },
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolveFn()
      else reject(new Error(`install.sh exited with code ${code}`))
    })
  })
}

async function main() {
  const opts = parseArgs()
  if (opts.help) {
    printHelp()
    process.exit(0)
  }

  printBanner()

  step(1, 'Checking tools')
  await spinner('     Verifying git & python3…', async () => {
    if (!(await which('git', { nothrow: true }))) {
      throw new Error('git is required. Install git and retry.')
    }
    if (!(await which('python3', { nothrow: true }))) {
      throw new Error('python3 is required. Install Python 3 and retry.')
    }
  })
  ok('git and python3 are available')

  const tempDir = await mkdtemp(join(tmpdir(), 'own-skills-'))
  let cleaned = false
  const cleanup = async () => {
    if (cleaned) return
    cleaned = true
    try {
      await rm(tempDir, { recursive: true, force: true })
    } catch {
      /* ignore */
    }
  }
  process.on('SIGINT', () => {
    void cleanup().finally(() => process.exit(130))
  })

  try {
    step(2, 'Cloning repository')
    info(opts.repo)
    await runGitClone(opts.repo, tempDir)
    ok('Repository ready')

    step(3, 'Validating layout')
    const installScript = join(tempDir, 'install.sh')
    try {
      await access(installScript, constants.F_OK)
    } catch {
      throw new Error(
        'install.sh not found — this does not look like an own-skills repo.',
      )
    }
    ok('install.sh found')

    step(4, 'Running installer')
    info(`Project: ${chalk.bold(opts.projectDir)}`)
    await chmod(installScript, 0o755)
    await runBashInstall({
      tempDir,
      projectDir: opts.projectDir,
      skillsOnly: opts.skillsOnly,
      cursorOnly: opts.cursorOnly,
    })
    ok('Install finished')

    console.log('')
    console.log(
      chalk.green.bold('  Done ') +
        chalk.dim('— skills and bundle are in your project tree.'),
    )
    if (!opts.skillsOnly) {
      console.log(
        chalk.dim(`     vendor: ${join(opts.projectDir, 'vendor/own-skills')}`),
      )
    }
    console.log(
      chalk.dim(
        '     IDE paths: .cursor/skills · .claude/skills · .agent/skills',
      ),
    )
    console.log('')
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    fail(msg)
    process.exitCode = 1
  } finally {
    await cleanup()
  }
}

await main()
