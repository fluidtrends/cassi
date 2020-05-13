import {
  ICipher,
  IVault,
  Crypto,
  MasterKey,
  EncryptedData
} from '.'

export class Cipher implements ICipher {
  protected _vault: IVault;

  constructor (vault: IVault) {
    this._vault = vault
  }

  get vault() {
    return this._vault
  }

  saveKey(name: string, key: string) {
    Crypto.setPassword(this.vault.service, name, key)
  }

  getKey(name: string) {
    Crypto.getPassword(this.vault.service, name)
  }

  async createMasterKey(password: string) {
    return new Promise<MasterKey>((resolve) => {
      const mnemonic = Crypto.entropyToMnemonic(Crypto.randomBytes(16)) as string
      const node = Crypto.fromSeed(Crypto.mnemonicToSeedSync(mnemonic))
      const nodePath = node.derivePath("m/44'/0'/0'").derivePath('0/0')
      const { privateKey, compressed } = Crypto.decode(nodePath.toWIF(), 128)
      const key = Crypto.encrypt(privateKey, compressed, password)
 
      this.saveKey('master', key)
      resolve([privateKey, mnemonic])
    })
  }

  async findMasterKey (password: string) {
    return Crypto.getPassword(this.vault.service, 'master')
                 .then((data) => data ? Crypto.decrypt(data, password).privateKey : null)
                 .then((key) => {
                    return key ? [key!,undefined] as MasterKey : this.createMasterKey(password)
                 })
  }

  async encrypt (text: string, password: string) {
    return this.findMasterKey(password).then(([key, mnemonic]) => {
      const iv = Crypto.randomBytes(16)
      const salt = Crypto.randomBytes(64)
      const cipher = Crypto.createCipheriv('aes-256-gcm', key, iv)
      const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
      const tag = cipher.getAuthTag()
      const payload = Buffer.concat([salt, iv, tag, encrypted]).toString('base64')
      
      return [payload, mnemonic] as EncryptedData
    })
  }

  async decrypt (encdata: string, password: string) {
    return this.findMasterKey(password).then(([key]) => {
      const bData = Buffer.from(encdata, 'base64')

      const iv = bData.slice(64, 80)
      const tag = bData.slice(80, 96)
      const text = bData.slice(96)

      const decipher = Crypto.createDecipheriv('aes-256-gcm', key, iv)
      decipher.setAuthTag(tag)

      return decipher.update(text, 'binary', 'utf8') + decipher.final('utf8')
    })
  }
}
