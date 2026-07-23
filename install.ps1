param(
    [ValidateSet("prompt", "replace", "skip")]
    [string]$AgentsMode,

    [string]$Profile
)

$ErrorActionPreference = "Stop"

$Owner = if ($env:SIMPLE_SKILLS_OWNER) { $env:SIMPLE_SKILLS_OWNER } else { "truongnat" }
$Repo = if ($env:SIMPLE_SKILLS_REPO) { $env:SIMPLE_SKILLS_REPO } else { "simple-skills" }
$Branch = if ($env:SIMPLE_SKILLS_BRANCH) { $env:SIMPLE_SKILLS_BRANCH } else { "main" }
$Github = "$Owner/$Repo"
if (-not $AgentsMode) {
    $AgentsMode = if ($env:SIMPLE_SKILLS_AGENTS_MODE) {
        $env:SIMPLE_SKILLS_AGENTS_MODE.ToLowerInvariant()
    } else {
        "prompt"
    }
}
if ($AgentsMode -notin @("prompt", "replace", "skip")) {
    throw "AgentsMode must be prompt, replace, or skip."
}
if (-not $Profile) {
    $Profile = if ($env:SIMPLE_SKILLS_PROFILE) {
        $env:SIMPLE_SKILLS_PROFILE
    } else {
        "core"
    }
}

$Target = Get-Location
$Source = $null
$Tmp = $null

function Remove-Tmp {
    if ($Tmp -and (Test-Path $Tmp)) {
        Remove-Item -Path $Tmp -Recurse -Force
    }
}

function Resolve-InstallSkills {
    param(
        [string]$SourceRoot,
        [string]$ProfileName
    )
    $resolver = Join-Path $SourceRoot "scripts/resolve_install_profile.py"
    $python = Get-Command python3 -ErrorAction SilentlyContinue
    if (-not $python) {
        $python = Get-Command python -ErrorAction SilentlyContinue
    }
    if ($python) {
        $output = & $python.Source $resolver --source $SourceRoot --profile $ProfileName --check
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to resolve install profile '$ProfileName'."
        }
        return @($output | Where-Object { $_ -and $_.Trim() })
    }
    if ($ProfileName -ne "all") {
        throw "Python is required to resolve install profile '$ProfileName'. Use -Profile all."
    }
    return @(Get-ChildItem -Path (Join-Path $SourceRoot "skills") -Directory |
        Sort-Object Name |
        ForEach-Object { $_.Name })
}

