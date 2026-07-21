$ErrorActionPreference = "Stop"

try {
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
} catch {}

$RepoUrl = "https://github.com/xandarin-fatihi/TAHMISCI-SITE.git"
$Documents = [Environment]::GetFolderPath("MyDocuments")
$BaseDir = Join-Path $Documents "GitHub"
$TargetDir = Join-Path $BaseDir "TAHMISCI-SITE"

function Write-Section {
  param([string]$Message)
  Write-Host ""
  Write-Host "=== $Message ===" -ForegroundColor DarkYellow
}

function Require-Command {
  param(
    [string]$Name,
    [string]$InstallMessage
  )
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name bulunamadı. $InstallMessage"
  }
}

Write-Section "Tahmisçi lokal çalışma ortamı"
Write-Host "Hedef klasör: $TargetDir"

Require-Command "cmd" "Windows komut yorumlayıcısı gerekli."
Require-Command "npm" "Node.js LTS kurulu olmalı: https://nodejs.org/"

if (-not (Test-Path $BaseDir)) {
  Write-Section "GitHub klasörü oluşturuluyor"
  New-Item -ItemType Directory -Force -Path $BaseDir | Out-Null
}

if (Test-Path $TargetDir) {
  Write-Section "Mevcut proje klasörü bulundu"
  if (Test-Path (Join-Path $TargetDir ".git")) {
    Require-Command "git" "Mevcut repo güncellenebilmesi için Git kurulu olmalı: https://git-scm.com/download/win"
    Push-Location $TargetDir
    try {
      Write-Host "Git pull çalıştırılıyor..."
      git pull --ff-only
    } finally {
      Pop-Location
    }
  } else {
    throw "Klasör zaten var ama Git reposu değil: $TargetDir. Lütfen klasörü kontrol edin veya farklı bir adla yedekleyin."
  }
} else {
  Write-Section "Repo klonlanıyor"
  Require-Command "git" "Projeyi klonlamak için Git kurulu olmalı: https://git-scm.com/download/win"
  git clone $RepoUrl $TargetDir
}

Set-Location $TargetDir

if (-not (Test-Path "package.json")) {
  throw "package.json bulunamadı. Doğru proje klasöründe değilsiniz: $TargetDir"
}

$NodeModules = Join-Path $TargetDir "node_modules"
$ShouldInstall = -not (Test-Path $NodeModules)

if (-not $ShouldInstall -and (Test-Path "package-lock.json")) {
  $LockTime = (Get-Item "package-lock.json").LastWriteTimeUtc
  $ModulesTime = (Get-Item $NodeModules).LastWriteTimeUtc
  $ShouldInstall = $LockTime -gt $ModulesTime
}

if ($ShouldInstall) {
  Write-Section "Bağımlılıklar kuruluyor"
  cmd /c npm install
} else {
  Write-Section "Bağımlılıklar mevcut"
  Write-Host "node_modules bulundu, npm install atlandı."
}

Write-Section "Lokal sunucu başlatılıyor"
Write-Host "Ana site : http://localhost:8080/"
Write-Host "Panel    : http://localhost:8080/panel/"
Write-Host "Müdavim  : http://localhost:8080/mudavim/"
Write-Host ""
Write-Host "Sunucuyu kapatmak için bu pencerede Ctrl + C kullanın." -ForegroundColor DarkYellow
Write-Host ""

cmd /c npm run dev:local
