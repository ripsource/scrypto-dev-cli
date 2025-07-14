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
exports.getPlatformInfo = getPlatformInfo;
exports.getBinaryPath = getBinaryPath;
exports.checkBinaryAvailable = checkBinaryAvailable;
exports.listAvailableBinaries = listAvailableBinaries;
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function getPlatformInfo() {
    const platform = os.platform();
    const arch = os.arch();
    // Map Node.js platform/arch to Rust targets
    let target;
    let binaryExtension = '';
    if (platform === 'win32') {
        target = 'x86_64-pc-windows-msvc';
        binaryExtension = '.exe';
    }
    else if (platform === 'darwin') {
        if (arch === 'arm64') {
            target = 'aarch64-apple-darwin';
        }
        else {
            target = 'x86_64-apple-darwin';
        }
    }
    else if (platform === 'linux') {
        target = 'x86_64-unknown-linux-gnu';
    }
    else {
        throw new Error(`Unsupported platform: ${platform}-${arch}`);
    }
    return { target, binaryExtension };
}
function getBinaryPath(binaryName) {
    const { target, binaryExtension } = getPlatformInfo();
    // First, try to find the binary in the distributed binaries
    const distBinaryPath = path.join(__dirname, '..', 'binaries', target, `${binaryName}${binaryExtension}`);
    if (fs.existsSync(distBinaryPath)) {
        return distBinaryPath;
    }
    // Fallback: try development build location
    const devBinaryPath = path.join(__dirname, '..', '..', 'schema-gen', 'target', 'release', `${binaryName}${binaryExtension}`);
    if (fs.existsSync(devBinaryPath)) {
        return devBinaryPath;
    }
    throw new Error(`Binary not found: ${binaryName} for platform ${target}`);
}
function checkBinaryAvailable(binaryName) {
    try {
        getBinaryPath(binaryName);
        return true;
    }
    catch {
        return false;
    }
}
function listAvailableBinaries() {
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
//# sourceMappingURL=binary-helper.js.map