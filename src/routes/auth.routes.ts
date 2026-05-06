import express from "express";
import { body } from "express-validator";

import { AuthController } from "../controllers";
import { dataValidation } from "../middlewares";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação e registro
 */
export class AuthRoutes {
  public static bind() {
    const router = express.Router();
    const controller = new AuthController();

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
    router.post(
      "/auth/login",
      dataValidation([
        body("username").isLength({ min: 1 }),
        body("password").isLength({ min: 1 }),
      ]),
      controller.login,
    );

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
    router.post(
      "/auth/register",
      dataValidation([
        body("name").isLength({ min: 3 }),
        body("username").isLength({ min: 3 }),
        body("password").isLength({ min: 5 }),
        body("imageUrl").optional().isURL(),
      ]),
      controller.register,
    );

    return router;
  }
}
