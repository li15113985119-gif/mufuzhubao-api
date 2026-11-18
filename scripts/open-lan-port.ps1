$ErrorActionPreference = 'Stop'
$ruleName = 'Kongxiaozhi API 3000'
Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue | Remove-NetFirewallRule
New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000 -Profile Any -Description 'Allow LAN devices to access Kongxiaozhi development API' | Out-Null
$wlan = Get-NetIPAddress -InterfaceAlias 'WLAN' -AddressFamily IPv4 -AddressState Preferred | Select-Object -First 1
Write-Host ''
Write-Host 'Firewall rule created successfully.'
if ($wlan) {
  Write-Host "Phone test URL: http://$($wlan.IPAddress):3000/api/v1/health"
}
Write-Host 'Keep the phone and computer on the same Wi-Fi.'
Write-Host ''