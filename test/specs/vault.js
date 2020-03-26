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

.add('create a new vault in the default location on a windows machine', (context, done) => {
  const platform = Object.getOwnPropertyDescriptor(process, 'platform')
  Object.defineProperty(process, 'platform', { value: 'win32' })
  Object.defineProperty(process.env, 'USERPROFILE', { value: context.dir })

  const vault = new Vault({})
  savor.promiseShouldSucceed(vault.initialize(), done, (result) => {
    context.expect(result.vault).to.exist
    Object.defineProperty(process, 'platform', platform)
  })
})

.add('create a new vault in the default location on a non-windows machine', (context, done) => {
  const platform = Object.getOwnPropertyDescriptor(process, 'platform')
  Object.defineProperty(process, 'platform', { value: 'darwin' })
  Object.defineProperty(process.env, 'HOME', { value: context.dir })

  const vault = new Vault({})
  savor.promiseShouldSucceed(vault.initialize(), done, (result) => {
    context.expect(result.vault).to.exist
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
  savor.promiseShouldSucceed(vault.initialize(), done, (result) => {
    context.expect(result.vault).to.exist
    process.platform = platform
    process.env[homeEnv] = home
  })
})

.add('lock an open vault with a valid password', (context, done) => {
  const vault = new Vault({ root: context.dir })
  const s1 = context.stub(bip39, 'entropyToMnemonic').callsFake(() => mnemonic)
  const s2 = context.stub(bip38, 'encrypt').callsFake(() => encryptedSecret)
  const s3 = context.stub(keytar, 'setPassword').callsFake(() => ({}))

  savor.promiseShouldSucceed(vault.initialize(), () => {}, () => {
    savor.promiseShouldSucceed(vault.lock('test'), done, (result) => {
      context.expect(result.vault).to.exist
      context.expect(result.mnemonic).to.equal(mnemonic)
      s1.restore()
      s2.restore()
      s3.restore()
    })
  })
})

.add('fail to lock a locked vault', (context, done) => {
  const vault = new Vault({ root: context.dir })
  const s1 = context.stub(bip39, 'entropyToMnemonic').callsFake(() => mnemonic)
  const s2 = context.stub(bip38, 'encrypt').callsFake(() => encryptedSecret)
  const s3 = context.stub(keytar, 'setPassword').callsFake(() => ({}))

  savor.promiseShouldSucceed(vault.initialize(), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), () => {}, () => {
      savor.promiseShouldFail(vault.lock('test'), done, (error) => {
        context.expect(error).to.exist
        s1.restore()
        s2.restore()
        s3.restore()
      })
    })
  })
})

.add('read and write some secure vault data', (context, done) => {
  const vault = new Vault({ root: context.dir, name: 'test-vault' })
  savor.promiseShouldSucceed(vault.initialize(), done, (result) => {
    vault.write('testing', 'it works')
    context.expect(result.vault.name).to.equal('test-vault')
    context.expect(result.vault.read('name')).to.equal('test-vault')
    context.expect(result.vault).to.exist
    context.expect(result.vault.read('testing')).to.equal('it works')
  })
})

.add('fail to unlock a unlocked vault', (context, done) => {
  const vault = new Vault({ root: context.dir })
  const s1 = context.stub(bip38, 'decrypt').callsFake(() => ({ privateKey: Buffer.alloc(32, secret) }))
  const s2 = context.stub(keytar, 'setPassword').callsFake(() => ({}))
  const s3 = context.stub(keytar, 'getPassword').callsFake(() => ({}))

  savor.promiseShouldSucceed(vault.initialize(), done, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), () => {}, () => {
      savor.promiseShouldSucceed(vault.unlock('test'), () => {}, () => {
        savor.promiseShouldFail(vault.unlock('test'), done, (error) => {
          context.expect(error).to.exist
          s1.restore()
          s2.restore()
          s3.restore()
        })
      })
    })
  })
})

.run('Vault')
