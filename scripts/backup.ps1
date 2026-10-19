# ==============================================================================
# DevOps Stored Data - Windows Backup Script (PowerShell)
# ==============================================================================

param (
    [string]$BackupDir = "$PSScriptRoot\..\backups",
    [string]$DataDir = "$PSScriptRoot\..\backend\data",
    [string]$UploadsDir = "$PSScriptRoot\..\backend\uploads",
    [int]$RetentionDays = 7
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archiveName = "devops_backup_$timestamp.zip"
$destPath = Join-Path $BackupDir $archiveName

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

$tempStage = Join-Path ([System.IO.Path]::GetTempPath()) ("devops_stage_" + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempStage -Force | Out-Null

try {
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "Starting DevOps Stored Data Backup: $timestamp" -ForegroundColor Cyan
    Write-Host "=================================================="

    # 1. Copy SQLite database files
    $dbFile = Join-Path $DataDir "devops_stored.sqlite"
    if (Test-Path $dbFile) {
        Write-Host "Backing up SQLite database..." -ForegroundColor Green
        Copy-Item -Path "$DataDir\devops_stored.sqlite*" -Destination $tempStage -Force
    }

    # 2. Copy Uploads Vault
    if (Test-Path $UploadsDir) {
        Write-Host "Backing up uploaded files vault..." -ForegroundColor Green
        $stageUploads = Join-Path $tempStage "uploads"
        Copy-Item -Path $UploadsDir -Destination $stageUploads -Recurse -Force
    }

    # 3. Create zip
    Write-Host "Compressing archive to $destPath..." -ForegroundColor Yellow
    Compress-Archive -Path "$tempStage\*" -DestinationPath $destPath -Force

    $size = (Get-Item $destPath).Length / 1MB
    Write-Host "Backup completed: $destPath ($('{0:N2}' -f $size) MB)" -ForegroundColor Green

    # 4. Retention Pruning
    $cutoff = (Get-Date).AddDays(-$RetentionDays)
    Get-ChildItem -Path $BackupDir -Filter "devops_backup_*.zip" | Where-Object { $_.LastWriteTime -lt $cutoff } | Remove-Item -Force
    Write-Host "Cleaned backups older than $RetentionDays days." -ForegroundColor Gray

} finally {
    if (Test-Path $tempStage) {
        Remove-Item -Path $tempStage -Recurse -Force
    }
}
