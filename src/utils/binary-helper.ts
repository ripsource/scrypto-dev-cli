import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

interface PlatformInfo {
  target: string;
  binaryExtension: string;
}

export function getPlatformInfo(): PlatformInfo {
  const platform = os.platform();
  const arch = os.arch();

  // Map Node.js platform/arch to Rust targets
  let target: string;
  let binaryExtension = '';

  if (platform === 'win32') {
    target = 'x86_64-pc-windows-msvc';
    binaryExtension = '.exe';
  } else if (platform === 'darwin') {
    if (arch === 'arm64') {
      target = 'aarch64-apple-darwin';
    } else {
      target = 'x86_64-apple-darwin';
    }
  } else if (platform === 'linux') {
    target = 'x86_64-unknown-linux-gnu';
  } else {
    throw new Error(`Unsupported platform: ${platform}-${arch}`);
  }

  return { target, binaryExtension };
}

export function getBinaryPath(binaryName: string): string {
  const { target, binaryExtension } = getPlatformInfo();
  
  // First, try to find the binary in the distributed binaries
  const distBinaryPath = path.join(
    __dirname,
    '..',
    'binaries',
    target,
    `${binaryName}${binaryExtension}`
  );

  if (fs.existsSync(distBinaryPath)) {
    return distBinaryPath;
  }

  // Fallback: try development build locations
  const devPaths = [
    // schema-gen binary
    path.join(__dirname, '..', '..', 'schema-gen', 'target', 'release', `${binaryName}${binaryExtension}`),
    path.join(__dirname, '..', '..', 'schema-gen', 'target', target, 'release', `${binaryName}${binaryExtension}`),
    // wallet-cli binary
    path.join(__dirname, '..', '..', 'wallet-compatible-derivation-main', 'crates', 'wallet_compatible_derivation_cli', 'target', 'release', `${binaryName}${binaryExtension}`),
    path.join(__dirname, '..', '..', 'wallet-compatible-derivation-main', 'crates', 'wallet_compatible_derivation_cli', 'target', target, 'release', `${binaryName}${binaryExtension}`)
  ];

  for (const devPath of devPaths) {
    if (fs.existsSync(devPath)) {
      return devPath;
    }
  }

  throw new Error(`Binary not found: ${binaryName} for platform ${target}`);
}

export function checkBinaryAvailable(binaryName: string): boolean {
  try {
    getBinaryPath(binaryName);
    return true;
  } catch {
    return false;
  }
}

export function listAvailableBinaries(): string[] {
  const { target } = getPlatformInfo();
  const binariesDir = path.join(__dirname, '..', 'binaries', target);
  
  if (!fs.existsSync(binariesDir)) {
    return [];
  }

  return fs.readdirSync(binariesDir).map(file => {
    // Remove extension for cleaner names
    return file.replace(/\.(exe)$/, '');
  });
}