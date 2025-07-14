# Binary Setup Instructions

## 🎯 Goal
Get both Rust binaries (`schema-gen-cli` and `wallet-cli`) working on all major platforms including your M3 MacBook Pro.

## 📦 Binaries Included

### 1. **schema-gen-cli**
- **Source**: `schema-gen/src/main.rs`
- **Purpose**: Generate TypeScript types from Radix package addresses
- **Used by**: `scrypto-dev generate-types` command

### 2. **wallet-cli** 
- **Source**: `wallet-compatible-derivation-main/crates/wallet_compatible_derivation_cli/src/main.rs`
- **Purpose**: Account generation, mnemonic handling, key derivation
- **Can be used by**: Account management commands

## 🖥️ Supported Platforms

✅ **Linux x64**: `x86_64-unknown-linux-gnu`  
✅ **Windows x64**: `x86_64-pc-windows-msvc` (.exe)  
✅ **macOS Intel**: `x86_64-apple-darwin`  
✅ **macOS Apple Silicon** (M1/M2/M3): `aarch64-apple-darwin` ← **Your M3 MacBook Pro**

## 🚀 Quick Setup

### Option A: Use GitHub Actions (Recommended)

1. **Push to GitHub** and let Actions build all platforms automatically
2. **Download artifacts** from the completed workflow
3. **Publish** the complete package

### Option B: Build Locally for Testing

```bash
# Test platform detection
node test-platform.js

# Build binaries for your platform (M3 MacBook Pro)
npm run build:binaries:local

# Build TypeScript
npm run build

# Test that binaries work
npm run start -- test-binaries

# Test the CLI
npm link
scrypto-dev test-binaries
scrypto-dev generate-types package_rdx1...
```

## 🧪 Testing Your M3 MacBook Pro

```bash
# 1. Check platform detection
node test-platform.js
# Should show: aarch64-apple-darwin

# 2. Build for your platform
chmod +x scripts/build-local-binaries.sh
./scripts/build-local-binaries.sh
# Should detect: 🍎 Detected Apple Silicon (M1/M2/M3)

# 3. Check binaries were created
ls -la dist/binaries/aarch64-apple-darwin/
# Should show: schema-gen-cli and wallet-cli

# 4. Test functionality
npm run build
npm run start -- test-binaries
```

## 📁 Expected Directory Structure After Build

```
dist/
├── commands/
├── utils/
├── index.js
└── binaries/
    ├── aarch64-apple-darwin/          ← Your M3 MacBook Pro
    │   ├── schema-gen-cli
    │   └── wallet-cli
    ├── x86_64-apple-darwin/           ← Intel Macs
    │   ├── schema-gen-cli
    │   └── wallet-cli
    ├── x86_64-unknown-linux-gnu/      ← Linux
    │   ├── schema-gen-cli
    │   └── wallet-cli
    └── x86_64-pc-windows-msvc/        ← Windows
        ├── schema-gen-cli.exe
        └── wallet-cli.exe
```

## 🔧 Troubleshooting

### "Binary not found" on M3 MacBook Pro
```bash
# Check if Rust target is installed
rustup target list --installed | grep aarch64-apple-darwin

# If not, add it:
rustup target add aarch64-apple-darwin

# Rebuild
npm run build:binaries:local
```

### Build fails on M3 MacBook Pro
```bash
# Make sure you have the latest Rust
rustup update

# Check Xcode command line tools
xcode-select --install

# Try building manually
cd schema-gen
cargo build --release --target aarch64-apple-darwin
```

### Testing wallet-cli functionality
```bash
# Test the wallet binary directly
./dist/binaries/aarch64-apple-darwin/wallet-cli --help

# Should show: "Babylon Account CreatiON."
```

## 📦 Publishing Process

### For Full Cross-Platform Release:

1. **Commit and push** to GitHub
2. **GitHub Actions** builds all 4 platforms automatically
3. **Download** the `npm-package` artifact 
4. **Extract** and publish:
   ```bash
   cd extracted-package/
   npm publish
   ```

### For Quick Testing:

1. **Build locally** for your platform:
   ```bash
   npm run build:binaries:local
   npm run build
   ```

2. **Test locally**:
   ```bash
   npm link
   scrypto-dev test-binaries
   ```

3. **Package and test install**:
   ```bash
   npm pack
   npm install -g ./scrypto-dev-1.1.1.tgz
   scrypto-dev --help
   ```

## ✅ Success Criteria

When everything works, users should be able to:

```bash
# Install your CLI
npm install -g scrypto-dev

# Use type generation immediately (no Rust required)
scrypto-dev generate-types package_rdx1pk...

# Test that binaries work
scrypto-dev test-binaries
# Should show: ✅ All binaries are ready!
```

## 🎯 Next Steps

1. **Test locally** on your M3 MacBook Pro
2. **Push to GitHub** to trigger cross-platform builds  
3. **Download artifacts** and test on different platforms if possible
4. **Publish** the complete package with all binaries

Your users will then get a CLI that "just works" on all major platforms! 🚀