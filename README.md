# Scrypto Dev CLI

A powerful CLI tool for Scrypto development on Radix DLT. Deploy packages, generate types, manage accounts, and streamline your Radix development workflow.

## Features

- 🚀 **Package Deployment**: Deploy `.wasm` and `.rpd` files to Radix networks
- 📝 **Transaction Manifests**: Submit `.rtm` manifest files for custom transactions
- 🔑 **Account Management**: Create, import, and manage Radix accounts
- 🌐 **Network Support**: Works with both Stokenet (testnet) and Mainnet
- 💰 **Faucet Integration**: Request test tokens on Stokenet
- 📊 **Asset Management**: List fungible tokens and NFTs
- 🔧 **Type Generation**: Generate TypeScript types for deployed packages
- 🔐 **Mnemonic Support**: Generate and import from 24-word mnemonics

## Installation

```bash
npm install -g scrypto-dev
```

## Quick Start

1. **Set up your environment**:
   ```bash
   scrypto-dev set-env stokenet
   ```

2. **Create or import an account**:
   ```bash
   # Generate a new account
   scrypto-dev new-address
   
   # Or import from mnemonic
   scrypto-dev import-mnemonic "your 24-word mnemonic phrase here"
   ```

3. **Set active account**:
   ```bash
   scrypto-dev list-address
   scrypto-dev set-address <account-id>
   ```

4. **Get test tokens** (Stokenet only):
   ```bash
   scrypto-dev faucet
   ```

5. **Deploy a package**:
   ```bash
   # Navigate to your Scrypto project directory
   cd your-scrypto-project
   
   # Deploy
   scrypto-dev deploy
   ```

## Commands

### Environment Management
- `scrypto-dev set-env <network>` - Set environment (stokenet/mainnet)
- `scrypto-dev show-env` - Show current environment

### Account Management
- `scrypto-dev new-address` - Generate new account
- `scrypto-dev import-address <input>` - Import from passphrase/private key
- `scrypto-dev import-mnemonic <mnemonic>` - Import from 24-word mnemonic
- `scrypto-dev generate-mnemonic` - Generate new 24-word mnemonic
- `scrypto-dev list-address` - List all accounts
- `scrypto-dev set-address <account-id>` - Set active account

### Asset Management
- `scrypto-dev list-fungibles` - List fungible tokens
- `scrypto-dev list-nfts` - List NFTs
- `scrypto-dev faucet` - Request test tokens (Stokenet only)

### Development Tools
- `scrypto-dev deploy` - Deploy package from current directory
- `scrypto-dev generate-types <package-address>` - Generate TypeScript types
- `scrypto-dev submit <file-path.rtm>` - Submit transaction manifest file
- `scrypto-dev create-manifest [template]` - Create manifest template (basic/faucet)

## Package Deployment

The deploy command automatically:
1. Finds your `.wasm` and `.rpd` files in `target/wasm32-unknown-unknown/release/`
2. Decodes the RPD content properly
3. Creates a deployment manifest with fee locking
4. Submits the transaction to the configured network
5. Provides transaction status and package address

### Prerequisites for Deployment
- Built Scrypto project with artifacts in the expected directory
- Active account with sufficient XRD for fees
- Network environment configured

### Example Directory Structure
```
your-scrypto-project/
├── Cargo.toml
├── src/
│   └── lib.rs
└── target/
    └── wasm32-unknown-unknown/
        └── release/
            ├── your_package.wasm
            └── your_package.rpd
```

## Network Support

- **Stokenet**: Test network for development and testing
- **Mainnet**: Production network

Always test thoroughly on Stokenet before deploying to Mainnet!

## Requirements

- Node.js 18+ 
- npm or yarn
- Rust and Scrypto toolchain (for building packages)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- Report issues: [GitHub Issues](https://github.com/yourusername/scrypto-dev-cli/issues)
- Documentation: 
  - [Deployment Guide](DEPLOY_USAGE.md)
  - [Manifest Usage Guide](MANIFEST_USAGE.md)

## Changelog

### v1.0.0
- Initial release
- Package deployment functionality
- Transaction manifest submission
- Manifest template generation
- Account management
- Network configuration
- Type generation
- Mnemonic support
- Faucet integration