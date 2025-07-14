import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.scrypto-dev');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export type Network = 'stokenet' | 'mainnet';

export interface StoredAccount {
  id: string;
  address: string;
  publicKey: string;
  privateKey?: string;
  index: number;
  network: Network;
  mnemonic?: string;
  createdAt: string;
}

interface Config {
  network?: Network;
  accounts?: StoredAccount[];
  activeAccountId?: string;
}

export function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function getConfig(): Config {
  ensureConfigDir();
  
  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }
  
  try {
    const content = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading config file:', error);
    return {};
  }
}

export function saveConfig(config: Config): void {
  ensureConfigDir();
  
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving config file:', error);
  }
}

export function getCurrentNetwork(): Network | null {
  const config = getConfig();
  return config.network || null;
}

export function setCurrentNetwork(network: Network): void {
  const config = getConfig();
  config.network = network;
  saveConfig(config);
}

export function isValidNetwork(network: string): network is Network {
  return network === 'stokenet' || network === 'mainnet';
}

export function storeAccount(account: {
  address: string;
  publicKey: string;
  privateKey?: string;
  index: number;
  network: Network;
  mnemonic?: string;
}): StoredAccount {
  const config = getConfig();
  const accountId = `${account.network}-${account.index}-${Date.now()}`;
  
  const storedAccount: StoredAccount = {
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

export function getStoredAccounts(): StoredAccount[] {
  const config = getConfig();
  return config.accounts || [];
}

export function getActiveAccount(): StoredAccount | null {
  const config = getConfig();
  if (!config.activeAccountId) return null;
  
  const accounts = config.accounts || [];
  return accounts.find(acc => acc.id === config.activeAccountId) || null;
}

export function setActiveAccount(accountId: string): boolean {
  const config = getConfig();
  const accounts = config.accounts || [];
  
  const account = accounts.find(acc => acc.id === accountId);
  if (!account) return false;
  
  config.activeAccountId = accountId;
  saveConfig(config);
  return true;
}

export function getAccountsByNetwork(network: Network): StoredAccount[] {
  const accounts = getStoredAccounts();
  return accounts.filter(acc => acc.network === network);
}