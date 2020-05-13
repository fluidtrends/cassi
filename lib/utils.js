"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var v4_1 = __importDefault(require("uuid/v4"));
var path_1 = __importDefault(require("path"));
function newId() {
    return v4_1.default();
}
exports.newId = newId;
function homeDir() {
    var platform = (process.platform === 'win32') ? 'USERPROFILE' : 'HOME';
    return path_1.default.resolve(process.env[platform]);
}
exports.homeDir = homeDir;
//# sourceMappingURL=utils.js.map