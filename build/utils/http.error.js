"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
class HTTPError extends Error {
    statusCode;
    details;
    constructor(statusCode, reason, details) {
        super(reason);
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.HTTPError = HTTPError;
