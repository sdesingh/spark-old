import env from "dotenv";
import amqplib, { Connection, Channel, ConsumeMessage } from "amqplib";
import { controller } from "./SearchController";
import { connectDb } from "./services/mongo";
import Timer from "./services/timer";
import { logger } from "./services/logging";
import { statusError } from "./services/responseObjects";
// Load environment vars.
env.config();

const QUEUE_URL = process.env.QUEUE_URL!;
const QUEUE_NAME = process.env.QUEUE_NAME!;

let connection: Connection;
let channel: Channel;

async function connectMessaging() {
  connection = await amqplib.connect(QUEUE_URL);
  channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: false });
  await channel.prefetch(1);

  channel.consume(QUEUE_NAME, msg => consumeTaskRequests(msg!));
  console.log("[x] Successfully connected to message queue");
  console.log("  [.] Listening for " + QUEUE_NAME + " tasks...");
}

async function consumeTaskRequests(msg: ConsumeMessage) {
  let payload = JSON.parse(msg!.content.toString());

  let reqAction = payload.actionName;
  let res: any;

  // Sent an invalid task.
  if (!controller[reqAction]) {
    res = await controller["INVALID"](payload);
  }
  // Do work on task.
  else {
    // Start timer for metrics.
    const t = new Timer();
    try {
      res = await controller[reqAction](payload);

      const log = {
        message: `[${reqAction}]`,
        result: res.status,
        // payload: payload,
        timestamp: new Date(),
        time: t.stop()
      };

      // Stop timer. Log result.

      if (res.status === "OK") {
        logger.info(log);
      } else {
        logger.warn(log);
      }
    } catch (err) {
      console.log(err);
      res = statusError(`Unable to fulfill request ${reqAction}`);
      // Stop timer. Log result.
      logger.error({
        message: `[${reqAction}]`,
        result: res.status,
        error: err,
        timestamp: new Date(),
        time: t.stop()
      });
    }
  }

  // Send result back.
  channel.sendToQueue(
    msg!.properties.replyTo,
    Buffer.from(JSON.stringify(res)),
    {
      correlationId: msg!.properties.correlationId
    }
  );

  channel.ack(msg!);
}

async function start() {
  console.log("Starting application...");
  await connectMessaging();
  await connectDb();
  console.log("Successfully started application.");
}

start(); // Start application.
