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
exports.generateTypes = generateTypes;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const binary_helper_1 = require("../utils/binary-helper");
function generateTypes(packageAddress) {
    console.log("🔧 Generating types...");
    console.log("📦 Package address:", packageAddress);
    // Detect network from package address
    let network;
    if (packageAddress.startsWith("package_rdx")) {
        network = "mainnet";
    }
    else if (packageAddress.startsWith("package_tdx_2")) {
        network = "stokenet";
    }
    else {
        console.error("❌ Invalid package address format. Expected package_rdx (mainnet) or package_tdx_2 (stokenet)");
        return;
    }
    console.log(`🌐 Network: ${network}`);
    // Check if schema-gen binary is available
    if (!(0, binary_helper_1.checkBinaryAvailable)("schema-gen-cli")) {
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
        const schemaGenBinary = (0, binary_helper_1.getBinaryPath)("schema-gen-cli");
        console.log("⚡ Generating TypeScript types...");
        // Execute the schema generation
        const result = (0, child_process_1.execSync)(`"${schemaGenBinary}" ${packageAddress}`, {
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
        }
        else {
            console.log("⚠️  Generated types may be incomplete - please review the output");
        }
    }
    catch (error) {
        console.error("❌ Type generation failed:", error);
        console.error("");
        console.error("💡 Alternative: Use the online type generator at:");
        console.error("   https://www.8arms1goal.com/sbor-ez-mode-ez-mode");
        console.error(`   Package address: ${packageAddress}`);
    }
}
//# sourceMappingURL=generate-types.js.map