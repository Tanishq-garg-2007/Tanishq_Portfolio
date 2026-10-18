$models = @(
    "bulbasaur",
    "charmander",
    "dragonite",
    "eevee",
    "gengar",
    "jigglypuff",
    "meowth",
    "mew",
    "pikachu",
    "psyduck",
    "snorlax",
    "squirtle"
)

New-Item -ItemType Directory -Force -Path "public/models/optimized" | Out-Null

foreach ($m in $models) {
    Write-Host "Optimizing $m..."
    npx @gltf-transform/cli optimize "public/models/$m.glb" "public/models/optimized/$m.glb" --texture-compress webp --texture-size 512 --compress draco
}

Write-Host "Optimization complete! Comparing file sizes:"
Get-ChildItem -Path "public/models/optimized/*.glb" | Select-Object Name, @{Name="OptimizedSize_KB";Expression={[math]::Round($_.Length/1KB, 2)}} | Format-Table -AutoSize
