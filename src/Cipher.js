const crypto = require('crypto')
const keytar = require('keytar')
const bip38 = require('bip38')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const wif = require('wif')

class Cipher {
  constructor (vault) {
    this._vault = vault
  }

  get vault() {
    return this._vault
  }

  saveKey(name, key) {
    keytar.setPassword(this.vault.service, name, key)
  }

  getKey(name) {
    keytar.getPassword(this.vault.service, name)
  }

  createMasterKey(password) {
    return new Promise((resolve) => {
      const mnemonic = bip39.entropyToMnemonic(crypto.randomBytes(16))
      const node = bitcoin.HDNode.fromSeedBuffer(bip39.mnemonicToSeed(mnemonic))
      const { keyPair } = node.derivePath("m/44'/0'/0'").derivePath('0/0')
      const { privateKey, compressed } = wif.decode(keyPair.toWIF())
      const key = bip38.encrypt(privateKey, compressed, password)
  
      this.saveKey('master', key)
  
      resolve({ key: privateKey, mnemonic })
    })
  }

  findMasterKey (password) {
    return new Promise((resolve) => {
      keytar.getPassword(this.vault.service, 'master')
                 .then((data) => resolve(bip38.decrypt(data, password).privateKey))
                 .catch(() => resolve())
    })
    .then((key) => key ?  { key, mnemonic: false } : this.createMasterKey(password))
  }

  encrypt (text, password) {
    return this.findMasterKey(password).then(({ key, mnemonic }) => {
      const iv = crypto.randomBytes(16)
      const salt = crypto.randomBytes(64)
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
      const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
      const tag = cipher.getAuthTag()
      const payload = Buffer.concat([salt, iv, tag, encrypted]).toString('base64')
      
      return Object.assign({}, { payload }, mnemonic && { mnemonic })
    })
  }

  decrypt (encdata, password) {
    return this.findMasterKey(password).then(({ key }) => {
      const bData = Buffer.from(encdata, 'base64')

      const iv = bData.slice(64, 80)
      const tag = bData.slice(80, 96)
      const text = bData.slice(96)

      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
      decipher.setAuthTag(tag)

      return decipher.update(text, 'binary', 'utf8') + decipher.final('utf8')
    })
  }

}

module.exports = Cipher
