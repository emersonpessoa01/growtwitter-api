"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários e perfis
 */
class UsersRoutes {
    static bind() {
        const router = express_1.default.Router();
        const controller = new controllers_1.UsersController();
        /**
         * @swagger
         * /users:
         *   get:
         *     summary: Lista todos os usuários
         *     tags: [Users]
         *     responses:
         *       200:
         *         description: Lista de usuários retornada com sucesso
         */
        router.get("/users", controller.index);
        /**
         * @swagger
         * /users/{userId}:
         *   get:
         *     summary: Obtém um usuário pelo ID
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Usuário encontrado
         *       401:
         *         description: Não autorizado
         *       404:
         *         description: Usuário não encontrado
         */
        router.get("/users/:userId", middlewares_1.authMiddleware, (0, middlewares_1.dataValidation)([(0, express_validator_1.param)("userId").isUUID()]), controller.getById);
        /**
         * @swagger
         * /users/{userId}:
         *   put:
         *     summary: Atualiza os dados de um usuário
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               username:
         *                 type: string
         *               imageUrl:
         *                 type: string
         *               bio:
         *                 type: string
         *     responses:
         *       200:
         *         description: Usuário atualizado com sucesso
         *       401:
         *         description: Não autorizado
         */
        router.put("/users/:userId", middlewares_1.authMiddleware, (0, middlewares_1.dataValidation)([(0, express_validator_1.param)("userId").isUUID()]), controller.update);
        return router;
    }
}
exports.UsersRoutes = UsersRoutes;
