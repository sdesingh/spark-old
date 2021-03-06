import express from "express";
import http from "http";
import middleware from "./middleware";
import routes from "./services";
import { applyMiddleware, applyRoutes } from "./utils";
import multer from "multer";
import errorHandlers from "./middleware/errorHandlers";
import env from "dotenv";
import history from "connect-history-api-fallback";
import { addMedia } from "./services/media/MediaController";
const upload = multer({ dest: "../uploads" });

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
  public static PORT = 3000;

  constructor() {
    env.config();
    this.app = express();
    this.config();
    this.listen();
  }

  private config() {
    applyMiddleware(middleware, this.app);
    this.setupUpload();
    applyRoutes(routes, this.app);
    this.setupSPA();
    applyMiddleware(errorHandlers, this.app);
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

  private setupUpload() {
    this.app.post("/addmedia", upload.single("content"), addMedia);
  }

  listen() {
    const server = http.createServer(this.app);

    server.listen(App.PORT, () => {
      console.log(`[INFO] Server is running http://localhost:${App.PORT}`);
    });
  }
}

export default new App().app;
