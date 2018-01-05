const zlib = require('zlib')
const fs = require('fs-extra')
const homedir = require('homedir')
const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')
const vaultLock = require('./lock')

const vault = { dir, key, root, exists, create, lock, unlock }

function root (name) {
  return homedir()
}

function dir (name) {
  return path.join(vault.root(), name)
}

function exists (name) {
  const dir = vault.dir(name)
  return fs.existsSync(dir)
}

function key (password) {
  return vaultLock.create(password)
}

function create (name, password) {
  if (vault.exists(name)) {
    return
  }

  fs.mkdirSync(vault.dir(name))

  const vaultIndexFile = path.join(vault.dir(name), `index.json`)
  const adapter = new FileSync(vaultIndexFile)
  const db = low(adapter)

  return new Promise((resolve, reject) => {
    vaultLock.create(password).then(hash => {
      db.defaults({ name, lock: hash })
        .write()
      resolve(db)
    })
  })
}

function lock (name, password) {
  return vaultLock.close(vault.dir(name), password)
}

function unlock (name, password) {
  return vaultLock.open(vault.dir(name), password)
}

module.exports = vault
