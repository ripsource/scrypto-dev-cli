"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionStatus = exports.submitTransaction = exports.getCurrentEpoch = void 0;
const radix_engine_toolkit_1 = require("@radixdlt/radix-engine-toolkit");
const getCurrentEpoch = async (statusApi) => statusApi.gatewayStatus().then((output) => output.ledger_state.epoch);
exports.getCurrentEpoch = getCurrentEpoch;
const submitTransaction = async (transactionApi, compiledTransaction) => transactionApi.transactionSubmit({
    transactionSubmitRequest: {
        notarized_transaction_hex: radix_engine_toolkit_1.Convert.Uint8Array.toHexString(compiledTransaction),
    },
});
exports.submitTransaction = submitTransaction;
const getTransactionStatus = async (transactionApi, transactionId) => transactionApi.transactionStatus({
    transactionStatusRequest: {
        intent_hash: transactionId,
    },
});
exports.getTransactionStatus = getTransactionStatus;
//# sourceMappingURL=ret_helpers.js.map