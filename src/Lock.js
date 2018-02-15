const crypto = require('crypto')
const bip38 = require('bip38')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const wif = require('wif')

class Lock {
  open (password) {
    return this.exists()
               .then(() => this.load(password))
               .catch(() => this.create(password))
  }

  exists () {
    return new Promise((resolve, reject) => {
      // resolve()
      reject(new Error('Not found'))
    })
  }

  load (password) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHmac('sha256', password).digest('binary')
      const data = Buffer.alloc(32, hash)
      resolve(data)
    })
  }

  create (password) {
    // return new Promise((resolve, reject) => {
      // const entropy = crypto.randomBytes(16)
      // const mnemonic = bip39.entropyToMnemonic(entropy)
      // const key = this.createFromMnemonic(mnemonic)
      // return this.encryptKey(key, password)
    return this.load(password)
      // resolve()
    // })
  }

  // createNewMnemonic () {
  //   const entropy = crypto.randomBytes(16)
  //   return bip39.entropyToMnemonic(entropy)
  // }
  //
  // createFromMnemonic (mnemonic) {
  //   const seed = bip39.mnemonicToSeed(mnemonic)
  //   const node = bitcoin.HDNode.fromSeedBuffer(seed)
  //   const account = node.derivePath("m/44'/0'/0'")
  //   const key = account.derivePath('0/0').keyPair
  //
  //   return key.toWIF()
  // }
  //
  // encrypt (password) {
  //   const decodedKey = wif.decode(key)
  //   return bip38.encrypt(decodedKey.privateKey, decodedKey.compressed, password, (status) => {
  //       // console.log(status.percent)
  //   })
  // }
}

module.exports = Lock
