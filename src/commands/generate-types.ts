import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { getBinaryPath, checkBinaryAvailable } from "../utils/binary-helper";

export function generateTypes(packageAddress: string) {
  console.log("🔧 Generating types...");
  console.log("📦 Package address:", packageAddress);

  // Detect network from package address
  let network: string;
  if (packageAddress.startsWith("package_rdx")) {
    network = "mainnet";
  } else if (packageAddress.startsWith("package_tdx_2")) {
    network = "stokenet";
  } else {
    console.error(
      "❌ Invalid package address format. Expected package_rdx (mainnet) or package_tdx_2 (stokenet)"
    );
    return;
  }

  console.log(`🌐 Network: ${network}`);

  // Check if schema-gen binary is available
  if (!checkBinaryAvailable("schema-gen-cli")) {
    console.error("❌ Schema generation binary not found for your platform.");
    console.error("This could be due to:");
    console.error("  - Unsupported platform");
    console.error("  - Missing precompiled binary");
    console.error("  - Installation issue");
    console.error("");
    console.error("💡 Alternative: Use the online type generator at:");
    console.error("   https://www.8arms1goal.com/sbor-ez-mode-ez-mode");
    console.error(`   Package address: ${packageAddress}`);
    return;
  }

  try {
    // Ensure types directory exists
    const typesDir = path.join(process.cwd(), "types");
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir, { recursive: true });
      console.log("📁 Created types directory");
    }

    // Get the binary path for current platform
    const schemaGenBinary = getBinaryPath("schema-gen-cli");
    console.log("⚡ Generating TypeScript types...");

    // Execute the schema generation
    const result = execSync(`"${schemaGenBinary}" ${packageAddress}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "inherit"],
    });

    // Write to types/blueprint-types.ts
    const outputPath = path.join(typesDir, "blueprint-types.ts");
    fs.writeFileSync(outputPath, result);

    console.log(`✅ Types generated successfully!`);
    console.log(`📄 Output: ${outputPath}`);
    console.log(`📊 Generated ${result.split("\n").length} lines of TypeScript`);

    // Basic validation that the output contains TypeScript constructs
    if (result.includes("const ") && result.includes("s.struct(")) {
      console.log("✨ Generated types appear to be valid");
    } else {
      console.log("⚠️  Generated types may be incomplete - please review the output");
    }
  } catch (error) {
    console.error("❌ Type generation failed:", error);
    console.error("");
    console.error("💡 Alternative: Use the online type generator at:");
    console.error("   https://www.8arms1goal.com/sbor-ez-mode-ez-mode");
    console.error(`   Package address: ${packageAddress}`);
  }
}
