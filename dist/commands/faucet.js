"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faucet = faucet;
const babylon_gateway_api_sdk_1 = require("@radixdlt/babylon-gateway-api-sdk");
const environment_1 = require("../utils/environment");
const transaction_1 = require("../utils/transaction");
async function faucet() {
    console.log("💰 Requesting tokens from faucet...");
    const network = (0, environment_1.getCurrentNetwork)();
    if (!network) {
        console.log('❌ No environment set. Use "scrypto-dev set-env <network>" to set one.');
        return;
    }
    console.log(`🌐 Current network: ${network}`);
    if (network !== "stokenet") {
        console.log("❌ Faucet is only available on the Stokenet network.");
        return;
    }
    const activeAccount = (0, environment_1.getActiveAccount)();
    if (!activeAccount) {
        console.log('❌ No active account set. Use "scrypto-dev set-address <account-id>" to set one. Or generate a new address with "scrypto-dev new-address".');
        return;
    }
    if (!activeAccount.privateKey) {
        console.log("❌ Active account does not have a private key stored.");
        console.log("💡 The account needs a private key to sign the faucet transaction.");
        return;
    }
    console.log(`🎯 Active account: ${activeAccount.address}`);
    try {
        console.log("🔄 Building faucet transaction...");
        const manifest = (0, transaction_1.createFaucetManifest)(activeAccount.address);
        console.log("📡 Submitting transaction to network...");
        const result = await (0, transaction_1.buildAndSubmitTransaction)(manifest);
        console.log(`✅ Transaction submitted successfully!`);
        console.log(`🆔 Transaction ID: ${result.transactionId}`);
        console.log("⏳ Waiting for transaction confirmation...");
        if (result.status.status === babylon_gateway_api_sdk_1.TransactionStatus.CommittedSuccess) {
            console.log("🎉 Faucet request completed successfully!");
            console.log("💰 Tokens have been sent to your account.");
            // Note: Receipt details access may vary based on API version
            console.log("📊 Transaction confirmed on network");
        }
        else if (result.status.status === babylon_gateway_api_sdk_1.TransactionStatus.CommittedFailure) {
            console.log("❌ Faucet request failed!");
            console.log(`   Error: ${result.status.error_message || 'Unknown error'}`);
        }
        else {
            console.log(`⚠️  Transaction status: ${result.status.status}`);
        }
    }
    catch (error) {
        console.error("❌ Failed to request faucet tokens:", error instanceof Error ? error.message : error);
        if (error instanceof Error) {
            if (error.message.includes("timeout")) {
                console.log("💡 The transaction may still be processing. Check your account balance in a few minutes.");
            }
            else if (error.message.includes("insufficient")) {
                console.log("💡 There might be insufficient funds for transaction fees.");
            }
        }
    }
}
//# sourceMappingURL=faucet.js.map