import express from "express";
import { body, param } from "express-validator";

import { TweetsController } from "../controllers";
import { authMiddleware, dataValidation } from "../middlewares";

/**
 * @swagger
 * tags:
 *   name: Tweets
 *   description: Gerenciamento de Tweets e Respostas
 */
export class TweetsRoutes {
  public static bind() {
    const router = express.Router();
    const controller = new TweetsController();

    /**
     * @swagger
     * /tweets:
     *   post:
     *     summary: Cria um novo tweet
     *     tags: [Tweets]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - content
     *             properties:
     *               content:
     *                 type: string
     *     responses:
     *       201:
     *         description: Tweet criado com sucesso
     */
    router.post(
      "/tweets",
      authMiddleware,
      dataValidation([body("content").isString().isLength({ min: 1 })]),
      controller.createTweet,
    );

    /**
     * @swagger
     * /replies:
     *   post:
     *     summary: Cria uma resposta a um tweet existente
     *     tags: [Tweets]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - content
     *               - replyTo
     *             properties:
     *               content:
     *                 type: string
     *               replyTo:
     *                 type: string
     *                 format: uuid
     *     responses:
     *       201:
     *         description: Resposta criada com sucesso
     */
    router.post(
      "/replies",
      authMiddleware,
      dataValidation([
        body("content").isString().isLength({ min: 1 }),
        body("replyTo").isString().isUUID(),
      ]),
      controller.createReply,
    );

    /**
     * @swagger
     * /tweets/{id}:
     *   get:
     *     summary: Busca um tweet específico pelo ID
     *     tags: [Tweets]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Dados do tweet retornados
     */
    router.get(
      "/tweets/:id",
      authMiddleware,
      dataValidation([param("id").isUUID()]),
      controller.findTweet,
    );

    /**
     * @swagger
     * /tweets/{id}:
     *   put:
     *     summary: Atualiza o conteúdo de um tweet
     *     tags: [Tweets]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
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
     *               content:
     *                 type: string
     *     responses:
     *       200:
     *         description: Tweet atualizado com sucesso
     */
    router.put(
      "/tweets/:id",
      authMiddleware,
      dataValidation([
        param("id").isUUID(),
        body("content").isString().isLength({ min: 1 }),
      ]),
      controller.updateTweet,
    );

    /**
     * @swagger
     * /tweets/{id}:
     *   delete:
     *     summary: Remove um tweet
     *     tags: [Tweets]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       204:
     *         description: Tweet removido com sucesso
     */
    router.delete(
      "/tweets/:id",
      authMiddleware,
      dataValidation([param("id").isUUID()]),
      controller.deleteTweet,
    );

    /**
     * @swagger
     * /users/{userId}/tweets:
     *   get:
     *     summary: Lista todos os tweets de um usuário específico
     *     tags: [Tweets]
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
     *         description: Lista de tweets do usuário
     */
    router.get(
      "/users/:userId/tweets",
      authMiddleware,
      dataValidation([param("userId").isUUID()]),
      controller.listTweetsByUserId,
    );

    /**
     * @swagger
     * /tweets:
     *   get:
     *     summary: Lista todos os tweets do sistema
     *     tags: [Tweets]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista global de tweets
     */
    router.get("/tweets", authMiddleware, controller.listAll);

    /**
     * @swagger
     * /feed:
     *   get:
     *     summary: Retorna o feed personalizado do usuário logado
     *     tags: [Tweets]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Feed retornado com sucesso
     */
    router.get("/feed", authMiddleware, controller.feed);

    return router;
  }
}
