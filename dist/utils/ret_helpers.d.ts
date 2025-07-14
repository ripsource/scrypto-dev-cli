import { StatusApi, TransactionApi, type TransactionStatusResponse, type TransactionSubmitResponse } from "@radixdlt/babylon-gateway-api-sdk";
export declare const getCurrentEpoch: (statusApi: StatusApi) => Promise<number>;
export declare const submitTransaction: (transactionApi: TransactionApi, compiledTransaction: Uint8Array) => Promise<TransactionSubmitResponse>;
export declare const getTransactionStatus: (transactionApi: TransactionApi, transactionId: string) => Promise<TransactionStatusResponse>;
//# sourceMappingURL=ret_helpers.d.ts.map