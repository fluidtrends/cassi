import path from 'path'
import fs from 'fs-extra'
import FileSync from 'lowdb/adapters/FileSync'
import * as utils from './utils'

import low, { 
  LowdbSync 
} from 'lowdb'

import {
  IVault,
  ICipher,
  EncryptedData,
  Cipher
} from '.'

export class Vault implements IVault {
  protected readonly _options: any;
  protected readonly _root: string;
  protected readonly _cipher: ICipher;
  protected _db?: LowdbSync<any>;

  constructor (options?: any) {
    this._options = options
    this._root = path.resolve(this._options.root || path.join(utils.homeDir(), '.cassi'))
    this._cipher = new Cipher(this)
  }

  get options () {
    return this._options
  }

  get exists () {
    return fs.existsSync(this.dir)
  }

  get name () {
    return this.options ? this.options.name : 'vault'
  }
  
  get root () {
    return this._root
  }

  get dir () {
    return path.join(this.root, `${this.name}`)
  }

  get cipher () {
    return this._cipher
  }

  get service() {
    return this.options.service || 'cassi'
  }

  write (key: string, value: any) {
    return this._db?.set(key, value).write()
  }

  read (key: string) {
    return this._db?.get(key).value()
  }

  get id () {
    return this.isLocked ? '' : this.read('id')
  }

  get isLocked () {
    return fs.existsSync(path.join(this.dir, `.lock`))
  }

  async _verify (lockFile: string, indexFile: string, close: boolean) {
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

  async lock (password: string) {
    const indexFile = path.join(this.dir, `index.json`)
    const lockFile = path.join(this.dir, `.lock`)
    const vault: IVault = this

    return this._verify(lockFile, indexFile, true)
                .then(() => new Promise<EncryptedData>((resolve, reject) => {
                  const data = fs.readFileSync(indexFile, 'utf8')
                  this._cipher.encrypt(data, `${password}`)
                              .then((enc) => resolve(enc))
                              .catch((e) => {
                                console.log("DDDDD",e)
                                reject(new Error('Invalid password'))
                              })
                            }))
                .then(([payload, mnemonic]) => fs.writeFile(lockFile, payload, 'utf8')
                    .then(() => fs.remove(indexFile))
                    .then(() => ({ vault, mnemonic })))
  }

  async unlock (password: string) {
    const indexFile = path.join(this.dir, `index.json`)
    const lockFile = path.join(this.dir, `.lock`)
    const vault: IVault = this

    return this._verify(lockFile, indexFile, false)
               .then(() => new Promise((resolve, reject) => {
                  const data = fs.readFileSync(lockFile, 'utf8')
                  this._cipher.decrypt(data, `${password}`)
                      .then((dec) => resolve(dec))
                      .catch(() => reject(new Error('Invalid password')))
                }))
               .then((dec) => {
                 fs.writeFile(indexFile, dec, 'utf8')
               })
               .then(() => fs.remove(lockFile))
               .then(() => ({ vault }))
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
}