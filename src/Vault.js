const path = require('path')
const fs = require('fs-extra')
const bcrypt = require('bcrypt')
const FileSync = require('lowdb/adapters/FileSync')
const low = require('lowdb')
const utils = require('./utils')
const Cipher = require('./Cipher')

class Vault {
  constructor (options) {
    this._options = Object.assign({}, options)
    this._id = utils.newId()
    this._root = path.resolve(this._options.root || path.join(utils.homeDir(), '.cassi'))
  }

  get id () {
    return this._id
  }

  get options () {
    return this._options
  }

  get root () {
    return this._root
  }

  get name () {
    return this.options.name || 'vault'
  }

  get dir () {
    return path.join(this.root, `${this.name}-${this.id}`)
  }

  get exists () {
    return fs.existsSync(this.dir)
  }

  write (key, value) {
    return this._db.set(key, value).write()
  }

  read (key) {
    return this._db.get(key).value()
  }

  create (password) {
    return new Promise((resolve, reject) => {
      if (this.exists) {
        reject(new Error('Vault already exists'))
        return
      }

      // Initialize the empty location
      fs.mkdirsSync(this.dir)

      const vaultIndexFile = path.join(this.dir, 'index.json')
      const adapter = new FileSync(vaultIndexFile)
      this._db = low(adapter)
      this._db.defaults({ name: this.name, id: this.id }).write()
      resolve(this)
    })
  }

  lock (password) {
    const indexFile = path.join(this.dir, `index.json`)
    const lockFile = path.join(this.dir, `.lock`)
    const cipher = new Cipher({ password })

    return this._verify(lockFile, indexFile, true)
                .then(() => {
                  var data = fs.readFileSync(indexFile, 'utf8')
                  return cipher.encrypt(data)
                })
                .then((enc) => fs.writeFile(lockFile, JSON.stringify(enc), 'utf8'))
                .then(() => fs.remove(indexFile))
                .then(() => this)
  }

  unlock (password) {
    const indexFile = path.join(this.dir, `index.json`)
    const lockFile = path.join(this.dir, `.lock`)
    const cipher = new Cipher({ password })

    return this._verify(lockFile, indexFile)
               .then(() => {
                 let data = fs.readFileSync(lockFile, 'utf8')
                 return cipher.decrypt(data)
               })
               .then((dec) => fs.writeFile(indexFile, JSON.stringify(dec), 'utf8'))
               .then(() => fs.remove(lockFile))
               .then(() => this)
  }

  _verify (lockFile, indexFile, close) {
    return new Promise((resolve, reject) => {
      if (close && fs.existsSync(lockFile)) {
        reject(new Error('Already locked'))
        return
      }

      if (close && !fs.existsSync(indexFile)) {
        reject(new Error('Missing index'))
        return
      }

      if (!close && fs.existsSync(indexFile)) {
        reject(new Error('Already open'))
        return
      }

      if (!close && !fs.existsSync(lockFile)) {
        reject(new Error('Missing lock'))
        return
      }

      resolve()
    })
  }
}

module.exports = Vault
