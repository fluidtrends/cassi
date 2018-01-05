const path = require('path')
const savor = require('savor')
const fs = require('fs-extra')
const vault = savor.src('vault')

savor.add('detect a non-existent vault', (context, done) => {
  vault.config.root = context.dir
  context.expect(vault.exists('test')).to.be.false
  done()
})

.add('create a new vault', (context, done) => {
  vault.config.root = context.dir
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), done, (data) => {
    context.expect(data).to.exist
  })
})

.add('do not re-create an existing vault', (context, done) => {
  vault.config.root = context.dir
  vault.create('testVault', 'test')
  vault.create('testVault', 'test')
  context.expect(vault.exists('testVault')).to.be.true
  // vault.root.restore()
  done()
})

.add('fail to lock an open vault with an invalid password', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), () => {}, (data) => {
    savor.promiseShouldFail(vault.lock('testVault', 'test2'), done, (error) => {
      context.expect(error).to.exist
      vault.root.restore()
    })
  })
})

.add('lock an open vault with a valid password', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('testVault', 'test'), done, () => {
      vault.root.restore()
    })
  })
})

.add('fail to lock a locked vault', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('testVault', 'test'), () => {}, () => {
      savor.promiseShouldFail(vault.lock('testVault', 'test'), done, (error) => {
        context.expect(error).to.exist
        vault.root.restore()
      })
    })
  })
})

.add('fail to lock a corrupt vault', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldFail(vault.lock('testVault', 'test'), done, (error) => {
    context.expect(error).to.exist
    vault.root.restore()
  })
})

.add('fail to unlock a corrupt vault', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldFail(vault.unlock('testVault', 'test'), done, (error) => {
    context.expect(error).to.exist
    vault.root.restore()
  })
})

.add('fail to unlock a locked vault with an invalid password', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('testVault', 'test'), () => {}, () => {
      savor.promiseShouldFail(vault.unlock('testVault', 'test2'), done, (error) => {
        context.expect(error).to.exist
        vault.root.restore()
      })
    })
  })
})

.add('unlock a locked vault with an valid password', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('testVault', 'test'), () => {}, () => {
      savor.promiseShouldSucceed(vault.unlock('testVault', 'test'), done, () => {
        vault.root.restore()
      })
    })
  })
})

.add('fail to unlock a unlocked vault', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('testVault', 'test'), () => {}, () => {
      savor.promiseShouldSucceed(vault.unlock('testVault', 'test'), () => {}, () => {
        savor.promiseShouldFail(vault.unlock('testVault', 'test'), done, (error) => {
          context.expect(error).to.exist
          vault.root.restore()
        })
      })
    })
  })
})

.add('fail to unlock a vault with a corrupt signature', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.lock('testVault', 'test'), () => {}, () => {
      const lockFile = path.join(vault.dir('testVault'), '.lock')
      const lock = fs.readFileSync(lockFile, 'utf8')
      fs.writeFileSync(lockFile, `${lock}+dummy`, 'utf8')
      savor.promiseShouldFail(vault.unlock('testVault', 'test'), done, (error) => {
        context.expect(error).to.exist
        vault.root.restore()
      })
    })
  })
})

.add('fail to unlock a vault with a corrupt lock', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), () => {}, (data) => {
    savor.promiseShouldSucceed(vault.key('test2'), () => {}, (hash) => {
      data.set('lock', hash)
      savor.promiseShouldSucceed(vault.lock('testVault', 'test2'), () => {}, () => {
        savor.promiseShouldFail(vault.unlock('testVault', 'test'), done, (error) => {
          context.expect(error).to.exist
          vault.root.restore()
        })
      })
    })
  })
})

.add('fail to open a locked vault', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), () => {}, () => {
    savor.promiseShouldSucceed(vault.lock('testVault', 'test'), () => {}, () => {
      savor.promiseShouldFail(vault.open('testVault'), done, (error) => {
        context.expect(error).to.exist
        vault.root.restore()
      })
    })
  })
})

.add('open an unlocked vault', (context, done) => {
  context.stub(vault, 'root', function () { return context.dir })
  savor.promiseShouldSucceed(vault.create('testVault', 'test'), () => {}, () => {
    savor.promiseShouldSucceed(vault.open('testVault'), done, (data) => {
      context.expect(data).to.exist
      context.expect(data.get('name')).to.equal('testVault')
      vault.root.restore()
    })
  })
})

.run('vault')
