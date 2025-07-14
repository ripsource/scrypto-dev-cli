"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNfts = listNfts;
const gateway_helper_1 = require("../utils/gateway-helper");
const environment_1 = require("../utils/environment");
async function listNfts() {
    console.log("Listing NFTs...");
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
    let nfts;
    if (currentNetwork === "mainnet") {
        nfts = await gateway_helper_1.mainnetGateway.state.getComponentNonFungibleBalances(activeAccount.address);
    }
    else if (currentNetwork === "stokenet") {
        nfts = await gateway_helper_1.stokenetGateway.state.getComponentNonFungibleBalances(activeAccount.address);
    }
    else {
        return console.error(`Error listing NFTs`);
    }
    // pretty print the result in terminal with formatting/colors
    if (nfts && nfts.length > 0) {
        console.log(`NFTs for account ${activeAccount.address}:`);
        console.table(nfts.map((nft) => ({
            resourceAddress: nft.resourceInfo.resourceAddress,
            nftId: nft.nftBalance,
            name: nft.resourceInfo.metadata.name || "N/A",
            description: nft.resourceInfo.metadata.description || "N/A",
        })));
    }
    else {
        console.log("No NFTs found for this account.");
    }
}
//# sourceMappingURL=list-nfts.js.map