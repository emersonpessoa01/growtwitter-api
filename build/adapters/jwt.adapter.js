"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAdapter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envs_1 = require("../envs");
class JWTAdapter {
    _secret;
    _expireIn;
    constructor(_secret = envs_1.envs.JWT_SECRET_KEY, _expireIn = envs_1.envs.JWT_EXPIRE_IN) {
        this._secret = _secret;
        this._expireIn = _expireIn;
    }
    generateToken(data) {
        return jsonwebtoken_1.default.sign(data, this._secret, {
            expiresIn: this._expireIn,
        });
    }
    decodeToken(token) {
        return jsonwebtoken_1.default.verify(token, this._secret);
    }
}
exports.JWTAdapter = JWTAdapter;
