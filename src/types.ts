export type MasterKey = [Buffer, string?];
export type EncryptedData = [string, string?];

export interface ICipher {
    readonly vault: IVault;
    
    saveKey(name: string, key: string): void; 
    getKey(name: string): void;  
    createMasterKey(password: string): Promise<MasterKey>;
    findMasterKey(password: string): Promise<MasterKey>;    
    encrypt (text: string, password: string): Promise<EncryptedData>;
    decrypt (encdata: string, password: string): Promise<string>;
}

export interface IVault {
    readonly options: any;
    readonly exists: boolean;
    readonly name: string;
    readonly root: string;
    readonly dir: string;
    readonly service: string;
    readonly cipher: ICipher;
    readonly id:string;
    readonly isLocked: boolean;

    lock(password: string): Promise<any>;
    unlock (password: string): Promise<any>;
    write (key: string, value: any): any;
    read (key: string): any;
}