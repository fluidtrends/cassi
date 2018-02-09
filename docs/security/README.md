# Cassi Security Model

**A Cassi Vault is practically impossible to crack.**

Let's dive into the Cassi Security Model to see why you should **feel very safe** if your data resides in a Cassi Vault.

## Vault Security

First, every Cassi Vault gets encrypted from the cleartext JSON format, using symmetric encryption.

A Cassi Vault is encrypted with [AES [1]](#aes-standard), the strongest symmetric standard available. AES is the [US federal government standard [2]](#aes-security) for classified information.

The AES key used for Cassi Vaults is a 256-bit key that creates an incredibly large number of possible solutions, making it practically impossible to crack.

In terms of security, Cassi is rock solid and as secure as top secret US information and as secure as top password managers like [1password [3]](#1password-security-model), [DashLane [4]](#dashlane-security-whitepaper) or [LastPass [5]](#lastpass-security-model) - they all use AES-256 encryption.

As its mode of operation, Cassi uses the [Cipher Block Chaining [6]](#cipher-block-chaining) mode which means that each block in the cipher chain depends on all preceding blocks, making it very difficult to compromise.

#### Practically Unbreakable

AES has never been cracked. If that happens - considering that it's at the heart of all security systems from the US government to the best password managers out there - the whole world will essentially collapse and the security of your data will be the least of your worries.

The computational complexity of AES-256 is 2<sup>256</sup> - that's how difficult it is to crack it. That means there are that many possible solutions to guess the private key used for encryption. That's a big number - a really, really big number.

To understand how secure AES-256 encryption is against brute force attacks, consider the following. The [world's top supercomputer [7]](#top-supercomputer) called Sunway TaihuLight, has a computing power of 93 petaflops. That's 93 x 10<sup>15</sup> floating point operations per second (flops). In the most, absolute most conservative estimation, it would an attacker would require a minimum of 1000 flops to computer an AES key. In practice it could take much more than that. But if we assume 1000, then that means that the top supercomputer in the world could check 93 x 10<sup>12</sup> (93 x 10<sup>15</sup>/1000) combinations per second. With 31536000 seconds in a year (365 x 24 x 60 x 60) and given AES-256's computational complexity of 2<sup>256</sup> that means that it would take **3.31 x 10<sup>56</sup> years** to crack the encryption.

That's many, many **billions of times longer than the age of our universe.**

The best known attack against AES is called the [Biclique attack [8]](#biclique-attack) and all that it did is reduce computational complexity from  2<sup>256</sup> to 2<sup>254.4</sup> which is practically irrelevant.

Even if you apply the best known attack and use many of the world's top supercomputers, it would still take billions of years to crack a Cassi Vault.

## Key Security

It's impossible to break the vault as long as key is not in plain sight. That means a Cassi Vault key has to be secured as well. If we can use a symmetric encryption algorithm (AES) for encrypting a vault, we cannot do the same for keys because we want these to be shared.

In other words, we want to allow multiple parties to unlock the vault in a secure way, each with their own keys. Cassi is also designed to be **blockchain-compatible** so in order to accomplish this, Cassi secures the AES symmetric key using [Elliptic Curve Cryptography [9]](#elliptic-curve-cryptography).

The specific Elliptic Curve algorithm used is [Secp256k1 [10]](#secp256k1), which is the same algorithm used in Bitcoin and other popular blockchains such as [EOS [11]](#eos-security). The computation complexity is the same as for AES-256 and thus the key is as secure as the vault itself.

Cassi generates private-public key pairs for each vault owner. An owner can own one or more such key pairs. The public keys are stored in the root location of all vaults and the private keys are stored in the owner machine's keychain.

The AES key is encrypted in a separate key file than the encrypted vault file and one or more vault owners can be given access to the key file. Cassi accomplishes this by signing the AES key with one or more of each owner's private assymetric keys and adding the signatures to the encrypted key file payload. This results in a key payload that can be decrypted by all the owners who have been given access to the vault.

This also means that an encrypted Cassi Vault can be shared safely and the encrypted Cassi Vault Key can also be shared safely. A vault owner requires both files and their private assymetric key in order to unlock and lock the vault. As long as the owner's private keys are stored safely, the encrypted key file and vault file cannot be compromised.

## References

###### 1. [AES Standard](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf)
###### 2. [AES Security](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard#Security)
###### 3. [1password Security Model](https://support.1password.com/1password-security/)
###### 4. [DashLane Security Whitepaper](https://www.dashlane.com/download/Dashlane_SecurityWhitePaper_Dec2017.pdf)
###### 5. [LastPass Security Model](https://www.lastpass.com/how-lastpass-works)
###### 6. [Cipher Block Chaining](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#CBC)
###### 7. [Top supercomputer](https://en.wikipedia.org/wiki/Sunway_TaihuLight)
###### 8. [Biclique attack](https://en.wikipedia.org/wiki/Biclique_attack)
###### 9. [Elliptic Curve Cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography)
###### 10. [Secp256k1](https://en.bitcoin.it/wiki/Secp256k1)
###### 11. [EOS Security](https://github.com/EOSIO/eos/blob/af648f70a7d4cc90760c1e5e140e07b4b452354e/libraries/fc/src/crypto/elliptic_mixed.cpp)
