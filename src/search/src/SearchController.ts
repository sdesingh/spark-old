import * as repo from "./SearchRepo";
import { logger } from "./services/logging";
import Timer from "./services/timer";
import { statusError, statusOk } from "./services/responseObjects";
import * as Message from "./services/messaging";

Message.initMessaging();

const search = async (payload: any) => {
  return repo.search(payload.searchParams);
};

const indexItem = async (payload: any) => {
  return repo.indexItem(payload.doc);
};

const deleteItem = async (payload: any) => {
  return repo.deleteItem(payload.itemid);
};

const invalidRequest = () => {
  logger.warn("Invalid request made.");
  return statusError("Invalid Request Made...", null);
};

export const controller: { [action: string]: Function } = {
  SEARCH: search,
  INDEX_ITEM: indexItem,
  DELETE_ITEM: deleteItem,
  RESET: repo.reset,
  INVALID: invalidRequest
};
