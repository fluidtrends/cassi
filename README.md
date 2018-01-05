<p align="center">
<img src="https://raw.githubusercontent.com/idancali/cassi/master/logo.png" width="256px">
</p>

<h1 align="center"> Cassi </h1>
<h3 align="center"> Cryptographic Asymmetric Secure Storage Infrastructure </h3>
<p align="center"> Cassi allows you to store data in password-protected file-based secure vaults. </p>
<hr/>

## Latest Release [![Build](https://circleci.com/gh/idancali/cassi.svg?style=svg)](https://circleci.com/gh/idancali/cassi)

[![Module](https://img.shields.io/npm/v/cassi.svg)](https://www.npmjs.com/package/cassi)
[![Coverage](https://api.codeclimate.com/v1/badges/bf84c59ee363bce19c4a/test_coverage)](https://codeclimate.com/github/idancali/cassi/test_coverage)[![Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

## Basic Usage

```
// Import Cassi with default options
const cassi = require('cassi')

// Create a Cassi Vault named '.cassi' in your home directory (~/.cassi),
// with password 'hello', add some data and then lock it right away
cassi.vault.create('.cassi', 'hello')
     .then((data) => {
       // Let's add some data
       data.set('user.name', 'john')

       // Lock the vault
       cassi.vault.lock('.cassi', 'hello')
     })
     .catch((error) => {
       // the vault could not be created or locked
     })
```

## Options

You can pass some options if you want to override the default ones, or you can override individual options.

### root

The root directory where all vaults will be stored

*Default: the user's $HOME directory*

```
// Change the default root for vaults from the user's $HOME directory to a custom one
cassi.config.root = '/some/custom/path'
```

### index

The filename that holds the primary vault information

*Default: index*

```
// Change the default vault index a custom one
cassi.config.index = 'myIndex'
```

## Vault API

### vault.create (vaultName, password)

*Returns a promise*

**Example:**

Create a Cassi Vault named '.cassi' in your home directory (~/.cassi),
with password 'hello'

```
cassi.vault.create('.cassi', 'hello')
     .then((data) => {
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
      .then((data) => {
        // you may use the vault now
      })
      .catch((error) => {
        // the vault could not be unlocked for some reason
      })
```

### vault.exists (vaultName)

*Returns true or false*

**Example:**

```
const cassiVaultExists = cassi.vault.exists('.cassi')
```

### vault.open (vaultName)

*Returns a promise*

**Example:**

Attempt to open an unlocked Cassi Vault named '.cassi'

```
cassi.vault.open('.cassi')
      .then((data) => {
        // you may use the vault now
      })
      .catch((error) => {
        // the vault could not be opened for some reason
      })
```

## Data API

### set(key, value)

Adds or updates the data set at

**Example:**

```
// Add a user's name
data.set('user.name', 'John')

// Update the user's name
data.set('user.name', 'Bob')
```

### get(key)

Fetches data with the given key

**Example:**

```
// Get a user's name
const userName = data.get('user.name')
```

## Security

A Cassi Vault is encrypted with AES 256 CBC encryption, using an HMAC sha256 key generated from the password.

When a vault is locked, the only way to unlock it is to provide the Vault Password which is stored outside of Cassi.

## Dependencies

Cassi makes use of the following libraries:

* [lowdb](https://github.com/typicode/lowdb) - for storage
* [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - for password hashing
