<p align="center">
<img src="https://raw.githubusercontent.com/idancali/cassi/master/logo.png" width="256px">
</p>

<h1 align="center"> CASSI </h1>
<h3 align="center"> Cryptographic Asymmetric Secure Storage Infrastructure </h3>

<p align="center">
    <a href="https://www.npmjs.com/package/cassi"> <img src="https://img.shields.io/npm/v/cassi.svg"> </a>
    <a href="https://circleci.com/gh/idancali/cassi"> <img src="https://circleci.com/gh/idancali/cassi.svg?style=svg"> </a>
    <a href="https://codeclimate.com/github/idancali/cassi"> <img src="https://codeclimate.com/github/idancali/cassi/badges/coverage.svg"> </a>
    <a href="http://standardjs.com"><img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg"></a>
</p>

## Summary
Cassi allows you to create vaults, and to securely lock them and to unlock them.

## Basic Usage

```
// Import Cassi
const cassi = require('cassi')

// Create a Cassi Vault named '.cassi' in your home directory (~/.cassi),
// with password 'hello' and lock it right away
cassi.vault.create('.cassi', 'hello')
     .then((vault) => cassi.vault.lock('.cassi', 'hello'))
     .catch((error) => {
       // the vault could not be created or locked
     })
```

## API

### vault.create (vaultName, password)

*Returns a promise*

**Example:**

Create a Cassi Vault named '.cassi' in your home directory (~/.cassi),
with password 'hello'

```
cassi.vault.create('.cassi', 'hello')
     .then((vault) => {
       // do something with the vault
      })
     .catch((error) => {
       // the vault could not be created
     })
```

### vault.lock (vaultName, password)

*Returns a promise*

**Example:**

Attempt to lock a Cassi Vault named '.cassi', with password 'hello'

```
cassi.vault.lock('.cassi', 'hello')
     .then(() => {
       // the vault is successfully locked now
     })
     .catch((error) => {
       // the vault could not be locked for some reason
     })
```

### vault.unlock (vaultName, password)

*Returns a promise*

**Example:**

Attempt to unlock a Cassi Vault named '.cassi', with password 'hello'

```
cassi.vault.unlock('.cassi', 'hello')
      .then((vault) => {
        // you may use the vault now
      })
      .catch((error) => {
        // the vault could not be unlocked for some reason
      })
```

### vault.exists (vaultName)

*Returns a promise*

**Example:**

Attempt to load an unlocked Cassi Vault named '.cassi', with password 'hello'

```
cassi.vault.load('.cassi', 'hello')
      .then((vault) => {
        // you may use the vault now
      })
      .catch((error) => {
        // the vault could not be loaded for some reason
      })
```

### vault.open (vaultName)

*Returns a promise*

**Example:**

Attempt to open an unlocked Cassi Vault named '.cassi'

```
cassi.vault.open('.cassi')
      .then((vault) => {
        // you may use the vault now
      })
      .catch((error) => {
        // the vault could not be opened for some reason
      })
```
