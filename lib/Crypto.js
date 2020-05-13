"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var keytar_1 = __importDefault(require("keytar"));
var wif_1 = __importDefault(require("wif"));
var bip32 = __importStar(require("bip32"));
var bip38 = __importStar(require("bip38"));
var bip39 = __importStar(require("bip39"));
exports.setPassword = keytar_1.default.setPassword;
exports.getPassword = keytar_1.default.getPassword;
exports.entropyToMnemonic = bip39.entropyToMnemonic;
exports.mnemonicToSeedSync = bip39.mnemonicToSeedSync;
exports.fromSeed = bip32.fromSeed;
exports.randomBytes = crypto_1.default.randomBytes;
exports.encrypt = bip38.encrypt;
exports.decrypt = bip38.decrypt;
exports.decode = wif_1.default.decode;
exports.createCipheriv = crypto_1.default.createCipheriv;
exports.createDecipheriv = crypto_1.default.createDecipheriv;
//# sourceMappingURL=Crypto.js.map