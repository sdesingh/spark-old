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

const deleteMedia = async (payload: any) => {
  return repo.deleteMedia(payload.itemid);
};

const getMedia = async (payload: any) => {
  return repo.getMedia(payload.itemid);
};

const associateMediaWith = async (payload: any) => {
  return repo.associateMediaWith(payload.itemid, payload.associateid);
};

export const controller: { [action: string]: Function } = {
  ADD_MEDIA: addMedia,
  ASSOCIATE_MEDIA_WITH: associateMediaWith,
  DELETE_MEDIA: deleteMedia,
  GET_MEDIA: getMedia,
  RESET: repo.reset
};
