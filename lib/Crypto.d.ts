/// <reference types="node" />
import crypto from 'crypto';
import keytar from 'keytar';
import wif from 'wif';
import * as bip32 from 'bip32';
import * as bip38 from 'bip38';
import * as bip39 from 'bip39';
export declare const setPassword: typeof keytar.setPassword;
export declare const getPassword: typeof keytar.getPassword;
export declare const entropyToMnemonic: typeof bip39.entropyToMnemonic;
export declare const mnemonicToSeedSync: typeof bip39.mnemonicToSeedSync;
export declare const fromSeed: typeof bip32.fromSeed;
export declare const randomBytes: typeof crypto.randomBytes;
export declare const encrypt: typeof bip38.encrypt;
export declare const decrypt: typeof bip38.decrypt;
export declare const decode: typeof wif.decode;
export declare const createCipheriv: typeof crypto.createCipheriv;
export declare const createDecipheriv: typeof crypto.createDecipheriv;
