const path = require('path')
const fs = require('fs-extra')
const FileSync = require('lowdb/adapters/FileSync')
const low = require('lowdb')
const utils = require('./utils')
const Cipher = require('./Cipher')

class Vault {
  constructor (options) {
    this._options = Object.assign({}, options)
    this._root = path.resolve(this._options.root || path.join(utils.homeDir(), '.cassi'))
    this._cipher = new Cipher(this)
  }

  get options () {
    return this._options
  }

  get service() {
    return this.options.service || 'cassi'
  }

  get root () {
    return this._root
  }

  get name () {
    return this.options ? this.options.name : 'vault'
  }

  get dir () {
    return path.join(this.root, `${this.name}`)
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

  initialize () {
    return new Promise((resolve, reject) => {
      this.exists || fs.mkdirsSync(this.dir)

      if (this.isLocked) {
        resolve({ vault: this })
        return
      }

      const vaultIndexFile = path.join(this.dir, 'index.json')
      const adapter = new FileSync(vaultIndexFile)

      this._db = low(adapter)
      this.read('id') || this._db.defaults({ name: this.name, id: utils.newId() }).write()

      resolve({ vault: this })
    })
  }

  get id () {
    return this.isLocked ? '' : this.read('id')
  }

  get isLocked () {
    return fs.existsSync(path.join(this.dir, `.lock`))
  }

  lock (password) {
    const indexFile = path.join(this.dir, `index.json`)
    const lockFile = path.join(this.dir, `.lock`)

    return this._verify(lockFile, indexFile, true)
                .then(() => {
                  var data = fs.readFileSync(indexFile, 'utf8')
                  return this._cipher.encrypt(data, password)
                })
                .then(({ payload, mnemonic }) =>
                  fs.writeFile(lockFile, payload, 'utf8')
                    .then(() => fs.remove(indexFile))
                    .then(() => ({ vault: this, mnemonic }))
                )
  }

  unlock (password) {
    const indexFile = path.join(this.dir, `index.json`)
    const lockFile = path.join(this.dir, `.lock`)

    return this._verify(lockFile, indexFile)
               .then(() => {
                 let data = fs.readFileSync(lockFile, 'utf8')
                 return this._cipher.decrypt(data, password)
               })
               .then((dec) => {
                 fs.writeFile(indexFile, dec, 'utf8')
               })
               .then(() => fs.remove(lockFile))
               .then(() => ({ vault: this }))
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
