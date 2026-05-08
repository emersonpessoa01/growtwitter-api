"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
exports.envs = {
    PORT: Number(process.env.PORT),
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN,
    BCRYPT_SALT: Number(process.env.BCRYPT_SALT),
};
