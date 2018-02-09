const path = require('path')
const utils = require('./utils')
const fs = require('fs-extra')
const RSA = require('node-rsa')

class Key {
  constructor (options) {
    this._rsa = new RSA({ b: 512 })
    this._id = utils.newId()
    this._options = Object({}, options)
    this._dir = path.resolve(this._options.dir || path.join(utils.homeDir(), '.cassi', 'keys'))
  }

  get id () {
    return this._id
  }

  get name () {
    return this.options.name || 'key'
  }

  get dir () {
    return this._dir
  }

  get options () {
    return this._options
  }

  get privateFile () {
    return path.join(this.dir, `${this.name}-private.pem`)
  }

  get publicFile () {
    return path.join(this.dir, `${this.name}-public.pem`)
  }

  get exists () {
    return (fs.existsSync(this.publicFile) && fs.existsSync(this.privateFile))
  }

  create (dir, name) {
    const vaultKey = this._rsa.generateKeyPair(2048, 65537)
    const vaultKeyPrivate = vaultKey.exportKey('pkcs8-private-pem')
    const vaultKeyPublic = vaultKey.exportKey('pkcs8-public-pem')

    return Promise.all([fs.writeFile(this.privateFile, vaultKeyPrivate, 'utf8'),
      fs.writeFile(this.publicFile, vaultKeyPublic, 'utf8')])
  }
}

module.exports = Key
