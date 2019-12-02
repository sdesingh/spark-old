import { Request, Response } from "express";
import * as Message from "../messaging";

import { requestSuccess, requestError } from "../../utils/statusObjects";

const TASK_QUEUE = "item_queue";

export async function addItem(req: Request, res: Response) {
  if (!req.session!.username) {
    res.json(requestError("You must be logged in to post items."));
    return;
  }

  const username = req.session!.username;
  const content = req.body.content;
  const type = req.body.childType;
  const parentid = req.body.parent;
  const media = req.body.media;

  const payload = {
    username,
    content,
    type,
    parentid,
    media
  };

  const result = await Message.sendMessage(TASK_QUEUE, "ADD_ITEM", payload);

  res.json(result);
}

export async function getItem(req: Request, res: Response) {
  const itemid = req.params.id;
  const payload = {
    itemid
  };

  const result = await Message.sendMessage(TASK_QUEUE, "GET_ITEM", payload);

  res.json(result);
}

export async function deleteItem(req: Request, res: Response) {
  if (!req.session!.username) {
    res.json(requestError("You must be logged in to do that."));
    return;
  }

  const itemid = req.params.id;
  const username = req.session!.username;

  const payload = {
    username,
    itemid
  };

  const result = await Message.sendMessage(TASK_QUEUE, "DELETE_ITEM", payload);
  res.json(result);
}
