import { setActiveAccount, getStoredAccounts, getCurrentNetwork } from '../utils/environment';

export function setAddress(accountId: string) {
  console.log('🎯 Setting active account...');
  
  const network = getCurrentNetwork();
  if (!network) {
    console.log('❌ No environment set. Use "scrypto-dev set-env <network>" to set one.');
    return;
  }
  
  const accounts = getStoredAccounts();
  const account = accounts.find(acc => acc.id === accountId);
  
  if (!account) {
    console.log(`❌ Account with ID "${accountId}" not found.`);
    console.log('💡 Use "scrypto-dev list-address" to see available accounts.');
    return;
  }
  
  if (account.network !== network) {
    console.log(`❌ Account "${accountId}" is for ${account.network} network, but current environment is ${network}.`);
    console.log(`💡 Use "scrypto-dev set-env ${account.network}" to switch to the correct network.`);
    return;
  }
  
  if (setActiveAccount(accountId)) {
    console.log(`✅ Active account set to: ${account.address}`);
    console.log(`🆔 Account ID: ${accountId}`);
    console.log(`🌐 Network: ${account.network}`);
    console.log(`📍 Address: ${account.address}`);
  } else {
    console.log('❌ Failed to set active account.');
  }
}