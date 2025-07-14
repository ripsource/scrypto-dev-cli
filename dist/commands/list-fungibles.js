"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFungibles = listFungibles;
const gateway_helper_1 = require("../utils/gateway-helper");
const environment_1 = require("../utils/environment");
async function listFungibles() {
    console.log("Listing fungible tokens...");
    const currentNetwork = (0, environment_1.getCurrentNetwork)();
    const activeAccount = (0, environment_1.getActiveAccount)();
    if (!currentNetwork) {
        console.error('No environment set. Use "scrypto-dev set-env <network>" to set one.');
        return;
    }
    if (!activeAccount) {
        console.error('No active account set. Use "scrypto-dev set-address <account-address>" to set one.');
        return;
    }
    let balances;
    if (currentNetwork === "mainnet") {
        balances = await gateway_helper_1.mainnetGateway.state.getComponentFungibleBalances(activeAccount.address);
    }
    else if (currentNetwork === "stokenet") {
        balances = await gateway_helper_1.stokenetGateway.state.getComponentFungibleBalances(activeAccount.address);
    }
    else {
        return console.error(`Error listing fungibles`);
    }
    // pretty print the result in terminal with formating/colours
    if (balances && balances.length > 0) {
        console.log(`Fungible tokens for account ${activeAccount.address}:`);
        console.table(balances.map((balance) => ({
            resourceAddress: balance.resourceInfo.resourceAddress,
            balance: balance.balance.toString(),
            symbol: balance.resourceInfo.metadata.symbol || "N/A",
            name: balance.resourceInfo.metadata.name || "N/A",
        })));
    }
    else {
        console.log("No fungible tokens found for this account.");
    }
    console.log("");
    console.log('Use "scrypto-dev faucet" to request tokens if needed.');
}
//# sourceMappingURL=list-fungibles.js.map