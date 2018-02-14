const crypto = require('crypto')
const Key = require('./Key')

class Cipher {
  constructor (options) {
    this._options = options
    this._key = new Key({ password: this.options.password })
    delete this._options.password
  }

  get options () {
    return this._options
  }

  get key () {
    return this._key
  }

  encrypt (inputData) {
    return this.key.generate().then((key) => {
      const iv = crypto.randomBytes(12)
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

      let data = cipher.update(inputData, 'utf8', 'base64')
      data += cipher.final('base64')
      const auth = cipher.getAuthTag()
      return { data, iv: iv.toString('hex'), auth: auth.toString('hex') }
    })
  }

  decrypt (inputData) {
    return this.key.generate().then((key) => {
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
