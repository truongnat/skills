$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "Installing skills..."

New-Item -ItemType Directory -Force -Path ".agents" | Out-Null
New-Item -ItemType Directory -Force -Path ".agents/skills" | Out-Null

$skills = Get-ChildItem -Path "skills" -Directory | Sort-Object Name

Write-Host "Found $($skills.Count) skills."

foreach ($skill in $skills) {
    Write-Host "Installing skill $($skill.Name) ..."
    $dest = Join-Path ".agents/skills" $skill.Name
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    Copy-Item -Path (Join-Path $skill.FullName "*") -Destination $dest -Recurse -Force
}

Copy-Item -Path "docs/design-system.md" -Destination ".agents/design-system.md" -Force
Copy-Item -Path "docs/AGENTS.md" -Destination ".agents/AGENTS.md" -Force

Write-Host "Skills installed successfully."
