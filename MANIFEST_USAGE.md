# Transaction Manifest Usage Guide

## Overview
The `scrypto-dev submit` command allows you to execute transaction manifest files (.rtm) on the Radix network. These are human-readable transaction instructions that can be used for various operations.

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

## Commands

### Submit a Manifest
```bash
scrypto-dev submit <file-path>.rtm
```

Example:
```bash
scrypto-dev submit my-transaction.rtm
scrypto-dev submit ./manifests/faucet.rtm
```

### Create Manifest Templates
```bash
scrypto-dev create-manifest [template-type]
```

Available templates:
- `basic` (default): Basic transaction template
- `faucet`: Stokenet faucet request template

Examples:
```bash
# Create basic template
scrypto-dev create-manifest
scrypto-dev create-manifest basic

# Create faucet template
scrypto-dev create-manifest faucet
```

## Manifest File Format

### Basic Structure
```rtm
CALL_METHOD
    Address("account_address")
    "lock_fee"
    Decimal("500")
;

# Your transaction instructions here

CALL_METHOD
    Address("account_address")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
```

### Placeholder Substitution
The submit command automatically replaces account placeholders with your active account:
- `{ACCOUNT}` → Your active account address
- `$ACCOUNT` → Your active account address
- `{{account}}` → Your active account address (case insensitive)

### Example Manifests

#### Faucet Request (Stokenet)
```rtm
CALL_METHOD
    Address("component_tdx_2_1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxyulkzl")
    "lock_fee"
    Decimal("5000")
;
CALL_METHOD
    Address("component_tdx_2_1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxyulkzl")
    "free"
;
CALL_METHOD
    Address("{ACCOUNT}")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
```

#### Component Method Call
```rtm
CALL_METHOD
    Address("{ACCOUNT}")
    "lock_fee"
    Decimal("500")
;
CALL_METHOD
    Address("component_tdx_2_1cxxx...")
    "my_method"
    "argument1"
    Decimal("100.5")
    Enum<1u8>("SomeValue")
;
CALL_METHOD
    Address("{ACCOUNT}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
```

#### Resource Transfer
```rtm
CALL_METHOD
    Address("{ACCOUNT}")
    "lock_fee"
    Decimal("500")
;
CALL_METHOD
    Address("{ACCOUNT}")
    "withdraw"
    Address("resource_tdx_2_1xxx...")
    Decimal("50")
;
CALL_METHOD
    Address("account_tdx_2_1yyy...")
    "try_deposit_or_abort"
    Bucket("bucket1")
    Enum<0u8>()
;
```

## Common Instructions

### Fee Management
```rtm
CALL_METHOD
    Address("{ACCOUNT}")
    "lock_fee"
    Decimal("500")  # Amount in XRD
;
```

### Resource Operations
```rtm
# Withdraw from account
CALL_METHOD
    Address("{ACCOUNT}")
    "withdraw"
    Address("resource_address")
    Decimal("amount")
;

# Deposit to account
CALL_METHOD
    Address("target_account")
    "try_deposit_or_abort"
    Bucket("bucket1")
    Enum<0u8>()
;

# Deposit all worktop assets
CALL_METHOD
    Address("{ACCOUNT}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
```

### Component Interactions
```rtm
# Call component method
CALL_METHOD
    Address("component_address")
    "method_name"
    "string_argument"
    Decimal("numeric_argument")
    Enum<0u8>()  # Enum argument
;

# Call function on package
CALL_FUNCTION
    Address("package_address")
    "Blueprint"
    "function_name"
    arguments...
;
```

## Workflow Examples

### 1. Request Faucet Tokens
```bash
# Create faucet manifest
scrypto-dev create-manifest faucet

# Submit it
scrypto-dev submit faucet.rtm
```

### 2. Custom Transaction
```bash
# Create basic template
scrypto-dev create-manifest basic

# Edit basic.rtm with your transaction logic
# Then submit
scrypto-dev submit basic.rtm
```

### 3. Existing Manifest
```bash
# Submit any existing .rtm file
scrypto-dev submit path/to/your/transaction.rtm
```

## Error Handling

### Common Errors and Solutions

**File not found:**
```
❌ File not found: /path/to/file.rtm
```
- Check the file path is correct
- Ensure the file exists and has .rtm extension

**Compilation errors:**
```
❌ LexerError or CompilationError
```
- Check manifest syntax
- Ensure semicolons after each instruction
- Verify address formats are correct
- Check instruction names and parameters

**Insufficient funds:**
```
❌ Transaction failed: Insufficient funds
```
- Ensure account has enough XRD for fees
- Request faucet tokens on Stokenet if needed

**Invalid addresses:**
```
❌ Invalid address format
```
- Check all addresses are properly formatted
- Ensure addresses match the current network

## Tips

1. **Start Simple**: Use templates and modify them gradually
2. **Test on Stokenet**: Always test on Stokenet before Mainnet
3. **Check Balances**: Ensure sufficient funds before submitting
4. **Preview First**: The command shows the manifest before submitting
5. **Use Placeholders**: Use `{ACCOUNT}` for account portability
6. **Comments**: Use `#` for comments in manifest files
7. **Validation**: The CLI validates basic syntax before submission

## Security Notes

- Always review manifests before submitting
- Be especially careful with Mainnet transactions
- Double-check all addresses and amounts
- Test with small amounts first
- Keep private keys secure - never include them in manifests