"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMnemonic = generateMnemonic;
exports.importMnemonic = importMnemonic;
exports.checkRustCliBinary = checkRustCliBinary;
const child_process_1 = require("child_process");
const environment_1 = require("./environment");
const RUST_CLI_PATH = './wallet-compatible-derivation-main/target/release/wallet_compatible_derivation_cli';
async function generateMnemonic(options = {}) {
    const network = options.network || (0, environment_1.getCurrentNetwork)() || 'mainnet';
    const args = [];
    // Add global flags first
    if (options.includePrivateKey)
        args.push('--include-private-key');
    // Add subcommand
    args.push('generate');
    // Always add --accounts flag to generate account details
    args.push('--accounts');
    if (options.start !== undefined)
        args.push('--start', options.start.toString());
    if (options.count !== undefined)
        args.push('--count', options.count.toString());
    if (options.passphrase)
        args.push('--passphrase', options.passphrase);
    args.push('--network', network);
    return executeRustCli(args);
}
async function importMnemonic(mnemonic, options = {}) {
    const network = options.network || (0, environment_1.getCurrentNetwork)() || 'mainnet';
    const args = [];
    // Add global flags first
    if (options.includePrivateKey)
        args.push('--include-private-key');
    // Add subcommand
    args.push('no-pager');
    args.push('--mnemonic', mnemonic);
    args.push('--network', network);
    if (options.start !== undefined)
        args.push('--start', options.start.toString());
    if (options.count !== undefined)
        args.push('--count', options.count.toString());
    if (options.passphrase)
        args.push('--passphrase', options.passphrase);
    const result = await executeRustCli(args);
    return result.accounts || [];
}
async function executeRustCli(args) {
    return new Promise((resolve, reject) => {
        console.log(`Executing: ${RUST_CLI_PATH} ${args.join(' ')}`);
        const child = (0, child_process_1.spawn)(RUST_CLI_PATH, args);
        let stdout = '';
        let stderr = '';
        child.stdout?.on('data', (data) => {
            stdout += data.toString();
        });
        child.stderr?.on('data', (data) => {
            stderr += data.toString();
        });
        child.on('error', (error) => {
            reject(new Error(`Failed to execute Rust CLI: ${error.message}`));
        });
        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Rust CLI exited with code ${code}: ${stderr}`));
                return;
            }
            try {
                const result = parseRustCliOutput(stdout);
                resolve(result);
            }
            catch (error) {
                reject(new Error(`Failed to parse output: ${error}`));
            }
        });
    });
}
function parseRustCliOutput(output) {
    const lines = output.split('\n');
    const result = { mnemonic: '', accounts: [] };
    // Extract mnemonic from output
    for (const line of lines) {
        if (line.includes('Mnemonic:')) {
            result.mnemonic = line.replace('Mnemonic:', '').trim();
            break;
        }
    }
    // Extract accounts from output
    let currentAccount = {};
    let inAccountSection = false;
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.includes('✅ CREATED ACCOUNT ✅')) {
            inAccountSection = true;
            currentAccount = {};
            continue;
        }
        if (inAccountSection) {
            if (trimmedLine.startsWith('Index:')) {
                currentAccount.index = parseInt(trimmedLine.split(':')[1].trim());
            }
            else if (trimmedLine.startsWith('Address:')) {
                currentAccount.address = trimmedLine.split(':')[1].trim();
            }
            else if (trimmedLine.startsWith('PublicKey:')) {
                currentAccount.publicKey = trimmedLine.split(':')[1].trim();
            }
            else if (trimmedLine.startsWith('PrivateKey:')) {
                currentAccount.privateKey = trimmedLine.split(':')[1].trim();
            }
            // Check for end of account section (when we hit the delimiter)
            if (trimmedLine.includes('✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨') &&
                currentAccount.index !== undefined &&
                currentAccount.address &&
                currentAccount.publicKey) {
                result.accounts = result.accounts || [];
                result.accounts.push(currentAccount);
                inAccountSection = false;
                currentAccount = {};
            }
        }
    }
    return result;
}
async function checkRustCliBinary() {
    return new Promise((resolve) => {
        const child = (0, child_process_1.spawn)(RUST_CLI_PATH, ['--version']);
        child.on('error', () => {
            resolve(false);
        });
        child.on('close', (code) => {
            resolve(code === 0);
        });
    });
}
//# sourceMappingURL=rust-cli.js.map