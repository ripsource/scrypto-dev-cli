import { getActiveAccount } from '../utils/environment';
import * as fs from 'fs';
import * as path from 'path';

export function createManifest(templateName?: string) {
  const activeAccount = getActiveAccount();
  
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

  let manifestContent: string;

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
  } catch (error) {
    console.error(`❌ Failed to create manifest file: ${error}`);
  }
}

function getBasicTemplate(): string {
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

function getFaucetTemplate(): string {
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