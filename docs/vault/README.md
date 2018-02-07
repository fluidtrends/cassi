## The Vault Documentation

A Cassi Vault is a JSON file structure that can be encrypted, decrypted and password-protected.

### Instantiation

To use a Vault you start by instantiating an instance, with some options.

*Examples:*

```
// Import Cassi with default options
const cassi = require('cassi')

// Create a Cassi Vault named '.cassi' in your home directory (~/.cassi),
// with password 'hello'
const vault = cassi.vault.create('.cassi', 'hello')
```

[See all the available options](#options)

### Functions

### create (vaultName, password)

*Returns a promise*

**Example:**

Create a Cassi Vault named '.cassi' in your home directory (~/.cassi),
with password 'hello'

```
vault.create('.cassi', 'hello')
     .then((data) => {
       // do something with the vault
      })
     .catch((error) => {
       // the vault could not be created
     })
```

### lock (vaultName, password)

*Returns a promise*

**Example:**

Attempt to lock a Cassi Vault named '.cassi', with password 'hello'

```
vault.lock('.cassi', 'hello')
     .then(() => {
       // the vault is successfully locked now
     })
     .catch((error) => {
       // the vault could not be locked for some reason
     })
```

### unlock (vaultName, password)

*Returns a promise*

**Example:**

Attempt to unlock a Cassi Vault named '.cassi', with password 'hello'

```
vault.unlock('.cassi', 'hello')
      .then((data) => {
        // you may use the vault now
      })
      .catch((error) => {
        // the vault could not be unlocked for some reason
      })
```

### exists (vaultName)

*Returns true or false*

**Example:**

```
const cassiVaultExists = cassi.vault.exists('.cassi')
```

### open (vaultName)

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

### Fields



### Options

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
