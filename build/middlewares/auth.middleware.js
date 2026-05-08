"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const adapters_1 = require("../adapters");
const utils_1 = require("../utils");
async function authMiddleware(req, res, next) {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            throw new utils_1.HTTPError(401, "Token de autenticação não informado.");
        }
        const [, token] = auth.split(" ");
        const jwt = new adapters_1.JWTAdapter();
        const data = jwt.decodeToken(token);
        if (!data) {
            throw new utils_1.HTTPError(401, "Token inválido.");
        }
        req.user = data;
        next();
    }
    catch (error) {
        (0, utils_1.onError)(error, res);
    }
}
