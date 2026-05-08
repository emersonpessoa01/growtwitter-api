"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Gerenciamento de curtidas em tweets
 */
class LikesRoutes {
    static bind() {
        const router = express_1.default.Router();
        const controller = new controllers_1.LikesController();
        /**
         * @swagger
         * /likes:
         *   post:
         *     summary: Adiciona uma curtida a um tweet
         *     tags: [Likes]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - tweetId
         *             properties:
         *               tweetId:
         *                 type: string
         *                 format: uuid
         *     responses:
         *       201:
         *         description: Curtida adicionada com sucesso
         *       401:
         *         description: Não autorizado
         *       404:
         *         description: Tweet não encontrado
         */
        router.post("/likes", middlewares_1.authMiddleware, (0, middlewares_1.dataValidation)([(0, express_validator_1.body)("tweetId").isString().isUUID()]), controller.like);
        /**
         * @swagger
         * /likes:
         *   delete:
         *     summary: Remove uma curtida de um tweet
         *     tags: [Likes]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - tweetId
         *             properties:
         *               tweetId:
         *                 type: string
         *                 format: uuid
         *     responses:
         *       204:
         *         description: Curtida removida com sucesso
         *       401:
         *         description: Não autorizado
         *       404:
         *         description: Curtida não encontrada
         */
        router.delete("/likes", middlewares_1.authMiddleware, (0, middlewares_1.dataValidation)([(0, express_validator_1.body)("tweetId").isString().isUUID()]), controller.dislike);
        return router;
    }
}
exports.LikesRoutes = LikesRoutes;
