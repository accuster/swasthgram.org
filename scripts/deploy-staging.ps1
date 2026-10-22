# Deploys to the sbx.swasthgram.org staging site.
# Usage:
#   .\scripts\deploy-staging.ps1              # full deploy (rebuilds frontend too)
#   .\scripts\deploy-staging.ps1 -BackendOnly # skip the frontend build/upload, just backend code
#
# Requires: the local SSH key authorized on the server (one-time setup, see chat).

param([switch]$BackendOnly)

$ErrorActionPreference = "Stop"
$ServerUser = "swasthgram-sbx"
$ServerHost = "147.93.106.176"
$RemoteDir  = "htdocs/sbx.swasthgram.org"
$RepoRoot   = Split-Path -Parent $PSScriptRoot
$Staging    = Join-Path $env:TEMP "swasthgram-deploy"
$ZipPath    = Join-Path $env:TEMP "swasthgram-deploy.zip"

Remove-Item -Recurse -Force $Staging -ErrorAction SilentlyContinue
Remove-Item -Force $ZipPath -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force (Join-Path $Staging "backend\gala") | Out-Null
New-Item -ItemType Directory -Force (Join-Path $Staging "backend\donation") | Out-Null
New-Item -ItemType Directory -Force (Join-Path $Staging "backend\migrations") | Out-Null

Push-Location $RepoRoot
try {
    Copy-Item package.json, package-lock.json $Staging
    Copy-Item backend\server.js, backend\db.js, backend\stripeClient.js, backend\mailer.js, backend\webhookRouter.js, backend\transactionService.js, backend\package.json, backend\package-lock.json, backend\schema.sql, backend\.env.example (Join-Path $Staging "backend")
    Copy-Item backend\gala\*.js (Join-Path $Staging "backend\gala")
    Copy-Item backend\donation\*.js (Join-Path $Staging "backend\donation")
    Copy-Item backend\migrations\*.sql (Join-Path $Staging "backend\migrations")

    if (-not $BackendOnly) {
        Write-Host "Building frontend..." -ForegroundColor Cyan
        npm run build
        Copy-Item -Recurse frontend\dist (Join-Path $Staging "dist")
    }
}
finally {
    Pop-Location
}

Write-Host "Packaging..." -ForegroundColor Cyan
Compress-Archive -Path (Join-Path $Staging "*") -DestinationPath $ZipPath -Force

Write-Host "Uploading..." -ForegroundColor Cyan
scp $ZipPath "${ServerUser}@${ServerHost}:~/${RemoteDir}/deploy.zip"
if ($LASTEXITCODE -ne 0) { throw "scp failed" }

Write-Host "Installing + restarting on server..." -ForegroundColor Cyan
# `unzip` exits 1 for warnings (e.g. "appears to use backslashes as path
# separators", which Compress-Archive's zips always trigger on Linux) as well
# as for real errors, so it's run with `;` rather than `&&` here -- a true
# extraction failure still surfaces because the later steps won't find the
# files they expect.
$remoteCmd = "cd ~/$RemoteDir && unzip -o deploy.zip; rm -f deploy.zip && npm install && (npx pm2 restart swasthgram-sbx-api || npx pm2 start backend/server.js --name swasthgram-sbx-api --cwd ~/$RemoteDir) && npx pm2 save"
ssh "${ServerUser}@${ServerHost}" $remoteCmd
if ($LASTEXITCODE -ne 0) { throw "remote deploy command failed" }

Write-Host "Done. Check: https://sbx.swasthgram.org/api/health" -ForegroundColor Green
