const path = require('path')
const utils = require('./utils')
const fs = require('fs-extra')
const Lock = require('./Lock')
const FileSync = require('lowdb/adapters/FileSync')
const low = require('lowdb')

class Vault {
  constructor (options) {
    this._options = Object.assign({}, options)
    this._id = utils.newId()
    this._lock = new Lock()
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

  get index () {
    return `${this.options.index || 'index'}.json`
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
    if (this.exists) {
      return Promise.reject(new Error('Vault already exists'))
    }

    return new Promise((resolve, reject) => {
      // Initialize the empty location
      fs.mkdirsSync(this.dir)

      this._lock.create(password).then(hash => {
        const vaultIndexFile = path.join(this.dir, this.index)
        const adapter = new FileSync(vaultIndexFile)
        this._db = low(adapter)
        this._db.defaults({ name: this.name, id: this.id, lock: hash })
            .write()
        resolve(this)
      })
    })
  }

  lock (password) {
    return this._lock.close(this.dir, password).then(() => this)
  }

  unlock (password) {
    return this._lock.open(this.dir, password).then(() => this)
  }
}

module.exports = Vault
