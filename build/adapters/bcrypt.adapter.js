"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptAdapter = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const envs_1 = require("../envs");
class BcryptAdapter {
    _salt;
    constructor(_salt = envs_1.envs.BCRYPT_SALT) {
        this._salt = _salt;
    }
    generateHash(plainText) {
        return bcrypt_1.default.hash(plainText, this._salt);
    }
    compareHash(plainText, hash) {
        return bcrypt_1.default.compare(plainText, hash);
    }
}
exports.BcryptAdapter = BcryptAdapter;
