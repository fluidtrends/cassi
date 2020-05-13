import crypto from 'crypto'
import keytar from 'keytar'
import wif from 'wif'
import * as bip32 from 'bip32'
import * as bip38 from 'bip38'
import * as bip39 from 'bip39'

export const setPassword = keytar.setPassword
export const getPassword = keytar.getPassword
export const entropyToMnemonic = bip39.entropyToMnemonic
export const mnemonicToSeedSync = bip39.mnemonicToSeedSync
export const fromSeed = bip32.fromSeed
export const randomBytes = crypto.randomBytes
export const encrypt = bip38.encrypt
export const decrypt = bip38.decrypt
export const decode = wif.decode
export const createCipheriv = crypto.createCipheriv
export const createDecipheriv = crypto.createDecipheriv
