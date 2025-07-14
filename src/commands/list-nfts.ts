import { NftBalance } from "@rippy/gateway-ez-mode/dist/types";
import { mainnetGateway, stokenetGateway } from "../utils/gateway-helper";
import { getActiveAccount, getCurrentNetwork } from "../utils/environment";

export async function listNfts() {
  console.log("Listing NFTs...");

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

  let nfts: NftBalance[];

  if (currentNetwork === "mainnet") {
    nfts = await mainnetGateway.state.getComponentNonFungibleBalances(
      activeAccount.address
    );
  } else if (currentNetwork === "stokenet") {
    nfts = await stokenetGateway.state.getComponentNonFungibleBalances(
      activeAccount.address
    );
  } else {
    return console.error(`Error listing NFTs`);
  }

  // pretty print the result in terminal with formatting/colors
  if (nfts && nfts.length > 0) {
    console.log(`NFTs for account ${activeAccount.address}:`);
    console.table(
      nfts.map((nft) => ({
        resourceAddress: nft.resourceInfo.resourceAddress,
        nftId: nft.nftBalance,
        name: nft.resourceInfo.metadata.name || "N/A",
        description: nft.resourceInfo.metadata.description || "N/A",
      }))
    );
  } else {
    console.log("No NFTs found for this account.");
  }
}
