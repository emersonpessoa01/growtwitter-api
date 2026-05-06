import express from "express";
import { body } from "express-validator";

import { FollowersController } from "../controllers";
import { authMiddleware, dataValidation } from "../middlewares";

/**
 * @swagger
 * tags:
 *   name: Followers
 *   description: Gerenciamento de seguidores e conexões entre usuários
 */
export class FollowersRoutes {
  public static bind() {
    const router = express.Router();
    const controller = new FollowersController();

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
    router.post(
      "/followers",
      authMiddleware,
      dataValidation([body("userId").isString().isUUID()]),
      controller.followUp,
    );

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
    router.delete(
      "/followers",
      authMiddleware,
      dataValidation([body("userId").isString().isUUID()]),
      controller.unfollow,
    );

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
    router.get("/followers", authMiddleware, controller.getFollowers);

    return router;
  }
}
