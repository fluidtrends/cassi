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
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
var utils = __importStar(require("./utils"));
var lowdb_1 = __importDefault(require("lowdb"));
var _1 = require(".");
var Vault = /** @class */ (function () {
    function Vault(options) {
        this._options = options;
        this._root = path_1.default.resolve(this._options.root || path_1.default.join(utils.homeDir(), '.cassi'));
        this._cipher = new _1.Cipher(this);
    }
    Object.defineProperty(Vault.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vault.prototype, "exists", {
        get: function () {
            return fs_extra_1.default.existsSync(this.dir);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vault.prototype, "name", {
        get: function () {
            return this.options ? this.options.name : 'vault';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vault.prototype, "root", {
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vault.prototype, "dir", {
        get: function () {
            return path_1.default.join(this.root, "" + this.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vault.prototype, "cipher", {
        get: function () {
            return this._cipher;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vault.prototype, "service", {
        get: function () {
            return this.options.service || 'cassi';
        },
        enumerable: true,
        configurable: true
    });
    Vault.prototype.write = function (key, value) {
        var _a;
        return (_a = this._db) === null || _a === void 0 ? void 0 : _a.set(key, value).write();
    };
    Vault.prototype.read = function (key) {
        var _a;
        return (_a = this._db) === null || _a === void 0 ? void 0 : _a.get(key).value();
    };
    Object.defineProperty(Vault.prototype, "id", {
        get: function () {
            return this.isLocked ? '' : this.read('id');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vault.prototype, "isLocked", {
        get: function () {
            return fs_extra_1.default.existsSync(path_1.default.join(this.dir, ".lock"));
        },
        enumerable: true,
        configurable: true
    });
    Vault.prototype._verify = function (lockFile, indexFile, close) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (close && fs_extra_1.default.existsSync(lockFile)) {
                            reject(new Error('Already locked'));
                            return;
                        }
                        if (close && !fs_extra_1.default.existsSync(indexFile)) {
                            reject(new Error('Missing index'));
                            return;
                        }
                        if (!close && fs_extra_1.default.existsSync(indexFile)) {
                            reject(new Error('Already open'));
                            return;
                        }
                        if (!close && !fs_extra_1.default.existsSync(lockFile)) {
                            reject(new Error('Missing lock'));
                            return;
                        }
                        resolve();
                    })];
            });
        });
    };
    Vault.prototype.lock = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var indexFile, lockFile, vault;
            var _this = this;
            return __generator(this, function (_a) {
                indexFile = path_1.default.join(this.dir, "index.json");
                lockFile = path_1.default.join(this.dir, ".lock");
                vault = this;
                return [2 /*return*/, this._verify(lockFile, indexFile, true)
                        .then(function () { return new Promise(function (resolve, reject) {
                        var data = fs_extra_1.default.readFileSync(indexFile, 'utf8');
                        _this._cipher.encrypt(data, "" + password)
                            .then(function (enc) { return resolve(enc); })
                            .catch(function (e) {
                            console.log("DDDDD", e);
                            reject(new Error('Invalid password'));
                        });
                    }); })
                        .then(function (_a) {
                        var payload = _a[0], mnemonic = _a[1];
                        return fs_extra_1.default.writeFile(lockFile, payload, 'utf8')
                            .then(function () { return fs_extra_1.default.remove(indexFile); })
                            .then(function () { return ({ vault: vault, mnemonic: mnemonic }); });
                    })];
            });
        });
    };
    Vault.prototype.unlock = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var indexFile, lockFile, vault;
            var _this = this;
            return __generator(this, function (_a) {
                indexFile = path_1.default.join(this.dir, "index.json");
                lockFile = path_1.default.join(this.dir, ".lock");
                vault = this;
                return [2 /*return*/, this._verify(lockFile, indexFile, false)
                        .then(function () { return new Promise(function (resolve, reject) {
                        var data = fs_extra_1.default.readFileSync(lockFile, 'utf8');
                        _this._cipher.decrypt(data, "" + password)
                            .then(function (dec) { return resolve(dec); })
                            .catch(function () { return reject(new Error('Invalid password')); });
                    }); })
                        .then(function (dec) {
                        fs_extra_1.default.writeFile(indexFile, dec, 'utf8');
                    })
                        .then(function () { return fs_extra_1.default.remove(lockFile); })
                        .then(function () { return ({ vault: vault }); })];
            });
        });
    };
    Vault.prototype.initialize = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.exists || fs_extra_1.default.mkdirsSync(_this.dir);
            if (_this.isLocked) {
                resolve({ vault: _this });
                return;
            }
            var vaultIndexFile = path_1.default.join(_this.dir, 'index.json');
            var adapter = new FileSync_1.default(vaultIndexFile);
            _this._db = lowdb_1.default(adapter);
            _this.read('id') || _this._db.defaults({ name: _this.name, id: utils.newId() }).write();
            resolve({ vault: _this });
        });
    };
    return Vault;
}());
exports.Vault = Vault;
//# sourceMappingURL=Vault.js.map