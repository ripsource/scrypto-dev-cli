import { generateMnemonic, checkRustCliBinary } from "../utils/rust-cli";
import { getCurrentNetwork, storeAccount } from "../utils/environment";

export async function generateMnemonicCommand(options: {
  accounts?: boolean;
  start?: number;
  count?: number;
  passphrase?: string;
  includePrivateKey?: boolean;
}) {
  console.log("🎲 Generating new mnemonic...");

  // Check if Rust CLI is available
  if (!(await checkRustCliBinary())) {
    console.error(
      "❌ Rust CLI binary not found. Please build the wallet-compatible-derivation-main project first:"
    );
    console.error("   cd wallet-compatible-derivation-main");
    console.error("   cargo build --release");
    return;
  }
  //  scrypto-dev generate-mnemonic --accounts --count 3
  const network = getCurrentNetwork();
  if (!network) {
    console.log(
      '❌ No environment set. Use "scrypto-dev set-env <network>" to set one.'
    );
    return;
  }

  try {
    const result = await generateMnemonic({
      network,
      start: options.start,
      count: options.count,
      passphrase: options.passphrase,
      includePrivateKey: options.includePrivateKey,
    });

    console.log("✅ Generated new mnemonic:");
    console.log(`🔐 Mnemonic: ${result.mnemonic}`);
    console.log("");
    console.log("⚠️  SECURITY WARNING: Keep this mnemonic safe and private!");
    console.log("⚠️  Anyone with this mnemonic can access your accounts.");
    console.log("⚠️  Write it down and store it in a secure location.");

    if (options.accounts && result.accounts && result.accounts.length > 0) {
      console.log("");
      console.log("🔑 Generated accounts:");
      result.accounts.forEach((account, index) => {
        // Store each account
        const storedAccount = storeAccount({
          address: account.address,
          publicKey: account.publicKey,
          privateKey: account.privateKey,
          index: account.index,
          network,
          mnemonic: result.mnemonic,
        });

        console.log(`\n--- Account ${index + 1} (Index: ${account.index}) ---`);
        console.log(`🆔 Account ID: ${storedAccount.id}`);
        console.log(`📍 Address: ${account.address}`);
        console.log(`🔑 Public Key: ${account.publicKey}`);
        if (account.privateKey) {
          console.log(`🔐 Private Key: ${account.privateKey}`);
        }
      });

      console.log("");
      console.log("💾 All accounts stored successfully");
    }
  } catch (error) {
    console.error(
      "❌ Failed to generate mnemonic:",
      error instanceof Error ? error.message : error
    );
  }
}
