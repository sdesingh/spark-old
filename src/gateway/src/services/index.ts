import { Request, Response } from "express";
import userRoutes from "./user/routes";
import itemRoutes from "./item/routes";
import mediaRoutes from "./media/routes";
import searchRoutes from "./search/routes";
import { sendMessage } from "./messaging";

export default [
  {
    path: "/emit",
    method: "post",
    handler: async (req: Request, res: Response) => {
      const { action, queue, payload } = req.body;

      const result = await sendMessage(queue, action, payload);

      res.json(result);
    }
  },
  {
    path: "/reset",
    method: "delete",
    handler: async (req: Request, res: Response) => {
      if (req.body.pass !== "watermelon") {
        res.json({ message: "no." });
      } else {
        await Promise.all([
          sendMessage("user_queue", "RESET", {}),
          sendMessage("media_queue", "RESET", {}),
          sendMessage("item_queue", "RESET", {}),
          sendMessage("search_queue", "RESET", {})
        ]);

        res.json({ message: "done." });
      }
    }
  },
  ...userRoutes,
  ...itemRoutes,
  ...mediaRoutes,
  ...searchRoutes
];
