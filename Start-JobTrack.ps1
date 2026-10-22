$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path (Join-Path $root 'server\node_modules'))) { throw 'Dependencies are missing. Run Setup-JobTrack.ps1 first.' }
if (-not (Test-Path (Join-Path $root 'client\node_modules'))) { throw 'Frontend dependencies are missing. Run Setup-JobTrack.ps1 first.' }
if (-not (Test-Path (Join-Path $root 'server\.env'))) { throw 'server/.env is missing. Run Setup-JobTrack.ps1 first.' }
$serverCommand = "Set-Location '$($root.Replace("'","''"))\server'; npm run dev"
$clientCommand = "Set-Location '$($root.Replace("'","''"))\client'; npm run dev"
Start-Process powershell -ArgumentList @('-NoExit','-ExecutionPolicy','Bypass','-Command',$serverCommand)
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList @('-NoExit','-ExecutionPolicy','Bypass','-Command',$clientCommand)
Write-Host 'Opened backend and frontend terminals. Keep both windows running.' -ForegroundColor Green
Write-Host 'Frontend: http://127.0.0.1:5173'
Write-Host 'Backend health check: http://localhost:5000/api/health'
