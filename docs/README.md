# Cassi

Cassi helps you manage your sensitive data in secure, password-protected, encrypted file-based vaults.

## The Vault API

A Cassi Vault is a JSON file structure that can be encrypted, decrypted and password-protected.

**Basic Usage**

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

Read The Full Vault Documentation for more details about creating, locking, unlocking and reading and writing from a vault.

[Read The Vault Documentation](/docs/vault)
