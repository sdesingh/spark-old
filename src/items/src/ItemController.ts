import * as repo from "./ItemRepo";
import { logger } from "./services/logging";
import Timer from "./services/timer";
import { statusError, statusOk } from "./services/responseObjects";
import * as Message from "./services/messaging";

Message.initMessaging();

const addItem = async (payload: any) => {
  return repo.addItem(
    payload.username,
    payload.content,
    payload.type,
    payload.parentid,
    payload.media
  );
};

const deleteItem = async (payload: any) => {
  return repo.deleteItem(payload.username, payload.itemid);
};

const likeItem = async (payload: any) => {
  return repo.likeItem(payload.username, payload.itemid, payload.shouldLike);
};

const getItem = async (payload: any) => {
  const item = await repo.getItem(payload.itemid);

  if (!item) {
    return statusError(`Unable to find item with ID: ${payload.itemid}`);
  } else {
    return statusOk(`Retrieved item with ID: ${payload.itemid}`, { item });
  }
};

const getItemsByUser = async (payload: any) => {
  return repo.getItemsByUser(payload.username, payload.limit);
};

const invalidRequest = (payload: any) => {
  logger.warn(`INVALID_REQUEST [${payload.actionName}]`);
  return statusError("Invalid Request Made...", null);
};

export const controller: { [action: string]: Function } = {
  GET_ITEM: getItem,
  GET_ITEMS_BY_USER: getItemsByUser,
  ADD_ITEM: addItem,
  DELETE_ITEM: deleteItem,
  LIKE_ITEM: likeItem,
  INVALID: invalidRequest
};
