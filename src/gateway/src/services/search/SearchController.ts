import { Request, Response } from "express";
import * as Message from "../messaging";
import { requestError, requestSuccess } from "../../utils/statusObjects";

export async function search(req: Request, res: Response) {
  const payload = {
    searchParams: req.body
  };

  // User is logged in.
  if (req.session!.username) {
    payload.searchParams.loggedInUser = req.session!.username;
  }

  // User is not logged in. Don't show "following" even if asked.
  if (!req.session!.username) {
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
    res.json({
      status: "OK",
      message: searchResult.message,
      items: searchResult.data.items
    });
  }
}
