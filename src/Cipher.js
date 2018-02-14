const crypto = require('crypto')
const Lock = require('./Lock')

class Cipher {
  constructor () {
    this._lock = new Lock()
  }

  get lock () {
    return this._lock
  }

  encrypt (inputData, password) {
    return this.lock.open(password).then((key) => {
      const iv = crypto.randomBytes(12)
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

      let data = cipher.update(inputData, 'utf8', 'base64')
      data += cipher.final('base64')
      const auth = cipher.getAuthTag()
      return { data, iv: iv.toString('hex'), auth: auth.toString('hex') }
    })
  }

  decrypt (inputData, password) {
    return this.lock.open(password).then((key) => {
      const input = JSON.parse(inputData, null, 2)
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(input.iv, 'hex'))
      decipher.setAuthTag(Buffer.from(input.auth, 'hex'))
      let data = decipher.update(input.data, 'base64', 'utf8')
      data += decipher.final('utf8')
      return data
    })
  }
}

module.exports = Cipher
