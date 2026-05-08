"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
/**
 * @swagger
 * tags:
 *   name: Followers
 *   description: Gerenciamento de seguidores e conexões entre usuários
 */
class FollowersRoutes {
    static bind() {
        const router = express_1.default.Router();
        const controller = new controllers_1.FollowersController();
        /**
         * @swagger
         * /followers:
         *   post:
         *     summary: Segue um usuário
         *     tags: [Followers]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - userId
         *             properties:
         *               userId:
         *                 type: string
         *                 format: uuid
         *                 description: ID do usuário que será seguido
         *     responses:
         *       201:
         *         description: Usuário seguido com sucesso
         *       401:
         *         description: Não autorizado
         *       404:
         *         description: Usuário não encontrado
         */
        router.post("/followers", middlewares_1.authMiddleware, (0, middlewares_1.dataValidation)([(0, express_validator_1.body)("userId").isString().isUUID()]), controller.followUp);
        /**
         * @swagger
         * /followers:
         *   delete:
         *     summary: Deixa de seguir um usuário
         *     tags: [Followers]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - userId
         *             properties:
         *               userId:
         *                 type: string
         *                 format: uuid
         *                 description: ID do usuário que deixará de ser seguido
         *     responses:
         *       204:
         *         description: Deixou de seguir com sucesso
         *       401:
         *         description: Não autorizado
         */
        router.delete("/followers", middlewares_1.authMiddleware, (0, middlewares_1.dataValidation)([(0, express_validator_1.body)("userId").isString().isUUID()]), controller.unfollow);
        /**
         * @swagger
         * /followers:
         *   get:
         *     summary: Lista os seguidores e quem o usuário logado está seguindo
         *     tags: [Followers]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Lista de conexões retornada com sucesso
         *       401:
         *         description: Não autorizado
         */
        router.get("/followers", middlewares_1.authMiddleware, controller.getFollowers);
        return router;
    }
}
exports.FollowersRoutes = FollowersRoutes;
