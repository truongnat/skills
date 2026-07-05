$ErrorActionPreference = "Stop"

$Owner = if ($env:SIMPLE_SKILLS_OWNER) { $env:SIMPLE_SKILLS_OWNER } else { "truongnat" }
$Repo = if ($env:SIMPLE_SKILLS_REPO) { $env:SIMPLE_SKILLS_REPO } else { "simple-skills" }
$Branch = if ($env:SIMPLE_SKILLS_BRANCH) { $env:SIMPLE_SKILLS_BRANCH } else { "main" }
$Github = "$Owner/$Repo"

$Target = Get-Location
$Source = $null
$Tmp = $null

function Remove-Tmp {
    if ($Tmp -and (Test-Path $Tmp)) {
        Remove-Item -Path $Tmp -Recurse -Force
    }
}

try {
    if (Test-Path "skills" -PathType Container) {
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
        Copy-Item -Path (Join-Path $skill.FullName "*") -Destination $dest -Recurse -Force
    }

    Copy-Item -Path (Join-Path $Source "docs/DESIGN_SYSTEM.md") -Destination ".agents/DESIGN_SYSTEM.md" -Force
    Copy-Item -Path (Join-Path $Source "docs/TOOLS.md") -Destination ".agents/TOOLS.md" -Force
    Copy-Item -Path (Join-Path $Source "docs/AGENTS.md") -Destination ".agents/AGENTS.md" -Force

    Write-Host "Skills installed successfully."
}
finally {
    Remove-Tmp
}
