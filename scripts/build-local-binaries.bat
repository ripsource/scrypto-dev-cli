@echo off
echo 🔨 Building local binaries for Windows...

set TARGET=x86_64-pc-windows-msvc
set BINARY_EXT=.exe

echo 🎯 Target platform: %TARGET%

:: Create binaries directory
if not exist "dist\binaries\%TARGET%" mkdir "dist\binaries\%TARGET%"

:: Build schema-gen
echo 📦 Building schema-gen...
cd schema-gen
cargo build --release --target %TARGET%
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to build schema-gen
    exit /b 1
)
cd ..

:: Copy schema-gen binary
copy "schema-gen\target\%TARGET%\release\schema-gen-cli.exe" "dist\binaries\%TARGET%\"

:: Build wallet-cli
echo 👛 Building wallet-cli...
cd wallet-compatible-derivation-main\crates\wallet_compatible_derivation_cli
cargo build --release --target %TARGET%
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to build wallet-cli
    exit /b 1
)
cd ..\..\..

:: Copy wallet-cli binary
copy "wallet-compatible-derivation-main\crates\wallet_compatible_derivation_cli\target\%TARGET%\release\wallet_compatible_derivation_cli.exe" "dist\binaries\%TARGET%\wallet-cli.exe"

echo ✅ Binaries built successfully!
echo 📁 Location: dist\binaries\%TARGET%\
echo 📄 Files:
dir "dist\binaries\%TARGET%\"

echo.
echo 🧪 Test the binaries:
echo   .\dist\binaries\%TARGET%\schema-gen-cli.exe --help
echo   .\dist\binaries\%TARGET%\wallet-cli.exe --help

pause