import * as repo from "./UserRepo";
import { logger } from "./services/logging";
import { statusError, statusOk } from "./services/response";

const addUser = async (payload: any) => {
  return repo.createUser(payload.username, payload.password, payload.email);
};

const verifyUser = async (payload: any) => {
  return repo.verifyUser(payload.email, payload.key);
};

const getByUsername = async (payload: any) => {
  try {
    const user = await repo.getByUsername(payload.username);

    if (!user) return statusError("User with that username doesn't exist.");
    else return statusOk("User retrieved.", { user });
  } catch (err) {
    return statusError("Unable to get user.", err);
  }
};

const followUser = async (payload: any) => {
  return repo.followUser(
    payload.username,
    payload.usernameToFollow,
    payload.followUser
  );
};

const getFollowers = async (payload: any) => {
  return repo.getUserFollowers(payload.username, payload.limit);
};

const getFollowing = async (payload: any) => {
  return repo.getUserFollowing(payload.username, payload.limit);
};

const addItem = async (payload: any) => {
  return repo.addItem(payload.username, payload.itemid);
};

const deleteItem = async (payload: any) => {
  return repo.deleteItem(payload.username, payload.itemid);
};

const likeItem = async (payload: any) => {
  return repo.likeItem(payload.username, payload.itemid, payload.shouldLike);
};

const loginUser = async (payload: any) => {
  return repo.loginUser(payload.username, payload.password);
};

const invalidRequest = () => {
  logger.warn("Invalid request made.");
  return statusError("Invalid Request Made...", null);
};

export const controller: { [action: string]: Function } = {
  /** ACCOUNT ACTIONS */
  ADD_USER: addUser,
  VERIFY_USER: verifyUser,
  LOGIN_USER: loginUser,
  GET_BY_USERNAME: getByUsername,
  GET_FOLLOWERS: getFollowers,
  GET_FOLLOWING: getFollowing,

  /** USER ACTIONS */
  FOLLOW_USER: followUser,

  /** ITEM ACTIONS */
  ADD_ITEM: addItem,
  DELETE_ITEM: deleteItem,
  LIKE_ITEM: likeItem,
  INVALID: invalidRequest,
  RESET: repo.reset
};
