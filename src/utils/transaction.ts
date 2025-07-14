import {
  Convert,
  NetworkId,
  PrivateKey,
  RadixEngineToolkit,
  TransactionBuilder,
  generateRandomNonce,
  type TransactionManifest,
  type NotarizedTransaction,
} from "@radixdlt/radix-engine-toolkit";

import {
  Configuration,
  StatusApi,
  TransactionApi,
  TransactionStatus,
  type TransactionStatusResponse,
  type TransactionSubmitResponse,
} from "@radixdlt/babylon-gateway-api-sdk";

import { getCurrentNetwork, getActiveAccount, type Network } from './environment';

export interface NetworkConfiguration {
  gatewayBaseUrl: string;
  networkId: number;
}

export interface TransactionResult {
  transactionId: string;
  status: TransactionStatusResponse;
  submissionResult: TransactionSubmitResponse;
}

export function getNetworkConfiguration(network: Network): NetworkConfiguration {
  switch (network) {
    case 'mainnet':
      return {
        gatewayBaseUrl: "https://mainnet.radixdlt.com",
        networkId: NetworkId.Mainnet,
      };
    case 'stokenet':
      return {
        gatewayBaseUrl: "https://stokenet.radixdlt.com",
        networkId: NetworkId.Stokenet,
      };
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

export async function getCurrentEpoch(statusApi: StatusApi): Promise<number> {
  const response = await statusApi.gatewayStatus();
  return response.ledger_state.epoch;
}

export async function submitTransaction(
  transactionApi: TransactionApi,
  compiledTransaction: Uint8Array
): Promise<TransactionSubmitResponse> {
  return transactionApi.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex: Convert.Uint8Array.toHexString(compiledTransaction),
    },
  });
}

export async function getTransactionStatus(
  transactionApi: TransactionApi,
  transactionId: string
): Promise<TransactionStatusResponse> {
  return transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash: transactionId,
    },
  });
}

export async function waitForTransactionCompletion(
  transactionApi: TransactionApi,
  transactionId: string,
  maxWaitTimeMs: number = 30000
): Promise<TransactionStatusResponse> {
  let transactionStatus: TransactionStatusResponse | undefined;
  const startTime = Date.now();
  
  while (
    transactionStatus === undefined ||
    transactionStatus.status === TransactionStatus.Pending
  ) {
    if (Date.now() - startTime > maxWaitTimeMs) {
      throw new Error(`Transaction timeout after ${maxWaitTimeMs}ms`);
    }
    
    transactionStatus = await getTransactionStatus(transactionApi, transactionId);
    
    if (transactionStatus.status !== TransactionStatus.Pending) {
      break;
    }
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  return transactionStatus;
}

export async function buildAndSubmitTransaction(
  manifest: TransactionManifest,
  privateKeyHex?: string
): Promise<TransactionResult> {
  const network = getCurrentNetwork();
  if (!network) {
    throw new Error('No network set. Use "scrypto-dev set-env <network>" to set one.');
  }
  
  const activeAccount = getActiveAccount();
  if (!activeAccount) {
    throw new Error('No active account set. Use "scrypto-dev set-address <account-id>" to set one.');
  }
  
  // Use provided private key or get from active account
  const privateKeyToUse = privateKeyHex || activeAccount.privateKey;
  if (!privateKeyToUse) {
    throw new Error('No private key available. Account must have a stored private key.');
  }
  
  const networkConfig = getNetworkConfiguration(network);
  
  const apiConfiguration = new Configuration({
    basePath: networkConfig.gatewayBaseUrl,
  });
  const statusApi = new StatusApi(apiConfiguration);
  const transactionApi = new TransactionApi(apiConfiguration);
  
  // Setting up the private keys
  const notaryPrivateKey = new PrivateKey.Ed25519(privateKeyToUse);
  const signerPrivateKey = new PrivateKey.Ed25519(privateKeyToUse);
  
  const currentEpoch = await getCurrentEpoch(statusApi);
  
  // Create transaction header
  const transactionHeader = {
    networkId: networkConfig.networkId,
    startEpochInclusive: currentEpoch,
    endEpochExclusive: currentEpoch + 10,
    nonce: generateRandomNonce(),
    notaryPublicKey: notaryPrivateKey.publicKey(),
    notaryIsSignatory: true,
    tipPercentage: 0,
  };
  
  // Build the complete transaction
  const notarizedTransaction: NotarizedTransaction = await TransactionBuilder.new()
    .then((builder) =>
      builder
        .header(transactionHeader)
        .manifest(manifest)
        .sign(signerPrivateKey)
        .notarize(notaryPrivateKey)
    );
  
  // Get transaction ID
  const transactionId = await RadixEngineToolkit.NotarizedTransaction.intentHash(
    notarizedTransaction
  );
  
  // Compile transaction
  const compiledTransaction = await RadixEngineToolkit.NotarizedTransaction.compile(
    notarizedTransaction
  );
  
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

export function createFaucetManifest(accountAddress: string): TransactionManifest {
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

export function createManifestFromString(manifestString: string): TransactionManifest {
  return {
    instructions: {
      kind: "String",
      value: manifestString,
    },
    blobs: [],
  };
}

export function logTransactionResult(result: TransactionResult): void {
  console.log(`✅ Transaction submitted successfully!`);
  console.log(`🆔 Transaction ID: ${result.transactionId}`);
  
  if (result.status.status === TransactionStatus.CommittedSuccess) {
    console.log("🎉 Transaction completed successfully!");
  } else if (result.status.status === TransactionStatus.CommittedFailure) {
    console.log("❌ Transaction failed!");
    console.log(`   Error: ${result.status.error_message || 'Unknown error'}`);
  } else {
    console.log(`⚠️  Transaction status: ${result.status.status}`);
  }
}