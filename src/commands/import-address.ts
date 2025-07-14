import { importMnemonic, checkRustCliBinary } from '../utils/rust-cli';
import { getCurrentNetwork, storeAccount } from '../utils/environment';

export async function importAddress(input: string) {
  console.log('📥 Importing address...');
  
  // Check if Rust CLI is available
  if (!(await checkRustCliBinary())) {
    console.error('❌ Rust CLI binary not found. Please build the wallet-compatible-derivation-main project first:');
    console.error('   cd wallet-compatible-derivation-main');
    console.error('   cargo build --release');
    return;
  }
  
  const network = getCurrentNetwork();
  if (!network) {
    console.log('❌ No environment set. Use "scrypto-dev set-env <network>" to set one.');
    return;
  }
  
  // Assume input is a mnemonic (24 words)
  const words = input.trim().split(/\s+/);
  if (words.length !== 24) {
    console.log('❌ Invalid input. Please provide a 24-word mnemonic.');
    console.log('💡 Example: "word1 word2 word3 ... word24"');
    return;
  }
  
  try {
    const accounts = await importMnemonic(input, {
      network,
      start: 0,
      count: 1,
      includePrivateKey: false
    });
    
    console.log('✅ Successfully imported address:');
    console.log(`🌐 Network: ${network}`);
    
    if (accounts.length > 0) {
      const account = accounts[0];
      
      // Store the account
      const storedAccount = storeAccount({
        address: account.address,
        publicKey: account.publicKey,
        privateKey: account.privateKey,
        index: account.index,
        network,
        mnemonic: input
      });
      
      console.log(`✅ Address: ${account.address}`);
      console.log(`🔑 Public Key: ${account.publicKey}`);
      console.log(`📍 Account Index: ${account.index}`);
      console.log(`🆔 Account ID: ${storedAccount.id}`);
      console.log('');
      console.log('💾 Account stored and set as active');
    } else {
      console.log('⚠️  No accounts were generated. Check your mnemonic.');
    }
    
  } catch (error) {
    console.error('❌ Failed to import address:', error instanceof Error ? error.message : error);
    console.error('💡 Make sure your input is a valid 24-word BIP-39 mnemonic.');
  }
}