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
exports.ensureConfigDir = ensureConfigDir;
exports.getConfig = getConfig;
exports.saveConfig = saveConfig;
exports.getCurrentNetwork = getCurrentNetwork;
exports.setCurrentNetwork = setCurrentNetwork;
exports.isValidNetwork = isValidNetwork;
exports.storeAccount = storeAccount;
exports.getStoredAccounts = getStoredAccounts;
exports.getActiveAccount = getActiveAccount;
exports.setActiveAccount = setActiveAccount;
exports.getAccountsByNetwork = getAccountsByNetwork;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const CONFIG_DIR = path.join(os.homedir(), '.scrypto-dev');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
function ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
}
function getConfig() {
    ensureConfigDir();
    if (!fs.existsSync(CONFIG_FILE)) {
        return {};
    }
    try {
        const content = fs.readFileSync(CONFIG_FILE, 'utf8');
        return JSON.parse(content);
    }
    catch (error) {
        console.error('Error reading config file:', error);
        return {};
    }
}
function saveConfig(config) {
    ensureConfigDir();
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    }
    catch (error) {
        console.error('Error saving config file:', error);
    }
}
function getCurrentNetwork() {
    const config = getConfig();
    return config.network || null;
}
function setCurrentNetwork(network) {
    const config = getConfig();
    config.network = network;
    saveConfig(config);
}
function isValidNetwork(network) {
    return network === 'stokenet' || network === 'mainnet';
}
function storeAccount(account) {
    const config = getConfig();
    const accountId = `${account.network}-${account.index}-${Date.now()}`;
    const storedAccount = {
        id: accountId,
        address: account.address,
        publicKey: account.publicKey,
        privateKey: account.privateKey,
        index: account.index,
        network: account.network,
        mnemonic: account.mnemonic,
        createdAt: new Date().toISOString()
    };
    config.accounts = config.accounts || [];
    config.accounts.push(storedAccount);
    // Set as active if it's the first account
    if (!config.activeAccountId) {
        config.activeAccountId = accountId;
    }
    saveConfig(config);
    return storedAccount;
}
function getStoredAccounts() {
    const config = getConfig();
    return config.accounts || [];
}
function getActiveAccount() {
    const config = getConfig();
    if (!config.activeAccountId)
        return null;
    const accounts = config.accounts || [];
    return accounts.find(acc => acc.id === config.activeAccountId) || null;
}
function setActiveAccount(accountId) {
    const config = getConfig();
    const accounts = config.accounts || [];
    const account = accounts.find(acc => acc.id === accountId);
    if (!account)
        return false;
    config.activeAccountId = accountId;
    saveConfig(config);
    return true;
}
function getAccountsByNetwork(network) {
    const accounts = getStoredAccounts();
    return accounts.filter(acc => acc.network === network);
}
//# sourceMappingURL=environment.js.map