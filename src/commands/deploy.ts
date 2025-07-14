import {
  getActiveAccount,
  getCurrentNetwork,
  type Network,
} from "../utils/environment";
import {
  buildAndSubmitTransaction,
  logTransactionResult,
} from "../utils/transaction";
import { 
  Convert, 
  RadixEngineToolkit, 
  ManifestSborStringRepresentation,
  hash 
} from "@radixdlt/radix-engine-toolkit";
import * as fs from "fs";
import * as path from "path";
// import * as readline from 'readline'; // TODO: Re-enable when owner role configuration is implemented

// TODO: Re-enable when owner role configuration is implemented
// interface OwnerRoleConfig {
//   type: "badge" | "none";
//   updatable: "Fixed" | "Updatable";
//   resourceAddress?: string;
//   badgeType?: "fungible" | "nonfungible";
//   nftId?: string;
// }

async function createDeployManifest(
  rpdPath: string,
  wasmBuffer: Buffer,
  accountAddress: string
): Promise<string> {
  // Decode the RPD content
  const rpdDecoded = await RadixEngineToolkit.ManifestSbor.decodeToString(
    new Uint8Array(fs.readFileSync(rpdPath)),
    2,
    ManifestSborStringRepresentation.ManifestString
  );

  // Get the hash of the WASM buffer
  const wasmHash = hash(new Uint8Array(wasmBuffer));

  return `
CALL_METHOD
    Address("${accountAddress}")
    "lock_fee"
    Decimal("500")
;
PUBLISH_PACKAGE
    ${rpdDecoded}
    Blob("${Convert.Uint8Array.toHexString(wasmHash)}")
    Map<String, Tuple>()
;
CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
`;
}

// TODO: Re-enable when owner role configuration is implemented
// async function promptUser(question: string): Promise<string> {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });
//
//   return new Promise((resolve) => {
//     rl.question(question, (answer) => {
//       rl.close();
//       resolve(answer.trim());
//     });
//   });
// }

async function findWasmAndRpd(): Promise<{
  wasmPath: string;
  rpdPath: string;
} | null> {
  const targetDir = path.join(
    process.cwd(),
    "target/wasm32-unknown-unknown/release"
  );

  if (!fs.existsSync(targetDir)) {
    console.error(
      "❌ Target directory not found. Make sure you're in a Scrypto project directory."
    );
    console.error("   Expected: target/wasm32-unknown-unknown/release/");
    return null;
  }

  const files = fs.readdirSync(targetDir);

  // Find .wasm file (not the _with_schema one)
  const wasmFile = files.find(
    (file) => file.endsWith(".wasm") && !file.endsWith("_with_schema.wasm")
  );

  // Find .rpd file
  const rpdFile = files.find((file) => file.endsWith(".rpd"));

  if (!wasmFile || !rpdFile) {
    console.error(
      "❌ Required files not found in target/wasm32-unknown-unknown/release/"
    );
    console.error(`   Looking for: *.wasm and *.rpd files`);
    console.error(`   Found: ${files.join(", ")}`);
    return null;
  }

  return {
    wasmPath: path.join(targetDir, wasmFile),
    rpdPath: path.join(targetDir, rpdFile),
  };
}

export async function deploy() {
  console.log("🚀 Deploying package...");

  const network = getCurrentNetwork();

  if (!network) {
    console.log(
      '❌ No environment set. Use "scrypto-dev set-env <network>" to set one.'
    );
    return;
  }

  const activeAccount = getActiveAccount();
  if (!activeAccount) {
    console.log(
      '❌ No active account set. Use "scrypto-dev set-address <account-id>" to set one.'
    );
    return;
  }

  console.log(`📡 Network: ${network}`);
  console.log(`👤 Account: ${activeAccount.address}`);

  // Find wasm and rpd files
  const files = await findWasmAndRpd();
  if (!files) {
    return;
  }

  console.log(`📦 Found WASM: ${path.basename(files.wasmPath)}`);
  console.log(`📄 Found RPD: ${path.basename(files.rpdPath)}`);

  // Read WASM buffer
  const wasmBuffer = fs.readFileSync(files.wasmPath);

  try {
    // Create manifest
    const manifest = await createDeployManifest(
      files.rpdPath,
      wasmBuffer,
      activeAccount.address
    );

    console.log("\n🔄 Submitting deployment transaction...");
    console.log("📄 Manifest preview:");
    console.log(manifest);

    const result = await buildAndSubmitTransaction({
      instructions: { kind: "String", value: manifest },
      blobs: [new Uint8Array(wasmBuffer)],
    });

    logTransactionResult(result);

    // Try to extract package address from transaction result
    if (result.status.status === "CommittedSuccess") {
      console.log("\n📦 Package deployed successfully!");
    }
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    console.error("Full error:", error);
  }
}

// TODO: Re-implement owner role configuration once basic deployment works
// async function getOwnerRoleConfig(): Promise<OwnerRoleConfig> {
//   console.log('\n🔐 Owner Role Configuration');
//
//   const roleType = await promptUser('Select owner role (badge/none): ');
//
//   if (roleType.toLowerCase() === 'none') {
//     return { type: 'none', updatable: 'Fixed' };
//   }
//
//   if (roleType.toLowerCase() !== 'badge') {
//     console.log('Invalid selection. Defaulting to "none".');
//     return { type: 'none', updatable: 'Fixed' };
//   }
//
//   const updatable = await promptUser('Owner role updatable (Fixed/Updatable): ');
//   const isUpdatable = updatable.toLowerCase() === 'updatable' ? 'Updatable' : 'Fixed';
//
//   const badgeType = await promptUser('Badge type (fungible/nonfungible): ');
//
//   if (badgeType.toLowerCase() === 'fungible') {
//     const resourceAddress = await promptUser('Resource address: ');
//     return {
//       type: 'badge',
//       updatable: isUpdatable,
//       resourceAddress,
//       badgeType: 'fungible'
//     };
//   } else if (badgeType.toLowerCase() === 'nonfungible') {
//     const resourceAddress = await promptUser('Resource address: ');
//     const nftId = await promptUser('NFT ID (e.g., #0# or <admin_badge>): ');
//     return {
//       type: 'badge',
//       updatable: isUpdatable,
//       resourceAddress,
//       badgeType: 'nonfungible',
//       nftId
//     };
//   }
//
//   console.log('Invalid badge type. Defaulting to "none".');
//   return { type: 'none', updatable: 'Fixed' };
// }
