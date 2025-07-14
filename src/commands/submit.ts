import { getCurrentNetwork, getActiveAccount } from '../utils/environment';
import { buildAndSubmitTransaction, logTransactionResult } from '../utils/transaction';
import * as fs from 'fs';
import * as path from 'path';

export async function submit(filePath: string) {
  console.log("🚀 Submitting transaction manifest...");

  const network = getCurrentNetwork();
  
  if (!network) {
    console.log('❌ No environment set. Use "scrypto-dev set-env <network>" to set one.');
    return;
  }

  const activeAccount = getActiveAccount();
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

    const result = await buildAndSubmitTransaction({
      instructions: { kind: 'String', value: processedManifest },
      blobs: []
    });

    logTransactionResult(result);

    if (result.status.status === 'CommittedSuccess') {
      console.log('\n✅ Transaction executed successfully!');
    }
  } catch (error) {
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

function processManifest(manifest: string, accountAddress: string): string {
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

export function createManifestTemplate(accountAddress: string): string {
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