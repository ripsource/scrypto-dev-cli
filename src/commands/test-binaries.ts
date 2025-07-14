import { getBinaryPath, checkBinaryAvailable, getPlatformInfo, listAvailableBinaries } from '../utils/binary-helper';
import { execSync } from 'child_process';

export function testBinaries() {
  console.log("🧪 Testing precompiled binaries...\n");

  // Show platform info
  const platformInfo = getPlatformInfo();
  console.log(`🖥️  Platform: ${platformInfo.target}`);
  console.log(`📱 Extension: ${platformInfo.binaryExtension || 'none'}\n`);

  // List available binaries
  const availableBinaries = listAvailableBinaries();
  console.log(`📦 Available binaries: ${availableBinaries.length > 0 ? availableBinaries.join(', ') : 'none'}\n`);

  // Test each expected binary
  const expectedBinaries = ['schema-gen-cli', 'wallet-cli'];
  
  for (const binaryName of expectedBinaries) {
    console.log(`🔍 Testing ${binaryName}:`);
    
    const isAvailable = checkBinaryAvailable(binaryName);
    if (!isAvailable) {
      console.log(`  ❌ Not found`);
      continue;
    }

    try {
      const binaryPath = getBinaryPath(binaryName);
      console.log(`  📁 Path: ${binaryPath}`);
      
      // Try to run the binary with --help to verify it works
      try {
        const result = execSync(`"${binaryPath}" --help`, { 
          encoding: 'utf8', 
          timeout: 5000,
          stdio: ['pipe', 'pipe', 'pipe']
        });
        console.log(`  ✅ Working (${result.split('\n')[0].substring(0, 50)}...)`);
      } catch (execError) {
        console.log(`  ⚠️  Found but failed to execute: ${execError}`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error}`);
    }
    console.log();
  }

  // Summary
  const workingBinaries = expectedBinaries.filter(name => checkBinaryAvailable(name));
  const workingCount = workingBinaries.length;
  const totalCount = expectedBinaries.length;

  console.log(`📊 Summary: ${workingCount}/${totalCount} binaries working`);
  
  if (workingCount === totalCount) {
    console.log("✅ All binaries are ready!");
  } else {
    console.log("⚠️  Some binaries are missing. Run this after:");
    console.log("   npm run build:binaries:local");
  }
}