export interface RustCliOptions {
    network?: string;
    start?: number;
    count?: number;
    passphrase?: string;
    includePrivateKey?: boolean;
}
export interface GeneratedMnemonic {
    mnemonic: string;
    accounts?: Account[];
}
export interface Account {
    index: number;
    address: string;
    publicKey: string;
    privateKey?: string;
}
export declare function generateMnemonic(options?: RustCliOptions): Promise<GeneratedMnemonic>;
export declare function importMnemonic(mnemonic: string, options?: RustCliOptions): Promise<Account[]>;
export declare function checkRustCliBinary(): Promise<boolean>;
//# sourceMappingURL=rust-cli.d.ts.map