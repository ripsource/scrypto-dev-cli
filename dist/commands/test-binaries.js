"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testBinaries = testBinaries;
const binary_helper_1 = require("../utils/binary-helper");
const child_process_1 = require("child_process");
function testBinaries() {
    console.log("🧪 Testing precompiled binaries...\n");
    // Show platform info
    const platformInfo = (0, binary_helper_1.getPlatformInfo)();
    console.log(`🖥️  Platform: ${platformInfo.target}`);
    console.log(`📱 Extension: ${platformInfo.binaryExtension || 'none'}\n`);
    // List available binaries
    const availableBinaries = (0, binary_helper_1.listAvailableBinaries)();
    console.log(`📦 Available binaries: ${availableBinaries.length > 0 ? availableBinaries.join(', ') : 'none'}\n`);
    // Test each expected binary
    const expectedBinaries = ['schema-gen-cli', 'wallet-cli'];
    for (const binaryName of expectedBinaries) {
        console.log(`🔍 Testing ${binaryName}:`);
        const isAvailable = (0, binary_helper_1.checkBinaryAvailable)(binaryName);
        if (!isAvailable) {
            console.log(`  ❌ Not found`);
            continue;
        }
        try {
            const binaryPath = (0, binary_helper_1.getBinaryPath)(binaryName);
            console.log(`  📁 Path: ${binaryPath}`);
            // Try to run the binary with --help to verify it works
            try {
                const result = (0, child_process_1.execSync)(`"${binaryPath}" --help`, {
                    encoding: 'utf8',
                    timeout: 5000,
                    stdio: ['pipe', 'pipe', 'pipe']
                });
                console.log(`  ✅ Working (${result.split('\n')[0].substring(0, 50)}...)`);
            }
            catch (execError) {
                console.log(`  ⚠️  Found but failed to execute: ${execError}`);
            }
        }
        catch (error) {
            console.log(`  ❌ Error: ${error}`);
        }
        console.log();
    }
    // Summary
    const workingBinaries = expectedBinaries.filter(name => (0, binary_helper_1.checkBinaryAvailable)(name));
    const workingCount = workingBinaries.length;
    const totalCount = expectedBinaries.length;
    console.log(`📊 Summary: ${workingCount}/${totalCount} binaries working`);
    if (workingCount === totalCount) {
        console.log("✅ All binaries are ready!");
    }
    else {
        console.log("⚠️  Some binaries are missing. Run this after:");
        console.log("   npm run build:binaries:local");
    }
}
//# sourceMappingURL=test-binaries.js.map