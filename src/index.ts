#!/usr/bin/env node

import { Command } from "commander";
import { newAddress } from "./commands/new-address";
import { importAddress } from "./commands/import-address";
import { listAddress } from "./commands/list-address";
import { listFungibles } from "./commands/list-fungibles";
import { listNfts } from "./commands/list-nfts";
import { setAddress } from "./commands/set-address";
import { deploy } from "./commands/deploy";
import { generateTypes } from "./commands/generate-types";
import { faucet } from "./commands/faucet";
import { submit } from "./commands/submit";
import { createManifest } from "./commands/create-manifest";
import { setEnv } from "./commands/set-env";
import { showEnv } from "./commands/show-env";
import { generateMnemonicCommand } from "./commands/generate-mnemonic";
import { importMnemonicCommand } from "./commands/import-mnemonic";

const program = new Command();

program
  .name("scrypto-dev")
  .description("CLI tool for Scrypto development")
  .version("1.0.0");

program
  .command("set-env")
  .description("Set the environment network")
  .argument("<network>", "Network to set (stokenet or mainnet)")
  .action(setEnv);

program
  .command("show-env")
  .description("Show the current environment network")
  .action(showEnv);

program
  .command("generate-mnemonic")
  .description("Generate a new random 24-word mnemonic")
  .option("--accounts", "Also generate and display account details")
  .option("--start <number>", "Start account index", parseInt)
  .option("--count <number>", "Number of accounts to generate", parseInt)
  .option("--passphrase <string>", "Optional BIP-39 passphrase")
  .option("--include-private-key", "Include private keys in output")
  .action(generateMnemonicCommand);

program
  .command("import-mnemonic")
  .description("Import accounts from a 24-word mnemonic")
  .argument("<mnemonic>", "24-word mnemonic phrase")
  .option("--start <number>", "Start account index", parseInt)
  .option("--count <number>", "Number of accounts to generate", parseInt)
  .option("--passphrase <string>", "Optional BIP-39 passphrase")
  .option("--include-private-key", "Include private keys in output")
  .action(importMnemonicCommand);

program
  .command("new-address")
  .description("Generate a new address with mnemonic")
  .action(newAddress);

program
  .command("import-address")
  .description("Import an address from passphrase or private key")
  .argument("<input>", "Passphrase or private key")
  .action(importAddress);

program
  .command("list-address")
  .description("List all addresses")
  .action(listAddress);

program
  .command("list-fungibles")
  .description("List fungible tokens")
  .action(listFungibles);

program
  .command("list-nfts")
  .description("List NFTs")
  .action(listNfts);

program
  .command("set-address")
  .description("Set the active account")
  .argument("<account-id>", "Account ID to set as active")
  .action(setAddress);

program
  .command("deploy")
  .description("Deploy a package from current directory")
  .action(deploy);

program
  .command("generate-types")
  .description("Generate types for a package")
  .argument("<package>", "Package address to generate types for")
  .action(generateTypes);

program
  .command("faucet")
  .description("Request tokens from faucet")
  .action(faucet);

program
  .command("submit")
  .description("Submit a transaction manifest file (.rtm)")
  .argument("<file-path>", "Path to .rtm manifest file")
  .action(submit);

program
  .command("create-manifest")
  .description("Create a transaction manifest template")
  .argument("[template]", "Template type: basic, faucet", "basic")
  .action(createManifest);

program.parse();
