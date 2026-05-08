"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação e registro
 */
class AuthRoutes {
    static bind() {
        const router = express_1.default.Router();
        const controller = new controllers_1.AuthController();
        /**
         * @swagger
         * /auth/login:
         *   post:
         *     summary: Realiza o login do usuário
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - username
         *               - password
         *             properties:
         *               username:
         *                 type: string
         *               password:
         *                 type: string
         *     responses:
         *       200:
         *         description: Login realizado com sucesso, retorna o token JWT
         *       401:
         *         description: Credenciais inválidas
         */
        router.post("/auth/login", (0, middlewares_1.dataValidation)([
            (0, express_validator_1.body)("username").isLength({ min: 1 }),
            (0, express_validator_1.body)("password").isLength({ min: 1 }),
        ]), controller.login);
        /**
         * @swagger
         * /auth/register:
         *   post:
         *     summary: Registra um novo usuário
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - name
         *               - username
         *               - password
         *             properties:
         *               name:
         *                 type: string
         *                 minLength: 3
         *               username:
         *                 type: string
         *                 minLength: 3
         *               password:
         *                 type: string
         *                 minLength: 5
         *               imageUrl:
         *                 type: string
         *     responses:
         *       201:
         *         description: Usuário registrado com sucesso
         *       400:
         *         description: Erro de validação ou usuário já existente
         */
        router.post("/auth/register", (0, middlewares_1.dataValidation)([
            (0, express_validator_1.body)("name").isLength({ min: 3 }),
            (0, express_validator_1.body)("username").isLength({ min: 3 }),
            (0, express_validator_1.body)("password").isLength({ min: 5 }),
            (0, express_validator_1.body)("imageUrl").optional().isURL(),
        ]), controller.register);
        return router;
    }
}
exports.AuthRoutes = AuthRoutes;
