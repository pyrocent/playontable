param(
    [string]$Author
)

$ErrorActionPreference = 'Continue'

function ShouldInclude([string]$fullPath) {
    return (
        $fullPath -notlike '*\.git\*' -and 
        $fullPath -notlike '*\node_modules\*' -and 
        $fullPath -notlike '*\dist\*' -and 
        $fullPath -notlike '*\venv\*' -and 
        $fullPath -notlike '*\.venv\*'
    )
}

# Collect files, optionally filtered by Git author
$files = @()
if ($Author) {
    $inside = git rev-parse --is-inside-work-tree 2>$null
    if ($LASTEXITCODE -ne 0 -or ($inside -ne 'true')) {
        Write-Error 'Author filter requested but not inside a Git repository.'
        exit 1
    }
    $repoRoot = (git rev-parse --show-toplevel).Trim()
    $addedByAuthor = git log --diff-filter=A --author="$Author" --name-only --pretty=format: |
        Where-Object { $_ -ne '' } |
        Sort-Object -Unique
    foreach ($rel in $addedByAuthor) {
        $full = Join-Path $repoRoot $rel
        if (Test-Path -LiteralPath $full) {
            if (ShouldInclude $full) {
                try {
                    $item = Get-Item -LiteralPath $full -ErrorAction Stop
                    if ($item -and -not $item.PSIsContainer) { $files += $item }
                } catch { }
            }
        }
    }
}
else {
    $files = Get-ChildItem -File -Recurse -Force |
        Where-Object { ShouldInclude $_.FullName }
}

$blank = 0
$skipped = 0

foreach ($f in $files) {
    try {
        Get-Content -LiteralPath $f.FullName -ErrorAction Stop |
            ForEach-Object {
                if ([string]::IsNullOrWhiteSpace($_)) { $blank++ }
            }
    }
    catch {
        $skipped++
    }
}

Write-Output "Blank lines: $blank"
Write-Output "Files scanned: $($files.Count)"
Write-Output "Files skipped: $skipped"

