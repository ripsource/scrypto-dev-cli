#!/usr/bin/env node

// Quick platform detection test
const os = require('os');

console.log('🧪 Platform Detection Test');
console.log('==========================');
console.log(`Platform: ${os.platform()}`);
console.log(`Architecture: ${os.arch()}`);
console.log(`OS Type: ${os.type()}`);
console.log(`Release: ${os.release()}`);

// Expected mapping for your M3 MacBook Pro
if (os.platform() === 'darwin' && os.arch() === 'arm64') {
  console.log('\n✅ Your M3 MacBook Pro should use: aarch64-apple-darwin');
  console.log('   Binary extension: (none)');
} else if (os.platform() === 'darwin' && os.arch() === 'x64') {
  console.log('\n✅ Intel Mac detected, should use: x86_64-apple-darwin');
} else if (os.platform() === 'win32') {
  console.log('\n✅ Windows detected, should use: x86_64-pc-windows-msvc');
  console.log('   Binary extension: .exe');
} else if (os.platform() === 'linux') {
  console.log('\n✅ Linux detected, should use: x86_64-unknown-linux-gnu');
} else {
  console.log('\n❌ Unsupported platform combination');
}

// Test the binary helper if built
try {
  const { getPlatformInfo } = require('./dist/utils/binary-helper');
  const platformInfo = getPlatformInfo();
  console.log('\n🔧 Binary Helper Result:');
  console.log(`   Target: ${platformInfo.target}`);
  console.log(`   Extension: ${platformInfo.binaryExtension || '(none)'}`);
} catch (error) {
  console.log('\n⚠️  Binary helper not built yet. Run: npm run build');
}