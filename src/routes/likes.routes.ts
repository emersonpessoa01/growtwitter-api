import express from "express";
import { body } from "express-validator";

import { LikesController } from "../controllers";
import { authMiddleware, dataValidation } from "../middlewares";

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Gerenciamento de curtidas em tweets
 */
export class LikesRoutes {
  public static bind() {
    const router = express.Router();
    const controller = new LikesController();

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
    router.post(
      "/likes",
      authMiddleware,
      dataValidation([body("tweetId").isString().isUUID()]),
      controller.like,
    );

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
    router.delete(
      "/likes",
      authMiddleware,
      dataValidation([body("tweetId").isString().isUUID()]),
      controller.dislike,
    );

    return router;
  }
}
