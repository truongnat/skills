param(
    [ValidateSet("prompt", "replace", "skip")]
    [string]$AgentsMode
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

$Target = Get-Location
$Source = $null
$Tmp = $null

function Remove-Tmp {
    if ($Tmp -and (Test-Path $Tmp)) {
        Remove-Item -Path $Tmp -Recurse -Force
    }
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

    Write-Host "Installing skills into $((Get-Location).Path)\.agents ..."

    New-Item -ItemType Directory -Force -Path ".agents" | Out-Null
    New-Item -ItemType Directory -Force -Path ".agents/skills" | Out-Null

    $skills = Get-ChildItem -Path (Join-Path $Source "skills") -Directory | Sort-Object Name

    Write-Host "Found $($skills.Count) skills."

    foreach ($skill in $skills) {
        Write-Host "Installing skill $($skill.Name) ..."
        $dest = Join-Path ".agents/skills" $skill.Name
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        Get-ChildItem -Path $skill.FullName -Force |
            Where-Object { $_.Name -ne ".venv" } |
            Copy-Item -Destination $dest -Recurse -Force
    }

    $obsoleteOfficeMcp = Join-Path ".agents/skills" "office-mcp"
    if (Test-Path $obsoleteOfficeMcp) {
        Write-Host "Removing obsolete skill office-mcp ..."
        Remove-Item -Path $obsoleteOfficeMcp -Recurse -Force
    }

    Copy-Item -Path (Join-Path $Source "docs/DESIGN_SYSTEM.md") -Destination ".agents/DESIGN_SYSTEM.md" -Force
    Copy-Item -Path (Join-Path $Source "docs/THIRD_PARTY_SKILLS.md") -Destination ".agents/THIRD_PARTY_SKILLS.md" -Force

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

    Write-Host "Skills installed successfully."
}
finally {
    Remove-Tmp
}
