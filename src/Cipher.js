const crypto = require('crypto')
const Lock = require('./Lock')

class Cipher {
  constructor (name) {
    this._lock = new Lock(name)
  }

  get lock () {
    return this._lock
  }

  encrypt (text, password) {
    return this.lock.open(password).then(({ key, mnemonic }) => {
      const iv = crypto.randomBytes(16)
      const salt = crypto.randomBytes(64)
      const k = crypto.pbkdf2Sync(key, salt, 2145, 32, 'sha512')
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
      const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
      const tag = cipher.getAuthTag()
      const payload = Buffer.concat([salt, iv, tag, encrypted]).toString('base64')
      return Object.assign({}, { payload }, mnemonic && { mnemonic })
    })
  }

  decrypt (encdata, password) {
    return this.lock.open(password).then(({ key, mnemonic }) => {
      const bData = Buffer.from(encdata, 'base64')

      const salt = bData.slice(0, 64)
      const iv = bData.slice(64, 80)
      const tag = bData.slice(80, 96)
      const text = bData.slice(96)

      const k = crypto.pbkdf2Sync(key, salt , 2145, 32, 'sha512')
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
      decipher.setAuthTag(tag)

      const data = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8')
      return data
    })
  }

}

module.exports = Cipher
