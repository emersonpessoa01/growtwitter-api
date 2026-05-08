"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
class App {
    app;
    port;
    constructor(routes, port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.middlewares();
        this.routes(routes);
        this.welcomeRoute();
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    routes(routes) {
        routes.forEach((route) => {
            this.app.use(route);
        });
    }
    getGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12)
            return "Bom dia";
        if (hour >= 12 && hour < 18)
            return "Boa tarde";
        return "Boa noite";
    }
    welcomeRoute() {
        this.app.get("/", (req, res) => {
            const greeting = this.getGreeting();
            res.json({
                message: `${greeting}! API Growtwitter rodando com sucesso.`,
                instructions: "Para testar os endpoints e ver a documentação, acesse /api-docs",
                local: `http://localhost:${this.port}/api-docs`,
                remoto: "https://growtwitter-api-syq8.onrender.com/api-docs",
            });
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            const greeting = this.getGreeting();
            // eslint-disable-next-line no-console
            console.log(`---------------------------------------------------`);
            console.log(`✨ ${greeting}!`);
            console.log(`🚀 Servidor rodando localmente no host:http://localhost:${this.port}`);
            console.log(`📖 Swagger: http://localhost:${this.port}/api-docs`);
            console.log(`---------------------------------------------------`);
        });
    }
}
exports.default = App;
