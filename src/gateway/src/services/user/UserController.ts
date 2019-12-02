import { Request, Response } from "express";
import * as Message from "../messaging";
import { requestSuccess, requestError } from "../../utils/statusObjects";

const USER_QUEUE = "user_queue";

export async function createUser(req: Request, res: Response) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let payload = {
    username,
    email,
    password
  };

  let result = await Message.sendMessage(USER_QUEUE, "ADD_USER", payload);

  res.json(result);
}

export async function verifyUser(req: Request, res: Response) {
  let email = req.body.email;
  let key = req.body.key;

  let payload = {
    email,
    key
  };

  let result = await Message.sendMessage(USER_QUEUE, "VERIFY_USER", payload);

  res.json(result);
}

export async function getUser(req: Request, res: Response) {
  let username = req.params.username;
  let payload = {
    username
  };

  let result = await Message.sendMessage(
    USER_QUEUE,
    "GET_BY_USERNAME",
    payload
  );

  res.json(result);
}

export async function loginUser(req: Request, res: Response) {
  const username = req.body.username;
  const password = req.body.password;

  const payload = {
    username,
    password
  };

  const result = await Message.sendMessage(USER_QUEUE, "LOGIN_USER", payload);

  // Login success.
  if (result.status === "OK") {
    req.session!.username = result.data.user.username;
    req.session!.userid = result.data.user._id;

    const response = requestSuccess("Logged in successfully");
    response["user"] = result.data.user;
    res.json(response);
  }
  // Login failure.
  else {
    const response = requestError(result.message);
    res.json(response);
  }
}

export async function logoutUser(req: Request, res: Response) {
  // Check if user session exists.
  if (!req.session) {
    res.json(requestError("Never logged in."));
  }
  // Session exists. Log out.
  else {
    req.session = undefined;
    res.json(requestSuccess("Successfully logged out."));
  }
}

export async function followUser(req: Request, res: Response) {
  if (!userIsLoggedIn(req)) {
    requestError("You must be logged in.");
    return;
  }

  let username = req.session!.username;
  let usernameToFollow = req.body.username;
  let followUser = req.body.follow === undefined ? true : req.body.follow;

  let payload = {
    username,
    usernameToFollow,
    followUser
  };

  let result = await Message.sendMessage(USER_QUEUE, "FOLLOW_USER", payload);

  res.json(result);
}

export async function getFollowers(req: Request, res: Response) {
  const username = req.params.username;
  const limit = req.body.limit;

  const payload = {
    username,
    limit
  };

  const result = await Message.sendMessage(
    "user_queue",
    "GET_FOLLOWERS",
    payload
  );

  res.json(result);
}

export async function getFollowing(req: Request, res: Response) {
  const username = req.params.username;
  const limit = req.body.limit;

  const payload = {
    username,
    limit
  };

  const result = await Message.sendMessage(
    "user_queue",
    "GET_FOLLOWING",
    payload
  );

  res.json(result);
}

export function userIsLoggedIn(req: Request): boolean {
  return req.session!.username !== null;
}
