# Binary Publishing Guide

This guide explains how to publish your CLI tool with precompiled Rust binaries for all major platforms.

## Overview

The CLI tool includes Rust binaries for:
- **schema-gen-cli**: Generates TypeScript types from Radix packages
- **wallet-cli**: Handles wallet operations and key derivation

These are built for multiple platforms and included in the npm package so users don't need Rust installed.

## Supported Platforms

- **Linux**: x86_64-unknown-linux-gnu
- **macOS Intel**: x86_64-apple-darwin  
- **macOS Apple Silicon**: aarch64-apple-darwin
- **Windows**: x86_64-pc-windows-msvc

## Automated Publishing (Recommended)

### GitHub Actions Setup

The repository includes GitHub Actions that automatically:
1. Build binaries for all platforms
2. Create a release-ready package
3. Include all binaries in the npm package

**Workflow file**: `.github/workflows/build-binaries.yml`

### Publishing Steps

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Download built package**:
   - Go to GitHub Actions
   - Download the `npm-package` artifact
   - Extract it to a clean directory

3. **Publish from the built package**:
   ```bash
   cd extracted-package-directory
   npm publish
   ```

## Manual Local Building

For testing or manual building:

### Prerequisites
- Rust installed: https://rustup.rs/
- Node.js 18+
- Git

### Build Process

1. **Install Rust targets** (one-time setup):
   ```bash
   rustup target add x86_64-unknown-linux-gnu
   rustup target add x86_64-apple-darwin
   rustup target add aarch64-apple-darwin
   rustup target add x86_64-pc-windows-msvc
   ```

2. **Build for your platform**:
   ```bash
   # Unix/macOS
   npm run build:binaries:local
   
   # Windows
   scripts\build-local-binaries.bat
   ```

3. **Build TypeScript**:
   ```bash
   npm run build
   ```

4. **Test locally**:
   ```bash
   npm link
   scrypto-dev --help
   scrypto-dev generate-types package_address
   ```

5. **Publish**:
   ```bash
   npm publish
   ```

## Cross-Platform Building (Advanced)

To build for all platforms from one machine:

### Using Docker (Linux binaries on any platform)
```bash
# Build Linux binary in Docker
docker run --rm -v $(pwd):/workspace -w /workspace rust:latest bash -c "
  cd schema-gen && cargo build --release --target x86_64-unknown-linux-gnu
  cd ../wallet-compatible-derivation-main/crates/wallet_compatible_derivation_cli
  cargo build --release --target x86_64-unknown-linux-gnu
"
```

### Using Cross (Rust cross-compilation tool)
```bash
# Install cross
cargo install cross

# Build for different targets
cross build --release --target x86_64-unknown-linux-gnu
cross build --release --target x86_64-pc-windows-msvc
```

### Manual Cross-Compilation
```bash
# Add targets
rustup target add x86_64-unknown-linux-gnu
rustup target add x86_64-pc-windows-msvc

# Build schema-gen for all targets
cd schema-gen
cargo build --release --target x86_64-unknown-linux-gnu
cargo build --release --target x86_64-pc-windows-msvc
cargo build --release --target x86_64-apple-darwin
cargo build --release --target aarch64-apple-darwin

# Build wallet-cli for all targets
cd ../wallet-compatible-derivation-main/crates/wallet_compatible_derivation_cli
cargo build --release --target x86_64-unknown-linux-gnu
cargo build --release --target x86_64-pc-windows-msvc
cargo build --release --target x86_64-apple-darwin
cargo build --release --target aarch64-apple-darwin
```

## Directory Structure

After building, your package should have:

```
dist/
├── index.js              # Main CLI entry point
├── commands/             # TypeScript commands
├── utils/               # Utility functions
└── binaries/            # Platform-specific binaries
    ├── x86_64-unknown-linux-gnu/
    │   ├── schema-gen-cli
    │   └── wallet-cli
    ├── x86_64-pc-windows-msvc/
    │   ├── schema-gen-cli.exe
    │   └── wallet-cli.exe
    ├── x86_64-apple-darwin/
    │   ├── schema-gen-cli
    │   └── wallet-cli
    └── aarch64-apple-darwin/
        ├── schema-gen-cli
        └── wallet-cli
```

## Binary Detection

The CLI automatically detects the user's platform and uses the appropriate binary:

- **Platform detection**: Based on `os.platform()` and `os.arch()`
- **Binary selection**: Chooses the correct binary from `dist/binaries/{target}/`
- **Error handling**: Provides helpful messages if binary is missing

## Testing Your Package

### Local Testing
```bash
# Build everything
npm run build:binaries:local
npm run build

# Test locally
npm link
scrypto-dev generate-types package_rdx1...

# Unlink when done
npm unlink -g scrypto-dev
```

### Test npm Package
```bash
# Pack without publishing
npm pack

# Install the packed version
npm install -g ./scrypto-dev-1.0.0.tgz

# Test
scrypto-dev --help
scrypto-dev generate-types package_rdx1...

# Cleanup
npm uninstall -g scrypto-dev
```

## Troubleshooting

### Binary Not Found
```
❌ Schema generation binary not found for your platform.
```
**Solutions:**
- Check that binaries were included in the package
- Verify platform is supported
- Check file permissions (Unix: `chmod +x`)

### Build Failures
```
❌ Failed to build schema-gen
```
**Solutions:**
- Ensure Rust is installed: `rustc --version`
- Add required targets: `rustup target add x86_64-unknown-linux-gnu`
- Check for missing dependencies

### Large Package Size
Binaries increase package size (~50-100MB). Consider:
- Using optional dependencies for platforms
- Downloading binaries on first use
- Splitting into platform-specific packages

## Security Considerations

- **Binary verification**: Ensure binaries are built from trusted sources
- **Code signing**: Consider signing binaries for Windows/macOS
- **Checksum validation**: Verify binary integrity
- **Dependency audit**: Regularly audit Rust dependencies

## Version Management

When updating binaries:
1. Update Rust dependencies in Cargo.toml files
2. Rebuild all platform binaries
3. Test on each platform if possible
4. Update package version
5. Publish with new binaries

## Platform-Specific Notes

### Windows
- Requires `.exe` extension
- May need Visual Studio Build Tools
- Consider code signing for distribution

### macOS
- Apple Silicon vs Intel detection
- May require developer signing
- Gatekeeper may block unsigned binaries

### Linux
- Static linking recommended for compatibility
- Different distributions may need different builds
- Consider using musl target for broader compatibility