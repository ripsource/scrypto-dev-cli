#!/bin/bash

# Build local binaries for testing
echo "🔨 Building local binaries..."

# Detect platform
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    TARGET="x86_64-unknown-linux-gnu"
    BINARY_EXT=""
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # Check if we're on Apple Silicon (M1, M2, M3, etc.)
    if [[ $(uname -m) == "arm64" ]]; then
        TARGET="aarch64-apple-darwin"
        echo "🍎 Detected Apple Silicon (M1/M2/M3)"
    else
        TARGET="x86_64-apple-darwin"
        echo "🍎 Detected Intel Mac"
    fi
    BINARY_EXT=""
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    TARGET="x86_64-pc-windows-msvc"
    BINARY_EXT=".exe"
else
    echo "❌ Unsupported platform: $OSTYPE"
    exit 1
fi

echo "🎯 Target platform: $TARGET"

# Create binaries directory
mkdir -p dist/binaries/$TARGET

# Build schema-gen
echo "📦 Building schema-gen..."
cd schema-gen
cargo build --release --target $TARGET
if [ $? -ne 0 ]; then
    echo "❌ Failed to build schema-gen"
    exit 1
fi
cd ..

# Copy schema-gen binary
cp schema-gen/target/$TARGET/release/schema-gen-cli$BINARY_EXT dist/binaries/$TARGET/

# Build wallet-cli (from workspace root)
echo "👛 Building wallet-cli..."
cd wallet-compatible-derivation-main
cargo build --release --target $TARGET --bin wallet_compatible_derivation_cli
if [ $? -ne 0 ]; then
    echo "❌ Failed to build wallet-cli"
    exit 1
fi
cd ..

# Copy wallet-cli binary (rename from wallet_compatible_derivation_cli)
cp wallet-compatible-derivation-main/target/$TARGET/release/wallet_compatible_derivation_cli$BINARY_EXT dist/binaries/$TARGET/wallet-cli$BINARY_EXT

echo "✅ Binaries built successfully!"
echo "📁 Location: dist/binaries/$TARGET/"
echo "📄 Files:"
ls -la dist/binaries/$TARGET/

echo ""
echo "🧪 Test the binaries:"
echo "  ./dist/binaries/$TARGET/schema-gen-cli$BINARY_EXT --help"
echo "  ./dist/binaries/$TARGET/wallet-cli$BINARY_EXT --help"