# Cassi

Cassi helps you manage your sensitive data in secure, password-protected, encrypted file-based vaults.

## The Vault API

A Cassi Vault is a JSON file structure that can be encrypted, decrypted and password-protected.

**Basic Usage**

```javascript
// Import Cassi
const cassi = require('cassi')

// Create a new vault instance
const vault = new cassi.Vault({ name: 'my-vault' })

// Create the vault with password 'hello'
vault.create('hello')
      .then(({ vault, mnemonic }) => {
        // Good stuff, enjoy your new vault
        // Store the mnemonic somewhere sage
      })
      .catch((error) => {
        // Something happened and the vault could not be created
      })
```

Read The Full Vault Documentation for more details about creating, locking, unlocking and reading and writing from a vault.

[Read The Vault Documentation](/docs/vault)
