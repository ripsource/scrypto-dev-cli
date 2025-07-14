#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const new_address_1 = require("./commands/new-address");
const import_address_1 = require("./commands/import-address");
const list_address_1 = require("./commands/list-address");
const list_fungibles_1 = require("./commands/list-fungibles");
const list_nfts_1 = require("./commands/list-nfts");
const set_address_1 = require("./commands/set-address");
const deploy_1 = require("./commands/deploy");
const generate_types_1 = require("./commands/generate-types");
const faucet_1 = require("./commands/faucet");
const submit_1 = require("./commands/submit");
const create_manifest_1 = require("./commands/create-manifest");
const test_binaries_1 = require("./commands/test-binaries");
const set_env_1 = require("./commands/set-env");
const show_env_1 = require("./commands/show-env");
const generate_mnemonic_1 = require("./commands/generate-mnemonic");
const import_mnemonic_1 = require("./commands/import-mnemonic");
const program = new commander_1.Command();
program
    .name("scrypto-dev")
    .description("CLI tool for Scrypto development")
    .version("1.0.0");
program
    .command("set-env")
    .description("Set the environment network")
    .argument("<network>", "Network to set (stokenet or mainnet)")
    .action(set_env_1.setEnv);
program
    .command("show-env")
    .description("Show the current environment network")
    .action(show_env_1.showEnv);
program
    .command("generate-mnemonic")
    .description("Generate a new random 24-word mnemonic")
    .option("--accounts", "Also generate and display account details")
    .option("--start <number>", "Start account index", parseInt)
    .option("--count <number>", "Number of accounts to generate", parseInt)
    .option("--passphrase <string>", "Optional BIP-39 passphrase")
    .option("--include-private-key", "Include private keys in output")
    .action(generate_mnemonic_1.generateMnemonicCommand);
program
    .command("import-mnemonic")
    .description("Import accounts from a 24-word mnemonic")
    .argument("<mnemonic>", "24-word mnemonic phrase")
    .option("--start <number>", "Start account index", parseInt)
    .option("--count <number>", "Number of accounts to generate", parseInt)
    .option("--passphrase <string>", "Optional BIP-39 passphrase")
    .option("--include-private-key", "Include private keys in output")
    .action(import_mnemonic_1.importMnemonicCommand);
program
    .command("new-address")
    .description("Generate a new address with mnemonic")
    .action(new_address_1.newAddress);
program
    .command("import-address")
    .description("Import an address from passphrase or private key")
    .argument("<input>", "Passphrase or private key")
    .action(import_address_1.importAddress);
program
    .command("list-address")
    .description("List all addresses")
    .action(list_address_1.listAddress);
program
    .command("list-fungibles")
    .description("List fungible tokens")
    .action(list_fungibles_1.listFungibles);
program
    .command("list-nfts")
    .description("List NFTs")
    .action(list_nfts_1.listNfts);
program
    .command("set-address")
    .description("Set the active account")
    .argument("<account-id>", "Account ID to set as active")
    .action(set_address_1.setAddress);
program
    .command("deploy")
    .description("Deploy a package from current directory")
    .action(deploy_1.deploy);
program
    .command("generate-types")
    .description("Generate types for a package")
    .argument("<package>", "Package address to generate types for")
    .action(generate_types_1.generateTypes);
program
    .command("faucet")
    .description("Request tokens from faucet")
    .action(faucet_1.faucet);
program
    .command("submit")
    .description("Submit a transaction manifest file (.rtm)")
    .argument("<file-path>", "Path to .rtm manifest file")
    .action(submit_1.submit);
program
    .command("create-manifest")
    .description("Create a transaction manifest template")
    .argument("[template]", "Template type: basic, faucet", "basic")
    .action(create_manifest_1.createManifest);
program
    .command("test-binaries")
    .description("Test precompiled binary availability and functionality")
    .action(test_binaries_1.testBinaries);
program.parse();
//# sourceMappingURL=index.js.map