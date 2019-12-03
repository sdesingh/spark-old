import * as repo from "./MediaRepo";
import { logger } from "./services/logging";
import { statusError, statusOk } from "./services/response";

const addMedia = async (payload: any) => {
  return repo.createMedia(
    payload.filename,
    payload.filesize,
    payload.mimetype,
    payload.uploadedBy,
    payload.uploadedOn
  );
};

const getMedia = async (payload: any) => {
  return repo.getMedia(payload.itemid);
};

export const controller: { [action: string]: Function } = {
  ADD_MEDIA: addMedia,
  GET_MEDIA: getMedia,
  RESET: repo.reset
};
