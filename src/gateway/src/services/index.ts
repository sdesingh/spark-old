import { Request, Response } from "express";
import userRoutes from "./user/routes";
import itemRoutes from "./item/routes";

export default [
  {
    path: "/",
    method: "get",
    handler: async (req: Request, res: Response) => {
      res.json({ status: "OK", message: "Hello world!" });
    }
  },
  ...userRoutes,
  ...itemRoutes
];
