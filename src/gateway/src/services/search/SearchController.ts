import { Request, Response } from "express";
import * as Message from "../messaging";
import { requestError, requestSuccess } from "../../utils/statusObjects";

export async function search(req: Request, res: Response) {
  const payload = {
    searchParams: req.body
  };

  if (req.body.following === true) {
    payload.searchParams.username = req.session!.username;
  }

  if (req.session!.username === undefined) {
    payload.searchParams.following = false;
  }
  const searchResult = await Message.sendMessage(
    "search_queue",
    "SEARCH",
    payload
  );

  if (searchResult.status !== "OK") {
    res.json(requestError("Unable to get search results for this query."));
  } else {
    res.json(searchResult);
  }
}
