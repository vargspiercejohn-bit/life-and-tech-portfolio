[CmdletBinding(SupportsShouldProcess)]
param()

$snapshot = Join-Path $PSScriptRoot '_system-backups\before-studio-2026-09-28'
$pages = @('index.html', 'landing.html', 'portfolio.html', 'projects\project-1.html', 'projects\project-2.html', 'projects\project-3.html')
foreach ($page in $pages) {
    if (-not (Test-Path -LiteralPath (Join-Path $snapshot $page))) {
        throw "Missing backup: $page. No restoration performed."
    }
}
foreach ($page in $pages) {
    $destination = Join-Path $PSScriptRoot $page
    if ($PSCmdlet.ShouldProcess($destination, 'Restore September 28 pre-redesign page')) {
        Copy-Item -LiteralPath (Join-Path $snapshot $page) -Destination $destination -Force
    }
}
Write-Output 'Restoration processed. Original styles and scripts remain in the project.'
