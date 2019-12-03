import express from "express";
import http from "http";
import middleware from "./middleware";
import routes from "./services";
import { applyMiddleware, applyRoutes } from "./utils";
import errorHandlers from "./middleware/errorHandlers";
import env from "dotenv";
import history from "connect-history-api-fallback";
import { logger } from "./services/logging";
import { connectDb } from "./services/mongo";
env.config();

process.on("uncaughtException", e => {
  console.log(e);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.log(e);
  process.exit(1);
});

class App {
  public app: express.Application;
  public static PORT = process.env.PORT;

  constructor() {
    this.app = express();
    this.config();
    this.listen();
  }

  private config() {
    applyMiddleware(middleware, this.app);
    applyRoutes(routes, this.app);
    this.setupSPA();
    applyMiddleware(errorHandlers, this.app);
    connectDb();
  }

  private setupSPA() {
    const staticFiles = express.static("spa");
    this.app.use(staticFiles);
    this.app.use(
      history({
        index: "/spa/index.html",
        rewrites: [{ from: /about/, to: "/index.html" }]
      })
    );

    this.app.use(staticFiles);
  }

  listen() {
    const server = http.createServer(this.app);

    server.listen(App.PORT, () => {
      logger.info(`Server is running on http://localhost:${App.PORT}`);
    });
  }
}

export default new App().app;
