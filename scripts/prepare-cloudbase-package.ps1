$ErrorActionPreference = 'Stop'
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$target = [System.IO.Path]::GetFullPath((Join-Path $root 'cloudbase-package'))
if (-not $target.StartsWith($root + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'CloudBase package path is outside the workspace.'
}
if (Test-Path -LiteralPath $target) {
  Remove-Item -LiteralPath $target -Recurse -Force
}
New-Item -ItemType Directory -Path $target | Out-Null

$files = @(
  'package.json',
  'package-lock.json',
  'tsconfig.base.json',
  'Dockerfile',
  '.dockerignore'
)
foreach ($file in $files) {
  Copy-Item -LiteralPath (Join-Path $root $file) -Destination (Join-Path $target $file)
}

$dirs = @(
  @{ Source = 'apps/api/src'; Dest = 'apps/api/src' },
  @{ Source = 'apps/api/prisma'; Dest = 'apps/api/prisma' },
  @{ Source = 'packages/shared/src'; Dest = 'packages/shared/src' },
  @{ Source = 'scripts'; Dest = 'scripts' }
)
foreach ($item in $dirs) {
  $destination = Join-Path $target $item.Dest
  New-Item -ItemType Directory -Path $destination -Force | Out-Null
  Copy-Item -Path (Join-Path $root ($item.Source + '\*')) -Destination $destination -Recurse -Force
}

$singleFiles = @(
  @{ Source = 'apps/api/package.json'; Dest = 'apps/api/package.json' },
  @{ Source = 'apps/api/nest-cli.json'; Dest = 'apps/api/nest-cli.json' },
  @{ Source = 'apps/api/tsconfig.json'; Dest = 'apps/api/tsconfig.json' },
  @{ Source = 'apps/api/tsconfig.build.json'; Dest = 'apps/api/tsconfig.build.json' },
  @{ Source = 'apps/admin/package.json'; Dest = 'apps/admin/package.json' },
  @{ Source = 'apps/mobile/package.json'; Dest = 'apps/mobile/package.json' },
  @{ Source = 'packages/shared/package.json'; Dest = 'packages/shared/package.json' },
  @{ Source = 'packages/shared/tsconfig.json'; Dest = 'packages/shared/tsconfig.json' }
)
foreach ($item in $singleFiles) {
  $destination = Join-Path $target $item.Dest
  New-Item -ItemType Directory -Path (Split-Path $destination) -Force | Out-Null
  Copy-Item -LiteralPath (Join-Path $root $item.Source) -Destination $destination -Force
}

$zipPath = Join-Path $root 'cloudbase-api.zip'
if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}
Compress-Archive -Path (Join-Path $target '*') -DestinationPath $zipPath -CompressionLevel Optimal
Write-Host "CloudBase package: $target"
Write-Host "Zip package: $zipPath"
Write-Host ("Zip size: {0:N1} MB" -f ((Get-Item -LiteralPath $zipPath).Length / 1MB))
