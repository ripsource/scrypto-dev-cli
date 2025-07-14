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
exports.createManifest = createManifest;
const environment_1 = require("../utils/environment");
const fs = __importStar(require("fs"));
function createManifest(templateName) {
    const activeAccount = (0, environment_1.getActiveAccount)();
    if (!activeAccount) {
        console.log('❌ No active account set. Use "scrypto-dev set-address <account-id>" to set one.');
        return;
    }
    const template = templateName || 'basic';
    const outputFileName = `${template}.rtm`;
    // Check if file already exists
    if (fs.existsSync(outputFileName)) {
        console.log(`❌ File ${outputFileName} already exists.`);
        return;
    }
    let manifestContent;
    switch (template.toLowerCase()) {
        case 'faucet':
            manifestContent = getFaucetTemplate();
            break;
        case 'basic':
        case 'template':
        default:
            manifestContent = getBasicTemplate();
            break;
    }
    // Replace placeholder with actual account address
    const processedContent = manifestContent.replace(/\{ACCOUNT\}/g, activeAccount.address);
    try {
        fs.writeFileSync(outputFileName, processedContent);
        console.log(`✅ Created manifest template: ${outputFileName}`);
        console.log(`👤 Account address: ${activeAccount.address}`);
        console.log('\n📄 Content:');
        console.log(processedContent);
        console.log(`\n💡 Edit the file and run: scrypto-dev submit ${outputFileName}`);
    }
    catch (error) {
        console.error(`❌ Failed to create manifest file: ${error}`);
    }
}
function getBasicTemplate() {
    return `CALL_METHOD
    Address("{ACCOUNT}")
    "lock_fee"
    Decimal("500")
;

# Add your transaction instructions here
# Example: Call a component method
# CALL_METHOD
#     Address("component_address_here")
#     "method_name"
#     "argument1"
#     Decimal("123.45")
# ;

CALL_METHOD
    Address("{ACCOUNT}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;`;
}
function getFaucetTemplate() {
    return `CALL_METHOD
    Address("component_tdx_2_1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxyulkzl")
    "lock_fee"
    Decimal("5000")
;
CALL_METHOD
    Address("component_tdx_2_1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxyulkzl")
    "free"
;
CALL_METHOD
    Address("{ACCOUNT}")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;`;
}
//# sourceMappingURL=create-manifest.js.map