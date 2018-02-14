const crypto = require('crypto')
const bcrypt = require('bcrypt')
const bip38 = require('bip38')

class Key {
  constructor (options) {
    this._options = options
  }

  get options () {
    return this._options
  }

  get password () {
    return this.options.password
  }

  generate () {
    const data = Buffer.alloc(32, crypto.createHmac('sha256', this.password).digest('binary'))
    return Promise.resolve(data)
  }
}

module.exports = Key
