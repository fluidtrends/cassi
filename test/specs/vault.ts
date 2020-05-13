import savor, {
  Context,
  Completion
} from 'savor'

import {
  Vault,
  Crypto
} from '../../src'

const mnemonic = 'blossom wish upgrade trade obtain climb below rhythm border manage excite volume'
const encryptedSecret = '6PYWcQMQ2jBavhA5F2qz5K2L3zXKE6K8mq6AtyLE5kXZAPmD3zPvCrodRe'
const secret = '70cc51a3075de2f430e028054ee9e34e8c8d2d8f0dfebc69e069da69fc8af274'

savor

.add('detect a non-existent vault', (context: Context, done: Completion) => {
  const vault = new Vault({ root: context.dir })
  context.expect(vault.exists).to.be.false
  done()
})

.add('fail to lock a corrupt vault', (context: Context, done: Completion) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldFail(vault.lock('test'), done, (error) => {
    context.expect(error).to.exist
  })
})

.add('fail to unlock a corrupt vault', (context: Context, done: Completion) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldFail(vault.unlock('test'), done, (error) => {
    context.expect(error).to.exist
  })
})

.add('create a new vault in the default location on a windows machine', (context: Context, done: Completion) => {
  const platform = Object.getOwnPropertyDescriptor(process, 'platform')
  Object.defineProperty(process, 'platform', { value: 'win32' })
  Object.defineProperty(process.env, 'USERPROFILE', { value: context.dir })

  const vault = new Vault({})
  savor.promiseShouldSucceed(vault.initialize(), done, (result) => {
    context.expect(result.vault).to.exist
    Object.defineProperty(process, 'platform', platform!)
  })
})

.add('create a new vault in the default location on a non-windows machine', (context: Context, done: Completion) => {
  const platform = Object.getOwnPropertyDescriptor(process, 'platform')
  Object.defineProperty(process, 'platform', { value: 'darwin' })
  Object.defineProperty(process.env, 'HOME', { value: context.dir })

  const vault = new Vault({})
  savor.promiseShouldSucceed(vault.initialize(), done, (result) => {
    context.expect(result.vault).to.exist
    Object.defineProperty(process, 'platform', platform!)
  })
})

.add('lock an open vault with a valid password', (context: Context, done: Completion) => {
  const vault = new Vault({ root: context.dir })
  const s1 = context.stub(Crypto, 'entropyToMnemonic').callsFake(() => mnemonic)
  const s2 = context.stub(Crypto, 'encrypt').callsFake(() => "ddddencryptedSecret")
  const s3 = context.stub(Crypto, 'setPassword').callsFake(() => ({}))
  const s4 = context.stub(Crypto, 'getPassword').callsFake(() => Promise.resolve())

  savor.promiseShouldSucceed(vault.initialize(), () => {}, () => {
    savor.promiseShouldSucceed(vault.lock('test'), done, (result) => {
      context.expect(result.vault).to.exist
      context.expect(result.mnemonic).to.equal(mnemonic)
      s1.restore()
      s2.restore()
      s3.restore()
      s4.restore()
    })
  })
})

.add('fail to lock a locked vault', (context: Context, done: Completion) => {
  const vault = new Vault({ root: context.dir })
  const s1 = context.stub(Crypto, 'entropyToMnemonic').callsFake(() => mnemonic)
  const s2 = context.stub(Crypto, 'encrypt').callsFake(() => encryptedSecret)
  const s3 = context.stub(Crypto, 'setPassword').callsFake(() => ({}))

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

.add('fail to unlock a unlocked vault', (context: Context, done: Completion) => {
  const vault = new Vault({ root: context.dir })
  const s0 = context.stub(Crypto, 'encrypt').callsFake(() => encryptedSecret)
  const s1 = context.stub(Crypto, 'decrypt').callsFake(() => ({ privateKey: Buffer.alloc(32, secret) }))
  const s2 = context.stub(Crypto, 'setPassword').callsFake(() => ({}))
  const s3 = context.stub(Crypto, 'getPassword').callsFake(() => Promise.resolve())
  const s4 = context.stub(Crypto, 'entropyToMnemonic').callsFake(() => mnemonic)

  savor.promiseShouldSucceed(vault.initialize(), () => {}, () => {
    savor.promiseShouldSucceed(vault.lock('test'), () => {}, () => {
      savor.promiseShouldSucceed(vault.unlock('test'), () => {}, () => {
        savor.promiseShouldFail(vault.unlock('test'), done, (error) => {
          context.expect(error).to.exist
          s0.restore()
          s1.restore()
          s2.restore()
          s3.restore()
          s4.restore()
        })
      })
    })
  })
})

.add('read and write some secure vault data', (context: Context, done: Completion) => {
  const vault = new Vault({ root: context.dir, name: 'test-vault' })
  savor.promiseShouldSucceed(vault.initialize(), done, (result) => {
    vault.write('testing', 'it works')
    context.expect(result.vault.name).to.equal('test-vault')
    context.expect(result.vault.read('name')).to.equal('test-vault')
    context.expect(result.vault).to.exist
    context.expect(result.vault.read('testing')).to.equal('it works')
  })
})

.run('[Cassi] Vault')
