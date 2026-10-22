$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "`n=== JobTrack setup ===" -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw 'Node.js was not found. Install Node.js LTS, reopen VS Code, and run this setup again.'
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw 'npm was not found. Reinstall Node.js LTS with npm, reopen VS Code, and run this setup again.'
}

$envPath = Join-Path $root 'server\.env'
if (-not (Test-Path $envPath)) {
  $secretBytes = New-Object byte[] 48
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try { $rng.GetBytes($secretBytes) } finally { $rng.Dispose() }
  $secret = [Convert]::ToBase64String($secretBytes).Replace('+','x').Replace('/','y').Replace('=','z')
  @"
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/jobtrack
JWT_SECRET=$secret
CLIENT_URL=http://127.0.0.1:5173
"@ | Set-Content -Path $envPath -Encoding ascii
  Write-Host 'Created server/.env with a random local JWT secret.' -ForegroundColor Green
} else {
  Write-Host 'Keeping your existing server/.env.' -ForegroundColor Yellow
}

Write-Host "`nInstalling backend packages..." -ForegroundColor Cyan
Push-Location (Join-Path $root 'server')
try { npm install --no-audit --no-fund } finally { Pop-Location }
Write-Host "`nInstalling frontend packages..." -ForegroundColor Cyan
Push-Location (Join-Path $root 'client')
try { npm install --no-audit --no-fund } finally { Pop-Location }
Write-Host "`nSetup complete. Make sure MongoDB Community Server is running, then run Start-JobTrack.ps1." -ForegroundColor Green
