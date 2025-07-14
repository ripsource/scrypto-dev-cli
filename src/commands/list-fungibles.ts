import { mainnetGateway, stokenetGateway } from "../utils/gateway-helper";
import { getActiveAccount, getCurrentNetwork } from "../utils/environment";
import { FungibleResourceBalance } from "@rippy/gateway-ez-mode/dist/types";

export async function listFungibles() {
  console.log("Listing fungible tokens...");

  const currentNetwork = getCurrentNetwork();
  const activeAccount = getActiveAccount();
  if (!currentNetwork) {
    console.error(
      'No environment set. Use "scrypto-dev set-env <network>" to set one.'
    );
    return;
  }

  if (!activeAccount) {
    console.error(
      'No active account set. Use "scrypto-dev set-address <account-address>" to set one.'
    );
    return;
  }

  let balances: FungibleResourceBalance[];

  if (currentNetwork === "mainnet") {
    balances = await mainnetGateway.state.getComponentFungibleBalances(
      activeAccount.address
    );
  } else if (currentNetwork === "stokenet") {
    balances = await stokenetGateway.state.getComponentFungibleBalances(
      activeAccount.address
    );
  } else {
    return console.error(`Error listing fungibles`);
  }

  // pretty print the result in terminal with formating/colours

  if (balances && balances.length > 0) {
    console.log(`Fungible tokens for account ${activeAccount.address}:`);
    console.table(
      balances.map((balance) => ({
        resourceAddress: balance.resourceInfo.resourceAddress,
        balance: balance.balance.toString(),
        symbol: balance.resourceInfo.metadata.symbol || "N/A",
        name: balance.resourceInfo.metadata.name || "N/A",
      }))
    );
  } else {
    console.log("No fungible tokens found for this account.");
  }
  console.log("");
  console.log('Use "scrypto-dev faucet" to request tokens if needed.');
}
