const path = require('path')
const savor = require('savor')
const fs = require('fs-extra')
const Vault = savor.src('Vault')

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

.add('fail to lock an open vault with an invalid password', (context, done) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldSucceed(vault.create('test'), () => {}, (data) => {
    savor.promiseShouldFail(vault.lock('test2'), done, (error) => {
      context.expect(error).to.exist
    })
  })
})

.add('lock an open vault with a valid password', (context, done) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldSucceed(vault.create('test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), done, (vault) => {
      context.expect(vault).to.exist
    })
  })
})

.add('fail to lock a locked vault', (context, done) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldSucceed(vault.create('test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), () => {}, () => {
      savor.promiseShouldFail(vault.lock('test'), done, (error) => {
        context.expect(error).to.exist
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

.add('fail to unlock a locked vault with an invalid password', (context, done) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldSucceed(vault.create('test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), () => {}, () => {
      savor.promiseShouldFail(vault.unlock('test2'), done, (error) => {
        context.expect(error).to.exist
      })
    })
  })
})

.add('unlock a locked vault with an valid password', (context, done) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldSucceed(vault.create('test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), () => {}, () => {
      savor.promiseShouldSucceed(vault.unlock('test'), done, (vault) => {
        context.expect(vault).to.exist
      })
    })
  })
})

.add('fail to unlock a unlocked vault', (context, done) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldSucceed(vault.create('test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), () => {}, () => {
      savor.promiseShouldSucceed(vault.unlock('test'), () => {}, () => {
        savor.promiseShouldFail(vault.unlock('test'), done, (error) => {
          context.expect(error).to.exist
        })
      })
    })
  })
})

.add('fail to unlock a vault with a corrupt signature', (context, done) => {
  const vault = new Vault({ root: context.dir })
  savor.promiseShouldSucceed(vault.create('test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('test'), () => {}, () => {
      const lockFile = path.join(vault.dir, '.lock')
      const lock = fs.readFileSync(lockFile, 'utf8')
      fs.writeFileSync(lockFile, `${lock}+dummy`, 'utf8')
      savor.promiseShouldFail(vault.unlock('test'), done, (error) => {
        context.expect(error).to.exist
      })
    })
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

.run('Vault')
