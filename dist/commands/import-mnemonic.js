"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importMnemonicCommand = importMnemonicCommand;
const rust_cli_1 = require("../utils/rust-cli");
const environment_1 = require("../utils/environment");
async function importMnemonicCommand(mnemonic, options) {
    console.log('📥 Importing mnemonic and generating accounts...');
    // Check if Rust CLI is available
    if (!(await (0, rust_cli_1.checkRustCliBinary)())) {
        console.error('❌ Rust CLI binary not found. Please build the wallet-compatible-derivation-main project first:');
        console.error('   cd wallet-compatible-derivation-main');
        console.error('   cargo build --release');
        return;
    }
    const network = (0, environment_1.getCurrentNetwork)();
    if (!network) {
        console.log('❌ No environment set. Use "scrypto-dev set-env <network>" to set one.');
        return;
    }
    try {
        const accounts = await (0, rust_cli_1.importMnemonic)(mnemonic, {
            network,
            start: options.start || 0,
            count: options.count || 2,
            passphrase: options.passphrase,
            includePrivateKey: options.includePrivateKey
        });
        console.log('✅ Successfully imported mnemonic and generated accounts:');
        console.log(`🌐 Network: ${network}`);
        if (accounts.length > 0) {
            accounts.forEach((account, index) => {
                // Store each account
                const storedAccount = (0, environment_1.storeAccount)({
                    address: account.address,
                    publicKey: account.publicKey,
                    privateKey: account.privateKey,
                    index: account.index,
                    network,
                    mnemonic
                });
                console.log(`\n--- Account ${index + 1} (Index: ${account.index}) ---`);
                console.log(`🆔 Account ID: ${storedAccount.id}`);
                console.log(`📍 Address: ${account.address}`);
                console.log(`🔑 Public Key: ${account.publicKey}`);
                if (account.privateKey) {
                    console.log(`🔐 Private Key: ${account.privateKey}`);
                }
            });
            console.log('');
            console.log('💾 All accounts stored successfully');
        }
        else {
            console.log('⚠️  No accounts were generated. Check your mnemonic and options.');
        }
    }
    catch (error) {
        console.error('❌ Failed to import mnemonic:', error instanceof Error ? error.message : error);
        console.error('💡 Make sure your mnemonic is a valid 24-word BIP-39 mnemonic.');
    }
}
//# sourceMappingURL=import-mnemonic.js.map