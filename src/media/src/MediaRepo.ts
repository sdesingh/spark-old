import { logger } from "./services/logging";
import { statusError, statusOk } from "./services/response";
import { Media } from "./model/MediaSchema";

export async function createMedia(
  filename: string,
  filesize: string,
  mimetype: string,
  uploadedBy: string,
  uploadedOn: Date
) {
  const mediaDoc = {
    filename,
    filesize,
    mimetype,
    uploadedBy,
    uploadedOn
  };

  try {
    const newMedia = await Media.create(mediaDoc);
    return statusOk(`Added media item successfully ${newMedia._id}`);
  } catch (err) {
    return statusError("Unable to create item.", err);
  }
}

export async function getMedia(itemid: string) {
  const media = await Media.findById(itemid);

  if (!media)
    return statusError(`Unable to find media item with ID: ${itemid}`);
  else {
    return statusOk(`Sucessfully retrieved item with ID: ${itemid}`, { media });
  }
}

export async function reset() {
  await Media.deleteMany({});
  return statusOk("Successfully deleted all media.");
}
