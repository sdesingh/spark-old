import { Request, Response } from "express";
import { requestError } from "../../utils/statusObjects";
import * as Message from "../messaging";
import fs from "fs";
import path from "path";

export async function addMedia(req: Request, res: Response) {
  if (!req.session!.username) {
    res.json(requestError("You must be logged in to do that."));
    return;
  }
  const username = req.session!.username;

  const payload = {
    filename: req.file.filename,
    filesize: req.file.size,
    mimetype: req.file.mimetype,
    uploadedBy: username,
    uploadedOn: new Date()
  };

  const mediaResult = await Message.sendMessage(
    "media_queue",
    "ADD_MEDIA",
    payload
  );

  if (mediaResult.status === "OK") {
    res.json({
      status: "OK",
      message: mediaResult.message,
      id: mediaResult.data.item._id
    });
  } else {
    res.json(mediaResult);
  }
}

export async function getMedia(req: Request, res: Response) {
  const itemid = req.params.id;
  const mediaMeta = await Message.sendMessage("media_queue", "GET_MEDIA", {
    itemid
  });

  try {
    if (mediaMeta.status !== "OK") {
      res
        .status(404)
        .json(
          requestError(`Couldn't retrieve media item with the ID: ${itemid}.`)
        );
    } else {
      const filename = mediaMeta.data.media.filename;
      const fileType = mediaMeta.data.media.mimetype;
      res.writeHead(200, { "Content-Type": fileType });
      fs.createReadStream(path.join("../uploads/", filename)).pipe(res);
    }
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json(requestError(`Unable to retrieve item with ID: ${itemid}`));
  }
}
