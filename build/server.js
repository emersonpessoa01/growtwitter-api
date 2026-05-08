"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const envs_1 = require("./envs");
const routes_1 = require("./routes");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Growtwitter API",
            version: "1.0.0",
            description: "API REST inspirada no X (Twitter) para o bootcamp da Growdev.\n\nCopie o token JWT gerado no login e insira-o no campo 'Value' ao clicar no botão Authorize para liberar o acesso às rotas protegidas.",
        },
        servers: [
            {
                url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${envs_1.envs.PORT}`,
                description: process.env.RENDER_EXTERNAL_URL
                    ? "Produção (Render)"
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
    apis: ["./src/routes/*.ts", "./dist/routes/*.js", "./routes/*.js"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
const serverInstance = new app_1.default([
    routes_1.AuthRoutes.bind(),
    routes_1.UsersRoutes.bind(),
    routes_1.TweetsRoutes.bind(),
    routes_1.LikesRoutes.bind(),
    routes_1.FollowersRoutes.bind(),
], envs_1.envs.PORT);
// Rota para servir o JSON do spec (necessário na Vercel)
serverInstance.app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});
serverInstance.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Growtwitter API Docs",
    customJs: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js",
    customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
    swaggerOptions: {
        persistAuthorization: true,
        url: "/api-docs.json",
    },
}));
const port = process.env.PORT || envs_1.envs.PORT || 3030;
// Importante: usar 0.0.0.0 para o Render mapear a rede corretamente
if (!process.env.VERCEL) {
    serverInstance.app.listen(Number(port), "0.0.0.0", () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}
exports.default = serverInstance.app;
