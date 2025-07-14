"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworkConfiguration = getNetworkConfiguration;
exports.getCurrentEpoch = getCurrentEpoch;
exports.submitTransaction = submitTransaction;
exports.getTransactionStatus = getTransactionStatus;
exports.waitForTransactionCompletion = waitForTransactionCompletion;
exports.buildAndSubmitTransaction = buildAndSubmitTransaction;
exports.createFaucetManifest = createFaucetManifest;
exports.createManifestFromString = createManifestFromString;
exports.logTransactionResult = logTransactionResult;
const radix_engine_toolkit_1 = require("@radixdlt/radix-engine-toolkit");
const babylon_gateway_api_sdk_1 = require("@radixdlt/babylon-gateway-api-sdk");
const environment_1 = require("./environment");
function getNetworkConfiguration(network) {
    switch (network) {
        case 'mainnet':
            return {
                gatewayBaseUrl: "https://mainnet.radixdlt.com",
                networkId: radix_engine_toolkit_1.NetworkId.Mainnet,
            };
        case 'stokenet':
            return {
                gatewayBaseUrl: "https://stokenet.radixdlt.com",
                networkId: radix_engine_toolkit_1.NetworkId.Stokenet,
            };
        default:
            throw new Error(`Unsupported network: ${network}`);
    }
}
async function getCurrentEpoch(statusApi) {
    const response = await statusApi.gatewayStatus();
    return response.ledger_state.epoch;
}
async function submitTransaction(transactionApi, compiledTransaction) {
    return transactionApi.transactionSubmit({
        transactionSubmitRequest: {
            notarized_transaction_hex: radix_engine_toolkit_1.Convert.Uint8Array.toHexString(compiledTransaction),
        },
    });
}
async function getTransactionStatus(transactionApi, transactionId) {
    return transactionApi.transactionStatus({
        transactionStatusRequest: {
            intent_hash: transactionId,
        },
    });
}
async function waitForTransactionCompletion(transactionApi, transactionId, maxWaitTimeMs = 30000) {
    let transactionStatus;
    const startTime = Date.now();
    while (transactionStatus === undefined ||
        transactionStatus.status === babylon_gateway_api_sdk_1.TransactionStatus.Pending) {
        if (Date.now() - startTime > maxWaitTimeMs) {
            throw new Error(`Transaction timeout after ${maxWaitTimeMs}ms`);
        }
        transactionStatus = await getTransactionStatus(transactionApi, transactionId);
        if (transactionStatus.status !== babylon_gateway_api_sdk_1.TransactionStatus.Pending) {
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return transactionStatus;
}
async function buildAndSubmitTransaction(manifest, privateKeyHex) {
    const network = (0, environment_1.getCurrentNetwork)();
    if (!network) {
        throw new Error('No network set. Use "scrypto-dev set-env <network>" to set one.');
    }
    const activeAccount = (0, environment_1.getActiveAccount)();
    if (!activeAccount) {
        throw new Error('No active account set. Use "scrypto-dev set-address <account-id>" to set one.');
    }
    // Use provided private key or get from active account
    const privateKeyToUse = privateKeyHex || activeAccount.privateKey;
    if (!privateKeyToUse) {
        throw new Error('No private key available. Account must have a stored private key.');
    }
    const networkConfig = getNetworkConfiguration(network);
    const apiConfiguration = new babylon_gateway_api_sdk_1.Configuration({
        basePath: networkConfig.gatewayBaseUrl,
    });
    const statusApi = new babylon_gateway_api_sdk_1.StatusApi(apiConfiguration);
    const transactionApi = new babylon_gateway_api_sdk_1.TransactionApi(apiConfiguration);
    // Setting up the private keys
    const notaryPrivateKey = new radix_engine_toolkit_1.PrivateKey.Ed25519(privateKeyToUse);
    const signerPrivateKey = new radix_engine_toolkit_1.PrivateKey.Ed25519(privateKeyToUse);
    const currentEpoch = await getCurrentEpoch(statusApi);
    // Create transaction header
    const transactionHeader = {
        networkId: networkConfig.networkId,
        startEpochInclusive: currentEpoch,
        endEpochExclusive: currentEpoch + 10,
        nonce: (0, radix_engine_toolkit_1.generateRandomNonce)(),
        notaryPublicKey: notaryPrivateKey.publicKey(),
        notaryIsSignatory: true,
        tipPercentage: 0,
    };
    // Build the complete transaction
    const notarizedTransaction = await radix_engine_toolkit_1.TransactionBuilder.new()
        .then((builder) => builder
        .header(transactionHeader)
        .manifest(manifest)
        .sign(signerPrivateKey)
        .notarize(notaryPrivateKey));
    // Get transaction ID
    const transactionId = await radix_engine_toolkit_1.RadixEngineToolkit.NotarizedTransaction.intentHash(notarizedTransaction);
    // Compile transaction
    const compiledTransaction = await radix_engine_toolkit_1.RadixEngineToolkit.NotarizedTransaction.compile(notarizedTransaction);
    // Submit transaction
    const submissionResult = await submitTransaction(transactionApi, compiledTransaction);
    // Wait for completion
    const status = await waitForTransactionCompletion(transactionApi, transactionId.id);
    return {
        transactionId: transactionId.id,
        status,
        submissionResult,
    };
}
function createFaucetManifest(accountAddress) {
    const faucetRequest = `
CALL_METHOD
    Address("component_tdx_2_1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxyulkzl")
    "lock_fee"
    Decimal("5000")
;
CALL_METHOD
    Address("component_tdx_2_1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxyulkzl")
    "free"
;
CALL_METHOD
    Address("${accountAddress}")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
`;
    return {
        instructions: {
            kind: "String",
            value: faucetRequest,
        },
        blobs: [],
    };
}
function createManifestFromString(manifestString) {
    return {
        instructions: {
            kind: "String",
            value: manifestString,
        },
        blobs: [],
    };
}
function logTransactionResult(result) {
    console.log(`✅ Transaction submitted successfully!`);
    console.log(`🆔 Transaction ID: ${result.transactionId}`);
    if (result.status.status === babylon_gateway_api_sdk_1.TransactionStatus.CommittedSuccess) {
        console.log("🎉 Transaction completed successfully!");
    }
    else if (result.status.status === babylon_gateway_api_sdk_1.TransactionStatus.CommittedFailure) {
        console.log("❌ Transaction failed!");
        console.log(`   Error: ${result.status.error_message || 'Unknown error'}`);
    }
    else {
        console.log(`⚠️  Transaction status: ${result.status.status}`);
    }
}
//# sourceMappingURL=transaction.js.map