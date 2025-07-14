"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.submit = submit;
exports.createManifestTemplate = createManifestTemplate;
const environment_1 = require("../utils/environment");
const transaction_1 = require("../utils/transaction");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function submit(filePath) {
    console.log("🚀 Submitting transaction manifest...");
    const network = (0, environment_1.getCurrentNetwork)();
    if (!network) {
        console.log('❌ No environment set. Use "scrypto-dev set-env <network>" to set one.');
        return;
    }
    const activeAccount = (0, environment_1.getActiveAccount)();
    if (!activeAccount) {
        console.log('❌ No active account set. Use "scrypto-dev set-address <account-id>" to set one.');
        return;
    }
    console.log(`📡 Network: ${network}`);
    console.log(`👤 Account: ${activeAccount.address}`);
    // Resolve file path
    const resolvedPath = path.resolve(filePath);
    if (!fs.existsSync(resolvedPath)) {
        console.error(`❌ File not found: ${resolvedPath}`);
        return;
    }
    if (!filePath.endsWith('.rtm')) {
        console.error('❌ File must have .rtm extension (Radix Transaction Manifest)');
        return;
    }
    try {
        // Read the manifest file
        const manifestContent = fs.readFileSync(resolvedPath, 'utf8');
        console.log(`📄 Manifest file: ${path.basename(resolvedPath)}`);
        console.log('📄 Manifest content:');
        console.log(manifestContent);
        // Replace placeholder account address with active account
        const processedManifest = processManifest(manifestContent, activeAccount.address);
        if (processedManifest !== manifestContent) {
            console.log('\n🔄 Processed manifest (account address substituted):');
            console.log(processedManifest);
        }
        console.log('\n🔄 Submitting transaction...');
        const result = await (0, transaction_1.buildAndSubmitTransaction)({
            instructions: { kind: 'String', value: processedManifest },
            blobs: []
        });
        (0, transaction_1.logTransactionResult)(result);
        if (result.status.status === 'CommittedSuccess') {
            console.log('\n✅ Transaction executed successfully!');
        }
    }
    catch (error) {
        console.error('❌ Transaction submission failed:', error);
        if (error instanceof Error) {
            if (error.message.includes('LexerError') || error.message.includes('CompilationError')) {
                console.error('\n💡 Hint: Check your manifest syntax. Common issues:');
                console.error('   - Missing semicolons after instructions');
                console.error('   - Incorrect address formats');
                console.error('   - Invalid instruction names or parameters');
            }
        }
    }
}
function processManifest(manifest, accountAddress) {
    // Replace common placeholder patterns with the active account address
    let processed = manifest;
    // Replace {ACCOUNT} placeholder
    processed = processed.replace(/\{ACCOUNT\}/g, accountAddress);
    // Replace $ACCOUNT placeholder
    processed = processed.replace(/\$ACCOUNT/g, accountAddress);
    // Replace {{account}} placeholder (case insensitive)
    processed = processed.replace(/\{\{account\}\}/gi, accountAddress);
    return processed;
}
function createManifestTemplate(accountAddress) {
    return `CALL_METHOD
    Address("${accountAddress}")
    "lock_fee"
    Decimal("500")
;

# Add your transaction instructions here
# Example:
# CALL_METHOD
#     Address("component_address_here")
#     "method_name"
#     arguments_here
# ;

CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;`;
}
//# sourceMappingURL=submit.js.map