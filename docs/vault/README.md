## The Vault Documentation

A Cassi Vault is a JSON file structure that can be encrypted, decrypted and password-protected.

### Instantiation

To use a Vault you start by instantiating an instance, with some options.

*Examples:*

```
// Import Cassi with default options
const cassi = require('cassi')

// Create a Cassi Vault instance
const vault = new cassi.Vault({ name: 'my-vault' })
```

[See all the available options](#options)

### Functions

### create (password)

Create a Cassi Vault in your home directory (~/.cassi), with the given password

*Returns a promise*

**Example:**

```
vault.create('hello')
     .then(({ vault, mnemonic }) => {
       // Have fun using your new vault.
       // Remember to keep the mnemonic somewhere safe.
      })
     .catch((error) => {
       // the vault could not be created
     })
```

### lock (password)

Lock a Cassi Vault with the given password

*Returns a promise*

**Example:**

```
vault.lock('hello')
     .then(({ vault }) => {
       // the vault is successfully locked now
     })
     .catch((error) => {
       // the vault could not be locked for some reason
     })
```

### unlock (password)

Unlock a Cassi Vault with the given password

*Returns a promise*

**Example:**

```
vault.unlock('hello')
      .then(({ vault }) => {
        // you may use the vault now
      })
      .catch((error) => {
        // the vault could not be unlocked for some reason
      })
```

### read (key)

Read secure data from an unlocked vault

**Example:**

```
const name = vault.read('name')
```

### write (key, value)

Write secure data from to an unlocked vault

**Example:**

```
vault.write('name', 'Johnny')
```

### Fields

**```id```**

A unique identifier generated when instantiating the vault.

**```options```**

The original options passed at instantiation.

**```root```**

The root directory where all vaults are to be found.

**```name```**

The name of the vault.

**```exists```**

Whether the vault's location exists or not.

**```dir```**

The full directory of the location of this vault.

### Options

You can pass some options if you want to override the default ones, or you can override individual options.

**```name```**
*type: String*

The name of the vault.

*Default: 'vault'*

*Examples:*

- ```my-vault```
- ```mydomain.com```

**```root```**
*type: String*

The root directory where all vaults will be stored

*Default: $HOME/.cassi/*

*Examples:*

- ```myvaults```
- ```/home/users/johnny/myVaults/```
