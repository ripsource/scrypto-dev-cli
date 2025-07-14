interface PlatformInfo {
    target: string;
    binaryExtension: string;
}
export declare function getPlatformInfo(): PlatformInfo;
export declare function getBinaryPath(binaryName: string): string;
export declare function checkBinaryAvailable(binaryName: string): boolean;
export declare function listAvailableBinaries(): string[];
export {};
//# sourceMappingURL=binary-helper.d.ts.map