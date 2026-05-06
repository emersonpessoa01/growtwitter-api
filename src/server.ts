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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // CORREÇÃO DOS CAMINHOS: Lê .ts em dev e .js em prod
  apis: ["./src/routes/*.ts", "./dist/routes/*.js", "./routes/*.js"],
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

// CORREÇÃO DA TELA BRANCA: Adicionado CSS customizado para garantir o carregamento na Vercel
serverInstance.app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    customJs:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
    customSiteTitle: "Growtwitter API Docs",
  } as any), // O 'as any' mata o erro do VS Code e deixa você seguir
);

if (!process.env.VERCEL) {
  serverInstance.listen();
}

export default serverInstance.app;
