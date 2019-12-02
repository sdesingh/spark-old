import amqpblib, { ConsumeMessage } from "amqplib";
import { Connection, Replies, Channel } from "amqplib";

export let connection: Connection;
export let channel: Channel;
export let q: Replies.AssertQueue;

export let taskQueue: any = {};

initMessaging();

function generateUUID(): string {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

export async function initMessaging() {
  try {
    connection = await amqpblib.connect(process.env.QUEUE_URL!);
    channel = await connection.createChannel();
    q = await channel.assertQueue("", { exclusive: true });
    console.log(`Successfully connected to message broker.`);

    let handleRequest = async (msg: ConsumeMessage | null) => {
      let content = JSON.parse(msg!.content.toString());

      let reqId = msg!.properties.correlationId;

      let handler: any = taskQueue[reqId];
      handler.resolve(content);
      taskQueue[reqId] = null;
    };

    channel.consume(q.queue, handleRequest, { noAck: true });
  } catch (err) {
    console.log(`Unable to connect to message broker: ${err}`);
  }
}

export async function sendMessage(
  queue: string,
  actionName: string,
  payload: any
) {
  return new Promise<any>((resolve, reject) => {
    let requestUUID: string = generateUUID();
    taskQueue[requestUUID] = { resolve, reject };
    payload.actionName = actionName;

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      correlationId: requestUUID,
      replyTo: q.queue
    });
  });
}
