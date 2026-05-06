import express, { Application, Request, Response } from "express";
import cors from "cors";

export default class App {
  public app: Application;
  public port: number;

  constructor(routes: any[], port: number) {
    this.app = express();
    this.port = port;

    this.middlewares();
    this.routes(routes);
    this.welcomeRoute();
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private routes(routes: any[]) {
    routes.forEach((route) => {
      this.app.use(route);
    });
  }

  private getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  private welcomeRoute() {
    this.app.get("/", (req: Request, res: Response) => {
      const greeting = this.getGreeting();

      res.json({
        message: `${greeting}! API Growtwitter rodando com sucesso.`,
        instructions:
          "Para testar os endpoints e ver a documentação, acesse /api-docs",
        docs: `http://localhost:${this.port}/api-docs`,
      });
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      const greeting = this.getGreeting();

      // eslint-disable-next-line no-console
      console.log(`---------------------------------------------------`);
      console.log(`✨ ${greeting}!`);
      console.log(
        `🚀 Servidor rodando localmente no host:http://localhost:${this.port}`,
      );
      console.log(`📖 Swagger: http://localhost:${this.port}/api-docs`);
      console.log(`---------------------------------------------------`);
    });
  }
}
