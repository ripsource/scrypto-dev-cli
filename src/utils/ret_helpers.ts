import {
  Convert,
  Expression,
  ManifestBuilder,
  NetworkId,
  PrivateKey,
  RadixEngineToolkit,
  RawRadixEngineToolkit,
  TransactionBuilder,
  ValueKind,
  address,
  array,
  decimal,
  expression,
  generateRandomNonce,
  map,
  tuple,
  type Instructions,
  type Intent,
  type NotarizedTransaction,
  type SignedIntent,
  type TransactionManifest,
  type Value,
} from "@radixdlt/radix-engine-toolkit";

import {
  Configuration,
  NetworkConfig,
  StatusApi,
  TransactionApi,
  TransactionStatus,
  type TransactionStatusResponse,
  type TransactionSubmitResponse,
} from "@radixdlt/babylon-gateway-api-sdk";

export const getCurrentEpoch = async (statusApi: StatusApi): Promise<number> =>
  statusApi.gatewayStatus().then((output) => output.ledger_state.epoch);

export const submitTransaction = async (
  transactionApi: TransactionApi,
  compiledTransaction: Uint8Array
): Promise<TransactionSubmitResponse> =>
  transactionApi.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex:
        Convert.Uint8Array.toHexString(compiledTransaction),
    },
  });

export const getTransactionStatus = async (
  transactionApi: TransactionApi,
  transactionId: string
): Promise<TransactionStatusResponse> =>
  transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash: transactionId,
    },
  });
