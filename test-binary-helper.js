// Quick test script for binary helper
const { getPlatformInfo, getBinaryPath, checkBinaryAvailable, listAvailableBinaries } = require('./dist/utils/binary-helper');

console.log('🧪 Testing Binary Helper...\n');

try {
  // Test platform detection
  const platformInfo = getPlatformInfo();
  console.log('📋 Platform Info:', platformInfo);

  // Test available binaries
  const availableBinaries = listAvailableBinaries();
  console.log('📦 Available binaries:', availableBinaries);

  // Test binary checks
  const binaryNames = ['schema-gen-cli', 'wallet-cli'];
  
  for (const binaryName of binaryNames) {
    const isAvailable = checkBinaryAvailable(binaryName);
    console.log(`${isAvailable ? '✅' : '❌'} ${binaryName}: ${isAvailable ? 'Available' : 'Not found'}`);
    
    if (isAvailable) {
      try {
        const binaryPath = getBinaryPath(binaryName);
        console.log(`   📁 Path: ${binaryPath}`);
      } catch (error) {
        console.log(`   ❌ Error getting path: ${error.message}`);
      }
    }
  }

  console.log('\n✅ Binary helper test completed!');
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}