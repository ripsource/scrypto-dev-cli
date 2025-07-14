# Package Deployment Guide

## Overview
The `scrypto-dev deploy` command allows you to deploy Scrypto packages (.wasm and .rpd files) to the Radix network.

## Prerequisites
1. Set up your environment network:
   ```bash
   scrypto-dev set-env stokenet  # or mainnet
   ```

2. Have an active account with sufficient funds:
   ```bash
   scrypto-dev list-address
   scrypto-dev set-address <account-id>
   ```

3. Be in a directory containing a Scrypto project with built artifacts

## Usage

### Basic Deployment
1. Navigate to your Scrypto project directory
2. Make sure you have built your project:
   ```bash
   scrypto build
   ```

3. Run the deploy command:
   ```bash
   scrypto-dev deploy
   ```

### Expected Directory Structure
The deploy command expects to find your built artifacts in:
```
your-project/
├── target/
│   └── wasm32-unknown-unknown/
│       └── release/
│           ├── your_package.wasm
│           └── your_package.rpd
```

### Interactive Configuration
The deploy command will prompt you for:

1. **Owner Role**: Choose between:
   - `badge`: Requires a badge for package ownership
   - `none`: No ownership restrictions

2. **Owner Role Updatable** (if badge selected):
   - `Fixed`: Owner role cannot be changed
   - `Updatable`: Owner role can be updated

3. **Badge Type** (if badge selected):
   - `fungible`: Use a fungible token as the badge
   - `nonfungible`: Use a non-fungible token as the badge

4. **Resource Address** (if badge selected):
   - The address of the fungible or non-fungible resource

5. **NFT ID** (if non-fungible badge selected):
   - The specific NFT ID (e.g., `#0#`, `<admin_badge>`)

### Example Flow
```bash
$ scrypto-dev deploy
🚀 Deploying package...
📡 Network: stokenet
👤 Account: account_tdx_2_1abc123...
📦 Found WASM: my_package.wasm
📄 Found RPD: my_package.rpd

🔄 Submitting deployment transaction...
📄 Manifest preview:
CALL_METHOD
    Address("account_tdx_2_1abc123...")
    "lock_fee"
    Decimal("500")
;
PUBLISH_PACKAGE
    [decoded RPD content]
    Blob("wasm_hash")
    Map<String, Tuple>()
;
CALL_METHOD
    Address("account_tdx_2_1abc123...")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;

✅ Transaction submitted successfully!
🆔 Transaction ID: txid_tdx_2_1abc123...
🎉 Transaction completed successfully!

📦 Package deployed successfully!
```

## Error Handling
The command will provide helpful error messages for common issues:
- Missing target directory
- Missing .wasm or .rpd files  
- Network not set
- No active account
- Transaction failures

## Network Support
- **Stokenet**: Test network for development
- **Mainnet**: Production network

Make sure to test thoroughly on stokenet before deploying to mainnet.