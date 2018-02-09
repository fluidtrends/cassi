# Cassi Security Model

**A Cassi Vault is practically impossible to crack.**

Let's dive into the Cassi Security Model to see why you should **feel very safe** if your data resides in a Cassi Vault.

## AES Encryption

First, every Cassi Vault gets encrypted from the cleartext JSON format, using symmetric encryption.

A Cassi Vault is encrypted with [AES [1]](#aes-standard), the strongest symmetric standard available. AES is the [US federal government standard [2]](#aes-security) for classified information.

The AES key used for Cassi Vaults is a 256-bit key that creates a incredibly large number of possible solutions, making it practically impossible to crack.

In terms of security, Cassi is rock solid and as secure as top secret US information and as secure as top password managers like [1password [3]](#1password-security-model), [DashLane [4]](#dashlane-security-whitepaper) or [LastPass [5]](#lastpass-security-model) - they all use AES-256 encryption.

As its mode of operation, Cassi uses the [Cipher Block Chaining [6]](#cipher-block-chaining) mode which means that each block in the cipher chain depends on all preceding blocks, making it very difficult to compromise.

#### Practically Unbreakable

AES has never been cracked. If that happens - considering that it's at the heart of all security systems from the US government to the best password managers out there - the whole world will essentially collapse and the security of your data will be the least of your worries.

The computational complexity of AES-256 is 2<sup>256</sup> - that's how difficult it is to crack it. That means there are that many possible solutions to guess the private key used for encryption. That's a big number - 11 followed by 76 zeros (1.1x10<sup>77</sup>) - a really, really big number.

To understand how secure AES-256 encryption is against brute force attacks, consider the following. Even if you could check a billion billion combinations per second, [it would take 3 x 10<sup>51</sup> years [7]](#brute-force-attacks) to crack the code. That's a very, very long time. Much, much longer than the age of our universe.

The best known attack against AES is called the [Biclique attack [8]](#biclique-attack) and all that it did is reduce computational complexity from  2<sup>256</sup> to 2<sup>254.4</sup> - still taking billions of years to break a vault.

## References

###### 1. [AES Standard](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf)
###### 2. [AES Security](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard#Security)
###### 3. [1password Security Model](https://support.1password.com/1password-security/)
###### 4. [DashLane Security Whitepaper](https://www.dashlane.com/download/Dashlane_SecurityWhitePaper_Dec2017.pdf)
###### 5. [LastPass Security Model](https://www.lastpass.com/how-lastpass-works)
###### 6. [Cipher Block Chaining](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#CBC)
###### 7. [Brute force attacks](https://en.wikipedia.org/wiki/Brute-force_attack)
###### 8. [Biclique attack](https://en.wikipedia.org/wiki/Biclique_attack)
