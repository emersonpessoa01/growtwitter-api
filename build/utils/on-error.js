"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onError = onError;
const jsonwebtoken_1 = require("jsonwebtoken");
const http_error_1 = require("./http.error");
function onError(error, res) {
    if (error instanceof http_error_1.HTTPError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            details: error.details,
        });
    }
    if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
        return res.status(401).json({
            success: false,
            mensagem: "Token inválido ou expirado",
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        details: [
            {
                type: "system",
                field: "unknown",
                description: error.toString(),
                location: error.name,
            },
        ],
    });
}
