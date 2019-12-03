import axios from "axios";
import { logger } from "./logging";

export async function sendMessage(
  queue: string,
  actionName: string,
  payload: any
) {
  const url = process.env[queue]! + "/action";
  const body = {
    actionName,
    payload
  };

  try {
    const { data } = await axios.post(url, body, { responseType: "json" });
    return data;
  } catch (err) {
    logger.error(`[${actionName}]`, err);
    return {
      status: "error",
      message: `Unable to fulfill request [${actionName}]`
    };
  }
}
