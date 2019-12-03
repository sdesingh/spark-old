import { Request, Response } from "express";
import { controller } from "../MediaController";
import { logger } from "./logging";
import Timer from "./timer";

export default [
  {
    path: "/action",
    method: "post",
    handler: async (req: Request, res: Response) => {
      const { actionName, payload } = req.body;

      let response: any;

      // Sent an invalid task.
      if (!controller[actionName]) {
        response = await controller["INVALID"](payload);
      }
      // Do work on task.
      else {
        // Start timer for metrics.
        const t = new Timer();

        response = await controller[actionName](payload);

        // Stop timer. Log result.
        logger.info({
          message: `${actionName}`,
          result: response.status,
          // payload: payload,
          timestamp: new Date(),
          time: t.stop()
        });
      }

      res.json(response);
    }
  }
];
