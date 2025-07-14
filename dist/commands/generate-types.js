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
function generateTypes(packageAddress) {
    console.log("Generating types...");
    console.log("Package address:", packageAddress);
    // Detect network from package address
    let network;
    if (packageAddress.startsWith("package_rdx")) {
        network = "mainnet";
    }
    else if (packageAddress.startsWith("package_tdx_2")) {
        network = "stokenet";
    }
    else {
        console.error("Error: Invalid package address format. Expected package_rdx (mainnet) or package_tdx_2 (stokenet)");
        return;
    }
    console.log(`Detected network: ${network}`);
    try {
        // Ensure types directory exists
        const typesDir = path.join(process.cwd(), "types");
        if (!fs.existsSync(typesDir)) {
            fs.mkdirSync(typesDir, { recursive: true });
            console.log("Created types directory");
        }
        // Path to the schema-gen binary
        const schemaGenBinary = path.join(__dirname, "../../schema-gen/target/release/schema-gen-cli");
        // Check if binary exists, if not try to build it
        if (!fs.existsSync(schemaGenBinary)) {
            console.log("Schema generation binary not found. Building...");
            try {
                const schemaGenDir = path.join(__dirname, "../../schema-gen");
                (0, child_process_1.execSync)("cargo build --release", {
                    cwd: schemaGenDir,
                    stdio: "inherit",
                });
            }
            catch (buildError) {
                console.error("❌ Failed to build schema generation binary:");
                console.error(buildError);
                console.error("\nPlease ensure you have Rust installed and try:");
                console.error("  cd schema-gen && cargo build --release");
                return;
            }
        }
        // Execute the schema generation
        console.log("Generating TypeScript types...");
        const result = (0, child_process_1.execSync)(`${schemaGenBinary} ${packageAddress}`, {
            encoding: "utf8",
            stdio: ["pipe", "pipe", "inherit"],
        });
        // Write to types/blueprint-types.ts
        const outputPath = path.join(typesDir, "blueprint-types.ts");
        fs.writeFileSync(outputPath, result);
        console.log(`✅ Types generated successfully at: ${outputPath}`);
        console.log(`📄 Generated ${result.split("\n").length} lines of TypeScript types`);
        // Basic validation that the output contains TypeScript constructs
        if (result.includes("const ") && result.includes("s.struct(")) {
            console.log("✅ Generated types appear to be valid");
        }
        else {
            console.log("⚠️  Generated types may be incomplete or invalid");
        }
    }
    catch (error) {
        console.error("Error generating types:", error);
        // If the binary doesn't exist, provide helpful error message
        if (error instanceof Error && error.message.includes("ENOENT")) {
            console.error("\n❌ Schema generation binary not found.");
            console.error("Please make sure the schema-gen Rust project is built:");
            console.error("  cd schema-gen && cargo build --release");
        }
    }
}
//# sourceMappingURL=generate-types.js.map