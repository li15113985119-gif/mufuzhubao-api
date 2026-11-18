$ErrorActionPreference = 'Stop'
$wlan = Get-NetIPAddress -InterfaceAlias 'WLAN' -AddressFamily IPv4 -AddressState Preferred | Select-Object -First 1
if (-not $wlan) { throw 'No active WLAN IPv4 address found.' }
$ip = $wlan.IPAddress
$mobileEnv = Join-Path $PSScriptRoot '..\apps\mobile\.env'
$apiEnv = Join-Path $PSScriptRoot '..\apps\api\.env'
$mobileContent = "# Local-device API configuration`r`nVITE_API_BASE_URL=http://${ip}:3000/api/v1`r`nVITE_H5_PUBLIC_URL=http://${ip}:8080`r`n"
[System.IO.File]::WriteAllText($mobileEnv, $mobileContent, [System.Text.UTF8Encoding]::new($false))
$apiText = Get-Content -Raw $apiEnv
$cors = "CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:8080,http://${ip}:5173,http://${ip}:4173,http://${ip}:8080"
$apiText = [regex]::Replace($apiText, '(?m)^CORS_ORIGINS=.*$', $cors)
[System.IO.File]::WriteAllText($apiEnv, $apiText, [System.Text.UTF8Encoding]::new($false))
Write-Host "Updated LAN IP: $ip"
Write-Host "Mobile API: http://${ip}:3000/api/v1"