try {
    # Detect the simple-skills repo itself — not any project that happens to have a skills/ dir.
    function Test-SimpleSkillsSource {
        param([string]$Root)
        return (Test-Path (Join-Path $Root "docs/AGENTS.md") -PathType Leaf) `
            -and (Test-Path (Join-Path $Root "skills/planning/SKILL.md") -PathType Leaf) `
            -and (Test-Path (Join-Path $Root "skills/execution/SKILL.md") -PathType Leaf)
    }

    if (Test-SimpleSkillsSource -Root $Target.Path) {
        $Source = $Target.Path
    } else {
        Write-Host "Downloading ${Github}@${Branch} ..."
        $Tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("simple-skills-" + [guid]::NewGuid().ToString())
        New-Item -ItemType Directory -Force -Path $Tmp | Out-Null

        $Archive = Join-Path $Tmp "repo.zip"
        $Extract = Join-Path $Tmp "extract"
        $ZipUrl = "https://github.com/$Github/archive/refs/heads/$Branch.zip"

        Invoke-WebRequest -Uri $ZipUrl -OutFile $Archive -UseBasicParsing
        Expand-Archive -Path $Archive -DestinationPath $Extract -Force

        $Source = Get-ChildItem -Path $Extract -Directory | Select-Object -First 1 -ExpandProperty FullName
    }

    Write-Host "Installing skills into $((Get-Location).Path)\.agents (profile: $Profile) ..."

    New-Item -ItemType Directory -Force -Path ".agents" | Out-Null
    New-Item -ItemType Directory -Force -Path ".agents/skills" | Out-Null

    $selected = Resolve-InstallSkills -SourceRoot $Source -ProfileName $Profile
    if ($selected.Count -eq 0) {
        throw "Profile '$Profile' resolved to zero skills."
    }
    Write-Host "Installing $($selected.Count) skills."

    foreach ($skillName in $selected) {
        Write-Host "Installing skill $skillName ..."
        $skillPath = Join-Path $Source "skills/$skillName"
        if (-not (Test-Path $skillPath -PathType Container)) {
            throw "Missing skill source: $skillName"
        }
        $dest = Join-Path ".agents/skills" $skillName
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        # Mirror managed content so removed/renamed files do not remain stale.
        # Preserve only the skill-local virtual environment.
        Get-ChildItem -Path $dest -Force |
            Where-Object { $_.Name -ne ".venv" } |
            Remove-Item -Recurse -Force
        Get-ChildItem -Path $skillPath -Force |
            Where-Object { $_.Name -ne ".venv" } |
            Copy-Item -Destination $dest -Recurse -Force
    }

    $selectedSet = [System.Collections.Generic.HashSet[string]]::new(
        [string[]]$selected,
        [System.StringComparer]::OrdinalIgnoreCase
    )
    Get-ChildItem -Path ".agents/skills" -Directory | ForEach-Object {
        if (-not $selectedSet.Contains($_.Name)) {
            Write-Host "Removing skill not in profile: $($_.Name) ..."
            Remove-Item -Path $_.FullName -Recurse -Force
        }
    }

    $obsoleteOfficeMcp = Join-Path ".agents/skills" "office-mcp"
    if (Test-Path $obsoleteOfficeMcp) {
        Write-Host "Removing obsolete skill office-mcp ..."
        Remove-Item -Path $obsoleteOfficeMcp -Recurse -Force
    }

    Copy-Item -Path (Join-Path $Source "docs/DESIGN_SYSTEM.md") -Destination ".agents/DESIGN_SYSTEM.md" -Force
    Copy-Item -Path (Join-Path $Source "docs/CODE_COMMENTS.md") -Destination ".agents/CODE_COMMENTS.md" -Force
    Copy-Item -Path (Join-Path $Source "docs/THIRD_PARTY_SKILLS.md") -Destination ".agents/THIRD_PARTY_SKILLS.md" -Force
    Copy-Item -Path (Join-Path $Source "docs/SKILL_PREAMBLE.md") -Destination ".agents/SKILL_PREAMBLE.md" -Force
    Copy-Item -Path (Join-Path $Source "docs/AGENT_POLICY.md") -Destination ".agents/AGENT_POLICY.md" -Force

    $toolsSource = Join-Path $Source "tools"
    if (Test-Path $toolsSource -PathType Container) {
        Write-Host "Installing tools into .agents/tools ..."
        $toolsDest = Join-Path ".agents" "tools"
        New-Item -ItemType Directory -Force -Path $toolsDest | Out-Null
        Get-ChildItem -Path $toolsDest -Force |
            Where-Object { $_.Name -ne "decision-logs" } |
            Remove-Item -Recurse -Force
        Get-ChildItem -Path $toolsSource -Force |
            Where-Object { $_.Name -ne "decision-logs" } |
            Copy-Item -Destination $toolsDest -Recurse -Force
    }

    New-Item -ItemType Directory -Force -Path ".agents/tools/session" | Out-Null
    Copy-Item -Path (Join-Path $Source "docs/artifact-schemas.json") `
        -Destination ".agents/tools/session/artifact-schemas.json" -Force

    # Preserve the user's existing settings (e.g. language choice) on reinstall.
    $settingsDest = Join-Path ".agents" "settings.yaml"
    if (Test-Path $settingsDest -PathType Leaf) {
        Write-Host "Keeping existing .agents/settings.yaml."
    } else {
        Copy-Item -Path (Join-Path $Source "docs/settings.yaml") -Destination $settingsDest -Force
    }

    $installAgentsFile = $true
    $agentsPath = Join-Path $Target.Path "AGENTS.md"
    if (Test-Path $agentsPath -PathType Leaf) {
        switch ($AgentsMode) {
            "replace" {
                Write-Host "Replacing existing $agentsPath ..."
            }
            "skip" {
                Write-Host "Keeping existing $agentsPath."
                $installAgentsFile = $false
            }
            "prompt" {
                try {
                    $answer = Read-Host "AGENTS.md already exists. Replace it? [y/N]"
                }
                catch {
                    $answer = ""
                    Write-Warning "No interactive prompt is available."
                }
                if ($answer -match "^(?i:y|yes)$") {
                    Write-Host "Replacing existing $agentsPath ..."
                } else {
                    Write-Host "Keeping existing $agentsPath."
                    Write-Host "Use -AgentsMode replace or SIMPLE_SKILLS_AGENTS_MODE=replace to replace it."
                    $installAgentsFile = $false
                }
            }
        }
    }
    if ($installAgentsFile) {
        Copy-Item -Path (Join-Path $Source "docs/AGENTS.md") -Destination $agentsPath -Force
    }

    $obsoleteAgentsPath = Join-Path ".agents" "AGENTS.md"
    if (Test-Path $obsoleteAgentsPath) {
        Remove-Item -Path $obsoleteAgentsPath -Force
    }

    Write-Host "Skills installed successfully (profile: $Profile)."
}
finally {
    Remove-Tmp
}
