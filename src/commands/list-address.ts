import {
  getStoredAccounts,
  getActiveAccount,
  getCurrentNetwork,
} from "../utils/environment";

export function listAddress() {
  console.log("📋 Listing stored addresses...");

  const network = getCurrentNetwork();
  const accounts = getStoredAccounts();
  const activeAccount = getActiveAccount();

  if (!network) {
    console.log(
      '❌ No environment set. Use "scrypto-dev set-env <network>" to set one.'
    );
    return;
  }

  console.log(`🌐 Current network: ${network}`);
  console.log("");

  if (accounts.length === 0) {
    console.log("📭 No accounts stored yet.");
    console.log('💡 Use "scrypto-dev new-address" to generate a new account.');
    console.log(
      '💡 Use "scrypto-dev import-address <mnemonic>" to import an existing account.'
    );
    return;
  }

  // Filter accounts by current network
  const networkAccounts = accounts.filter((acc) => acc.network === network);

  if (networkAccounts.length === 0) {
    console.log(`📭 No accounts stored for ${network} network.`);
    console.log('💡 Use "scrypto-dev new-address" to generate a new account.');
    console.log(
      '💡 Use "scrypto-dev import-address <mnemonic>" to import an existing account.'
    );
    return;
  }

  console.log(`📄 Found ${networkAccounts.length} account(s) for ${network}:`);
  console.log("");

  networkAccounts.forEach((account, index) => {
    const isActive = activeAccount?.id === account.id;
    const activeIndicator = isActive ? "✅ ACTIVE" : "⚪";
    const createdDate = new Date(account.createdAt).toLocaleDateString();

    console.log(`${activeIndicator} Account ${index + 1}:`);
    console.log(`   🆔 ID: ${account.id}`);
    console.log(`   📍 Address: ${account.address}`);
    console.log(`   🔑 Public Key: ${account.publicKey}`);
    console.log(`   🔢 Index: ${account.index}`);
    console.log(`   📅 Created: ${createdDate}`);

    if (account.privateKey) {
      console.log(`   🔐 Private Key: ${account.privateKey}`);
    }

    if (account.mnemonic) {
      console.log(`   🔤 Mnemonic: ${account.mnemonic}`);
    }

    console.log("");
  });

  if (activeAccount && activeAccount.network === network) {
    console.log(`🎯 Active account: ${activeAccount.address}`);
  } else {
    console.log("⚠️  No active account set for this network.");
    console.log(
      '💡 Use "scrypto-dev set-address <account-id>" to set an active account.'
    );
  }
}
