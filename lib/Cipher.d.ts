import { ICipher, IVault, MasterKey, EncryptedData } from '.';
export declare class Cipher implements ICipher {
    protected _vault: IVault;
    constructor(vault: IVault);
    get vault(): IVault;
    saveKey(name: string, key: string): void;
    getKey(name: string): void;
    createMasterKey(password: string): Promise<MasterKey>;
    findMasterKey(password: string): Promise<MasterKey>;
    encrypt(text: string, password: string): Promise<EncryptedData>;
    decrypt(encdata: string, password: string): Promise<string>;
}
