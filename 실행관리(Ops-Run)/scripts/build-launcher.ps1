$ErrorActionPreference = 'Stop'
$opsDirectory = Split-Path -Parent $PSScriptRoot
$packageDirectory = Split-Path -Parent $opsDirectory
$compiler = Join-Path $env:WINDIR 'Microsoft.NET/Framework64/v4.0.30319/csc.exe'
if (-not (Test-Path -LiteralPath $compiler)) {
    $compiler = Join-Path $env:WINDIR 'Microsoft.NET/Framework/v4.0.30319/csc.exe'
}
$executable = Join-Path $packageDirectory '패토브 실행.exe'
$source = Join-Path $PSScriptRoot 'Launcher.cs'
$icon = Join-Path $opsDirectory 'assets/mark.ico'
if (-not (Test-Path -LiteralPath $icon)) { throw 'Build assets/mark.ico first with node scripts/build-launcher-icon.cjs' }
& $compiler /nologo /target:winexe /platform:anycpu /optimize+ /codepage:65001 /utf8output "/out:$executable" "/win32icon:$icon" /reference:System.Windows.Forms.dll /reference:System.Web.Extensions.dll $source
if ($LASTEXITCODE -ne 0) { throw 'Launcher compilation failed' }
Write-Output "Built: $executable"
