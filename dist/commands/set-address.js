"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAddress = setAddress;
const environment_1 = require("../utils/environment");
function setAddress(accountId) {
    console.log('🎯 Setting active account...');
    const network = (0, environment_1.getCurrentNetwork)();
    if (!network) {
        console.log('❌ No environment set. Use "scrypto-dev set-env <network>" to set one.');
        return;
    }
    const accounts = (0, environment_1.getStoredAccounts)();
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
    if ((0, environment_1.setActiveAccount)(accountId)) {
        console.log(`✅ Active account set to: ${account.address}`);
        console.log(`🆔 Account ID: ${accountId}`);
        console.log(`🌐 Network: ${account.network}`);
        console.log(`📍 Address: ${account.address}`);
    }
    else {
        console.log('❌ Failed to set active account.');
    }
}
//# sourceMappingURL=set-address.js.map