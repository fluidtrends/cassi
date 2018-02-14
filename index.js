const Vault = require('./src/Vault')
const crypto = require('crypto')
const aes = require('./src/aes')

const KEY = Buffer.alloc(32, crypto.createHmac('sha256', 'hello').digest('binary'))

// const aesCipher = aes(KEY)
//
// const { encrypted, iv, authTag } = aesCipher.encrypt('hello, world')
// const decrypted = aesCipher.decrypt(encrypted, iv, authTag)
//
// const ivHex = iv.toString('hex')
// const authTagHex = authTag.toString('hex')
//
// const iv2 = Buffer.from(ivHex, 'hex')
// const authTag2 = Buffer.from(authTagHex, 'hex')
// const decrypted2 = aesCipher.decrypt(encrypted, iv2, authTag2)
//
// console.log(decrypted)
// console.log(decrypted2)

module.export = { Vault }
