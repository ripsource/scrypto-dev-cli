import { generateMnemonic, checkRustCliBinary } from "../utils/rust-cli";
import { getCurrentNetwork, storeAccount } from "../utils/environment";

export async function newAddress() {
  console.log("🎲 Generating new address...");

  // Check if Rust CLI is available
  if (!(await checkRustCliBinary())) {
    console.error(
      "❌ Rust CLI binary not found. Please build the wallet-compatible-derivation-main project first:"
    );
    console.error("   cd wallet-compatible-derivation-main");
    console.error("   cargo build --release");
    return;
  }

  const network = getCurrentNetwork();

  if (!network) {
    console.log(
      '❌ No environment set. Use "scrypto-dev set-env <network>" to set one (stokenet/mainnet).'
    );
    return;
  }

  console.log(`🌐 Network: ${network}`);

  try {
    const result = await generateMnemonic({
      network,
      start: 0,
      count: 1,
      includePrivateKey: true,
    });

    console.log("✅ Generated new address:");

    if (result.accounts && result.accounts.length > 0) {
      const account = result.accounts[0];

      // Store the account
      const storedAccount = storeAccount({
        address: account.address,
        publicKey: account.publicKey,
        privateKey: account.privateKey,
        index: account.index,
        network,
        mnemonic: result.mnemonic,
      });

      console.log(`✅ Address: ${account.address}`);
      console.log(`🔑 Public Key: ${account.publicKey}`);
      console.log(`📍 Account Index: ${account.index}`);
      console.log(`🆔 Account ID: ${storedAccount.id}`);
      console.log("");
      console.log("🔐 Mnemonic (save this safely):");
      console.log(`${result.mnemonic}`);
      console.log("");
      console.log("⚠️  SECURITY WARNING: Keep this mnemonic safe and private!");
      console.log("⚠️  Anyone with this mnemonic can access your accounts.");
      console.log("");
      console.log("💾 Account stored and set as active");
    } else {
      console.log("⚠️  No accounts were generated issue.");
    }
  } catch (error) {
    console.error(
      "❌ Failed to generate address:",
      error instanceof Error ? error.message : error
    );
  }
}
