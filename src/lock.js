const bcrypt = require('bcrypt')
const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')

const lock = { hash, create, open, close }

function create (password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10).then((hash) => {
      resolve(hash)
    })
  })
}

function hash (password) {
  return Buffer.alloc(32, crypto.createHmac('sha256', password).digest('binary'))
}

function open (dir, password) {
  const indexFile = path.join(dir, `index.json`)
  const lockFile = path.join(dir, `.lock`)

  if (fs.existsSync(indexFile)) {
    return Promise.reject(new Error('Already open'))
  }

  if (!fs.existsSync(lockFile)) {
    return Promise.reject(new Error('Missing lock'))
  }

  var encryptedData = fs.readFileSync(lockFile, 'utf8')
  var [ivHex, data, hash] = encryptedData.split('$')
  var dataHash = crypto.createHmac('sha256', data).digest('hex')

  if (dataHash !== hash) {
    return Promise.reject(new Error('Corrupt data'))
  }

  var iv = Buffer.from(ivHex, 'hex')
  var key = lock.hash(password)
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)

  try {
    var decrypted = decipher.update(data, 'base64', 'utf8') + decipher.final('utf8')
    decrypted = JSON.parse(decrypted, null, 2)

    const verify = bcrypt.compare(password, decrypted.lock)

    return verify.then((result) => {
      if (!result) {
        throw new Error('Invalid password')
      }

      delete decrypted._lock
      decrypted = JSON.stringify(decrypted)

      return fs.writeFile(indexFile, decrypted, 'utf8')
               .then(fs.remove(lockFile))
    })
  } catch (e) {
    return Promise.reject(new Error('Invalid password'))
  }
}

function close (dir, password) {
  const indexFile = path.join(dir, `index.json`)
  const lockFile = path.join(dir, `.lock`)

  if (fs.existsSync(lockFile)) {
    return Promise.reject(new Error('Already locked'))
  }

  if (!fs.existsSync(indexFile)) {
    return Promise.reject(new Error('Missing index'))
  }

  var data = fs.readFileSync(indexFile, 'utf8')
  data = JSON.parse(data, null, 2)

  const verify = bcrypt.compare(password, data.lock)
  return verify.then((result) => {
    if (!result) {
      throw new Error('Invalid password')
    }

    var key = lock.hash(password)
    const iv = crypto.randomBytes(16)
    const ivHex = iv.toString('hex')
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

    data = Object.assign({}, data, {_lock: { iv: ivHex }})
    data = JSON.stringify(data)
    data = cipher.update(data, 'utf8', 'base64') + cipher.final('base64')
    var dataHash = crypto.createHmac('sha256', data).digest('hex')
    data = `${ivHex}$${data}$${dataHash}`

    return fs.writeFile(lockFile, data, 'utf8')
             .then(fs.remove(indexFile))
  })
}

module.exports = lock
