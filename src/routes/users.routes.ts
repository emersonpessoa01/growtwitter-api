import express from "express";
import { param } from "express-validator";

import { UsersController } from "../controllers";
import { authMiddleware, dataValidation } from "../middlewares";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários e perfis
 */
export class UsersRoutes {
  public static bind() {
    const router = express.Router();
    const controller = new UsersController();

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
    router.get(
      "/users/:userId",
      authMiddleware,
      dataValidation([param("userId").isUUID()]),
      controller.getById,
    );

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
    router.put(
      "/users/:userId",
      authMiddleware,
      dataValidation([param("userId").isUUID()]),
      controller.update,
    );

    return router;
  }
}
