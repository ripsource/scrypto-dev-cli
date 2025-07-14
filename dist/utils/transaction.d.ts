import { type TransactionManifest } from "@radixdlt/radix-engine-toolkit";
import { StatusApi, TransactionApi, type TransactionStatusResponse, type TransactionSubmitResponse } from "@radixdlt/babylon-gateway-api-sdk";
import { type Network } from './environment';
export interface NetworkConfiguration {
    gatewayBaseUrl: string;
    networkId: number;
}
export interface TransactionResult {
    transactionId: string;
    status: TransactionStatusResponse;
    submissionResult: TransactionSubmitResponse;
}
export declare function getNetworkConfiguration(network: Network): NetworkConfiguration;
export declare function getCurrentEpoch(statusApi: StatusApi): Promise<number>;
export declare function submitTransaction(transactionApi: TransactionApi, compiledTransaction: Uint8Array): Promise<TransactionSubmitResponse>;
export declare function getTransactionStatus(transactionApi: TransactionApi, transactionId: string): Promise<TransactionStatusResponse>;
export declare function waitForTransactionCompletion(transactionApi: TransactionApi, transactionId: string, maxWaitTimeMs?: number): Promise<TransactionStatusResponse>;
export declare function buildAndSubmitTransaction(manifest: TransactionManifest, privateKeyHex?: string): Promise<TransactionResult>;
export declare function createFaucetManifest(accountAddress: string): TransactionManifest;
export declare function createManifestFromString(manifestString: string): TransactionManifest;
export declare function logTransactionResult(result: TransactionResult): void;
//# sourceMappingURL=transaction.d.ts.map