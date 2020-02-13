<p align="center"> <img src="https://raw.githubusercontent.com/fluidtrends/cassi/master/logo.png" width="256px"> 

<h1 align="center"> Cassi </h1>
<h3 align="center"> Cryptographic Asymmetric Secure Storage Infrastructure </h3>
<p align="center"> Manage your secure data in password-protected, encrypted file-based vaults </p> <p align="center"> <img src="https://img.shields.io/github/package-json/v/idancali/cassi?color=green"/></p>
</p>

<p align="center">
<a href="https://circleci.com/gh/fluidtrends/workflows/cassi"><img src="https://circleci.com/gh/fluidtrends/cassi.svg?style=svg"/></a>
<a href="https://codeclimate.com/github/fluidtrends/cassi/maintainability"><img src="https://api.codeclimate.com/v1/badges/f472b929f316ff5f2d76/maintainability" /></a>
<a href="https://codeclimate.com/github/fluidtrends/cassi/test_coverage"><img src="https://api.codeclimate.com/v1/badges/f472b929f316ff5f2d76/test_coverage" /></a></p>


## Getting Started

There's really nothing to getting Cassi up and running, other than selecting a root directory for your vault storage and setting a password for each vault. Have a look at how easy it is to create a Cassi Vault:

```javascript
// Import Cassi
const cassi = require('cassi')

// Create a new vault instance
const vault = new cassi.Vault({ name: 'my-vault' })

// Create the vault with password 'hello'
vault.create('hello')
      .then(({ vault, mnemonic }) => {
        // Good stuff, enjoy your new vault
        // Store the mnemonic somewhere safe
      })
      .catch((error) => {
        // Something happened and the vault could not be created
      })
```

## Documentation

Cassi is very well documented and all objects, options, fields and functions are well explained and they all include examples.

Read the full documentation for detailed instructions on how to create, lock, unlock vaults and how to read and write sensitive data.

[Read The Docs](/docs)

## Contributing

We'd be glad to have you join us as an Cassi Contributor. Get started by reading our Contributor Guide.

[Read The Contributor Guide](/contrib)

## Dependencies

Cassi makes use of the following libraries:

* [lowdb](https://github.com/typicode/lowdb) - for storage
* [fs-extra](https://github.com/jprichardson/node-fs-extra) - for file management
* [uuid](https://github.com/kelektiv/node-uuid) - for generating ids
* [bip38](https://github.com/bitcoinjs/bip38) - for encrypting the machine secret
* [bip39](https://github.com/weilu/bip39) - for generating mnemonics
* [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) - for generating keys
* [keytar](https://github.com/atom/node-keytar) - for working with the system keychain
* [wif](https://github.com/bitcoinjs/wif) - for decoding machine secrets

## License

Cassi is licensed under the MIT License.

* [Read The License](LICENSE)

## Sponsors

Cassi is sponsored by [Fluid Trends](http://fluidtrends.com) and is part of the Fluid Trends Open Source Lab.

If you'd like to co-sponsor this project, please email your co-sponsorship request to **team at fluidtrends.com**
