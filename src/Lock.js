const crypto = require('crypto')
const bip38 = require('bip38')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const wif = require('wif')
const keytar = require('keytar')

class Lock {
  open (password) {
    return this.exists()
               .then((data) => this.load(data, password))
               .catch(() => this.create(password))
  }

  exists () {
    return keytar.findCredentials('cassi')
                 .then((data) => {
                   if (!data || data.length === 0) {
                     throw new Error('No credentials')
                   }
                   return data[0]
                 })
  }

  load (data, password) {
    return new Promise((resolve, reject) => {
      const decryptedSecret = bip38.decrypt(data.password, password)
      const key = Buffer.alloc(32, decryptedSecret.privateKey)
      resolve(key)
    })
  }

  create (password) {
    return new Promise((resolve, reject) => {
      const entropy = crypto.randomBytes(16)
      const mnemonic = bip39.entropyToMnemonic(entropy)
      const seed = bip39.mnemonicToSeed(mnemonic)
      const node = bitcoin.HDNode.fromSeedBuffer(seed)
      const account = node.derivePath("m/44'/0'/0'")
      const keyPair = account.derivePath('0/0').keyPair
      const secret = keyPair.toWIF()
      const decodedSecret = wif.decode(secret)
      const encryptedSecret = bip38.encrypt(decodedSecret.privateKey, decodedSecret.compressed, password)
      const key = Buffer.alloc(32, decodedSecret.privateKey)

      keytar.setPassword('cassi', 'default', encryptedSecret)

      resolve(key)
    })
  }
}

module.exports = Lock
