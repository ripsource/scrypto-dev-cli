#!/bin/bash

echo "🔨 Building wallet-cli for M3 MacBook Pro..."

# Detect platform
TARGET="aarch64-apple-darwin"
echo "🍎 Target: $TARGET"

# Create binaries directory
mkdir -p dist/binaries/$TARGET

# Build wallet-cli from workspace root
echo "👛 Building wallet-cli..."
cd wallet-compatible-derivation-main
cargo build --release --target $TARGET --bin wallet_compatible_derivation_cli

if [ $? -eq 0 ]; then
    echo "✅ Wallet CLI built successfully"
    
    # Copy binary
    cp target/$TARGET/release/wallet_compatible_derivation_cli ../dist/binaries/$TARGET/wallet-cli
    
    echo "📁 Copied to: dist/binaries/$TARGET/wallet-cli"
    
    # Test it works
    echo "🧪 Testing wallet-cli..."
    ../dist/binaries/$TARGET/wallet-cli --help
    
    if [ $? -eq 0 ]; then
        echo "✅ Wallet CLI is working!"
    else
        echo "⚠️ Wallet CLI built but --help failed"
    fi
else
    echo "❌ Failed to build wallet-cli"
    exit 1
fi

cd ..
echo "🎉 Done! Now test with: npm run start -- test-binaries"