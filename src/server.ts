import App from "./app";
import { envs } from "./envs";
import {
  AuthRoutes,
  FollowersRoutes,
  LikesRoutes,
  TweetsRoutes,
  UsersRoutes,
} from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Growtwitter API",
      version: "1.0.0",
      description:
        "API REST inspirada no X (Twitter) para o bootcamp da Growdev.\n\nCopie o token JWT gerado no login e insira-o no campo 'Value' ao clicar no botão Authorize para liberar o acesso às rotas protegidas.",
    },
    servers: [
      {
        url: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : `http://localhost:${envs.PORT}`,
        description: process.env.VERCEL_URL
          ? "Produção (Vercel)"
          : "Ambiente Local",
      },
    ],
    // CONFIGURAÇÃO DE SEGURANÇA
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Insira o token no JWT gerado no login para acessar as rotas protegidas e em seguida.",
        },
      },
    },
    // Aplica a segurança globalmente em todas as rotas que possuem o marcador security no JSDoc
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const serverInstance = new App(
  [
    AuthRoutes.bind(),
    UsersRoutes.bind(),
    TweetsRoutes.bind(),
    LikesRoutes.bind(),
    FollowersRoutes.bind(),
  ],
  envs.PORT,
);

serverInstance.app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

if (!process.env.VERCEL) {
  serverInstance.listen();
}

export default serverInstance.app;
