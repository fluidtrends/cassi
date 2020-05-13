"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var Cipher = /** @class */ (function () {
    function Cipher(vault) {
        this._vault = vault;
    }
    Object.defineProperty(Cipher.prototype, "vault", {
        get: function () {
            return this._vault;
        },
        enumerable: true,
        configurable: true
    });
    Cipher.prototype.saveKey = function (name, key) {
        _1.Crypto.setPassword(this.vault.service, name, key);
    };
    Cipher.prototype.getKey = function (name) {
        _1.Crypto.getPassword(this.vault.service, name);
    };
    Cipher.prototype.createMasterKey = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var mnemonic = _1.Crypto.entropyToMnemonic(_1.Crypto.randomBytes(16));
                        var node = _1.Crypto.fromSeed(_1.Crypto.mnemonicToSeedSync(mnemonic));
                        var nodePath = node.derivePath("m/44'/0'/0'").derivePath('0/0');
                        var _a = _1.Crypto.decode(nodePath.toWIF(), 128), privateKey = _a.privateKey, compressed = _a.compressed;
                        var key = _1.Crypto.encrypt(privateKey, compressed, password);
                        _this.saveKey('master', key);
                        console.log(key);
                        resolve([privateKey, mnemonic]);
                    })];
            });
        });
    };
    Cipher.prototype.findMasterKey = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("findMasterKey0");
                return [2 /*return*/, _1.Crypto.getPassword(this.vault.service, 'master')
                        .then(function (data) { return data ? _1.Crypto.decrypt(data, password).privateKey : null; })
                        .then(function (key) {
                        console.log("findMasterKey1:", key, password);
                        return key ? [key, undefined] : _this.createMasterKey(password);
                    })];
            });
        });
    };
    Cipher.prototype.encrypt = function (text, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.findMasterKey(password).then(function (_a) {
                        var key = _a[0], mnemonic = _a[1];
                        console.log("encrypt - findMasterKey", key, mnemonic);
                        var iv = _1.Crypto.randomBytes(16);
                        var salt = _1.Crypto.randomBytes(64);
                        var cipher = _1.Crypto.createCipheriv('aes-256-gcm', key, iv);
                        var encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
                        var tag = cipher.getAuthTag();
                        var payload = Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
                        return [payload, mnemonic];
                    })];
            });
        });
    };
    Cipher.prototype.decrypt = function (encdata, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.findMasterKey(password).then(function (_a) {
                        var key = _a[0];
                        var bData = Buffer.from(encdata, 'base64');
                        var iv = bData.slice(64, 80);
                        var tag = bData.slice(80, 96);
                        var text = bData.slice(96);
                        var decipher = _1.Crypto.createDecipheriv('aes-256-gcm', key, iv);
                        decipher.setAuthTag(tag);
                        return decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
                    })];
            });
        });
    };
    return Cipher;
}());
exports.Cipher = Cipher;
//# sourceMappingURL=Cipher.js.map