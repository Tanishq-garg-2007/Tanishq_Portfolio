# package_zip.ps1
$root = "c:\Users\tanis\OneDrive\Documents\Ai-Ml\PortFolio"
$zipCodeOnly = Join-Path $root "pokemon-village-code-only.zip"
$zipFull = Join-Path $root "pokemon-village-portfolio.zip"

if (Test-Path $zipCodeOnly) { Remove-Item -Force $zipCodeOnly }
if (Test-Path $zipFull) { Remove-Item -Force $zipFull }

# Temp folders
$tempCode = Join-Path $env:TEMP "pokemon_code_only"
$tempFull = Join-Path $env:TEMP "pokemon_full"

if (Test-Path $tempCode) { Remove-Item -Recurse -Force $tempCode }
if (Test-Path $tempFull) { Remove-Item -Recurse -Force $tempFull }

New-Item -ItemType Directory -Path $tempCode | Out-Null
New-Item -ItemType Directory -Path $tempFull | Out-Null

# Files and folders to copy
$items = Get-ChildItem -Path $root -Exclude "node_modules", "dist", ".git", "*.zip", "scratch"

foreach ($item in $items) {
    Copy-Item -Path $item.FullName -Destination $tempFull -Recurse -Force
}

# For code-only, exclude models folder from public
foreach ($item in $items) {
    if ($item.Name -eq "public") {
        New-Item -ItemType Directory -Path (Join-Path $tempCode "public") | Out-Null
        $pubItems = Get-ChildItem -Path $item.FullName -Exclude "models"
        foreach ($p in $pubItems) {
            Copy-Item -Path $p.FullName -Destination (Join-Path $tempCode "public") -Recurse -Force
        }
    } else {
        Copy-Item -Path $item.FullName -Destination $tempCode -Recurse -Force
    }
}

# Add .env explicitly in case Get-ChildItem skipped hidden/dot files
if (Test-Path (Join-Path $root ".env")) {
    Copy-Item -Path (Join-Path $root ".env") -Destination $tempCode -Force
    Copy-Item -Path (Join-Path $root ".env") -Destination $tempFull -Force
}

# Compress
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempCode, $zipCodeOnly)
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempFull, $zipFull)

# Cleanup
Remove-Item -Recurse -Force $tempCode
Remove-Item -Recurse -Force $tempFull

Write-Output "Code-only size: $((Get-Item $zipCodeOnly).Length / 1KB) KB"
Write-Output "Full portfolio size: $((Get-Item $zipFull).Length / 1MB) MB"
