const crypto = require('crypto')
const bip38 = require('bip38')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const wif = require('wif')
const keytar = require('keytar')

class Lock {
  constructor (name) {
    this._name = name
  }

  get name () {
    return this._name
  }

  get vaultName() {
    return `${this.name}-cassi-vault`
  }

  open (password) {
    return new Promise((resolve, reject) => {
      this.exists()
          .then((data) => {
            this.load(data, password)
                .then((data) => resolve(data))
                .catch((e) => reject(e))
          })
          .catch(() => {
            this.create(password)
                .then((data) => resolve(data))
                .catch((e) => reject(e))
          })
    })
  }

  exists () {
    return keytar.findCredentials(this.vaultName)
                 .then((data) => {
                   if (!data || data.length === 0) {
                     throw new Error('No credentials')
                   }
                   return data[0]
                 })
  }

  load (data, password) {
    return new Promise((resolve, reject) => {
      try {
        const decryptedSecret = bip38.decrypt(data.password, password)
        resolve({ key: decryptedSecret.privateKey })
      } catch (e) {
        reject(new Error("Invalid password"))
      }
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

      keytar.setPassword(this.vaultName, 'default', encryptedSecret)

      resolve({ key: decodedSecret.privateKey, mnemonic })
    })
  }
}

module.exports = Lock
