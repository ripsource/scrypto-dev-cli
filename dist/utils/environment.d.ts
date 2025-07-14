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
export declare function ensureConfigDir(): void;
export declare function getConfig(): Config;
export declare function saveConfig(config: Config): void;
export declare function getCurrentNetwork(): Network | null;
export declare function setCurrentNetwork(network: Network): void;
export declare function isValidNetwork(network: string): network is Network;
export declare function storeAccount(account: {
    address: string;
    publicKey: string;
    privateKey?: string;
    index: number;
    network: Network;
    mnemonic?: string;
}): StoredAccount;
export declare function getStoredAccounts(): StoredAccount[];
export declare function getActiveAccount(): StoredAccount | null;
export declare function setActiveAccount(accountId: string): boolean;
export declare function getAccountsByNetwork(network: Network): StoredAccount[];
export {};
//# sourceMappingURL=environment.d.ts.map