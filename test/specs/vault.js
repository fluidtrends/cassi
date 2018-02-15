const savor = require('savor')
const Vault = savor.src('Vault')
const bip38 = require('bip38')
const bip39 = require('bip39')
const keytar = require('keytar')

const mnemonic = 'blossom wish upgrade trade obtain climb below rhythm border manage excite volume'
const encryptedSecret = '6PYWcQMQ2jBavhA5F2qz5K2L3zXKE6K8mq6AtyLE5kXZAPmD3zPvCrodRe'
const secret = '70cc51a3075de2f430e028054ee9e34e8c8d2d8f0dfebc69e069da69fc8af274'

savor

.add('detect a non-existent vault', (context, done) => {
  const vault = new Vault({ root: context.dir })
  context.expect(vault.exists).to.be.false
  done()
})

.add('create a new vault in the default location on a windows machine', (context, done) => {
  const platform = Object.getOwnPropertyDescriptor(process, 'platform')
  Object.defineProperty(process, 'platform', { value: 'win32' })
  Object.defineProperty(process.env, 'USERPROFILE', { value: context.dir })

  const vault = new Vault({})
  savor.promiseShouldSucceed(vault.create('test'), done, (vault) => {
    context.expect(vault).to.exist
    Object.defineProperty(process, 'platform', platform)
  })
})

.add('create a new vault in the default location on a non-windows machine', (context, done) => {
  const platform = Object.getOwnPropertyDescriptor(process, 'platform')
  Object.defineProperty(process, 'platform', { value: 'darwin' })
  Object.defineProperty(process.env, 'HOME', { value: context.dir })

  const vault = new Vault({})
  savor.promiseShouldSucceed(vault.create('test'), done, (vault) => {
    context.expect(vault).to.exist
    Object.defineProperty(process, 'platform', platform)
  })
})

.add('create a new vault in the default location on a non-windows machine', (context, done) => {
  const platform = process.platform
  process.platform = 'darwin'

  const homeEnv = ((platform === 'win32') ? 'USERPROFILE' : 'HOME')
  const home = process.env[homeEnv]
  process.env[homeEnv] = context.dir

  const vault = new Vault()
  savor.promiseShouldSucceed(vault.create('test'), done, (vault) => {
    context.expect(vault).to.exist
    process.platform = platform
    process.env[homeEnv] = home
  })
})

.add('do not re-create an existing vault', (context, done) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldSucceed(vault.create('test'), () => {}, (vault) => {
    context.expect(vault).to.exist
    savor.promiseShouldFail(vault.create('test'), done, (error) => {
      context.expect(error).to.exist
    })
  })
})

.add('lock an open vault with a valid password', (context, done) => {
  const vault = new Vault({ root: context.dir })
  context.stub(bip39, 'entropyToMnemonic', () => mnemonic)
  context.stub(bip38, 'encrypt', () => encryptedSecret)
  context.stub(keytar, 'setPassword', () => encryptedSecret)

  savor.promiseShouldSucceed(vault.create('test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), done, (vault) => {
      context.expect(vault).to.exist
      bip39.entropyToMnemonic.restore()
      bip38.encrypt.restore()
      keytar.setPassword.restore()
    })
  })
})

.add('fail to lock a locked vault', (context, done) => {
  const vault = new Vault({ root: context.dir })
  context.stub(bip39, 'entropyToMnemonic', () => mnemonic)
  context.stub(bip38, 'encrypt', () => encryptedSecret)
  context.stub(keytar, 'setPassword', () => encryptedSecret)

  savor.promiseShouldSucceed(vault.create('test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), () => {}, () => {
      savor.promiseShouldFail(vault.lock('test'), done, (error) => {
        context.expect(error).to.exist
        bip39.entropyToMnemonic.restore()
        bip38.encrypt.restore()
        keytar.setPassword.restore()
      })
    })
  })
})

.add('fail to lock a corrupt vault', (context, done) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldFail(vault.lock('test'), done, (error) => {
    context.expect(error).to.exist
  })
})

.add('fail to unlock a corrupt vault', (context, done) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldFail(vault.unlock('test'), done, (error) => {
    context.expect(error).to.exist
  })
})

.add('read and write some secure vault data', (context, done) => {
  const vault = new Vault({ root: context.dir, name: 'test-vault' })
  savor.promiseShouldSucceed(vault.create('test'), done, (vault) => {
    vault.write('testing', 'it works')
    context.expect(vault.name).to.equal('test-vault')
    context.expect(vault.read('name')).to.equal('test-vault')
    context.expect(vault).to.exist
    context.expect(vault.read('testing')).to.equal('it works')
  })
})

.add('fail to unlock a unlocked vault', (context, done) => {
  const vault = new Vault({ root: context.dir })
  context.stub(keytar, 'setPassword', () => encryptedSecret)
  context.stub(keytar, 'findCredentials', (data) => Promise.resolve([{ account: 'default', password: encryptedSecret }]))
  context.stub(bip38, 'decrypt', () => ({ privateKey: Buffer.alloc(32, secret) }))

  savor.promiseShouldSucceed(vault.create('test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), () => {}, () => {
      savor.promiseShouldSucceed(vault.unlock('test'), () => {}, () => {
        savor.promiseShouldFail(vault.unlock('test'), done, (error) => {
          context.expect(error).to.exist
          keytar.setPassword.restore()
          keytar.findCredentials.restore()
          bip38.decrypt.restore()
        })
      })
    })
  })
})

.run('Vault')
