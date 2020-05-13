import { LowdbSync } from 'lowdb';
import { IVault, ICipher } from '.';
export declare class Vault implements IVault {
    protected readonly _options: any;
    protected readonly _root: string;
    protected readonly _cipher: ICipher;
    protected _db?: LowdbSync<any>;
    constructor(options?: any);
    get options(): any;
    get exists(): boolean;
    get name(): any;
    get root(): string;
    get dir(): string;
    get cipher(): ICipher;
    get service(): any;
    write(key: string, value: any): (void & Promise<void>) | undefined;
    read(key: string): any;
    get id(): any;
    get isLocked(): boolean;
    _verify(lockFile: string, indexFile: string, close: boolean): Promise<unknown>;
    lock(password: string): Promise<{
        vault: IVault;
        mnemonic: string | undefined;
    }>;
    unlock(password: string): Promise<{
        vault: IVault;
    }>;
    initialize(): Promise<unknown>;
}
