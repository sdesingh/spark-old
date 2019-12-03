import { Item, IItemModel } from "./model/ItemSchema";
import { logger } from "./services/logging";
import { statusError, statusOk } from "./services/responseObjects";
import { ItemType } from "./model/ItemSchema";
import * as Message from "./services/messaging";
import { client } from "./services/elastic";

export async function search(searchParams: any) {
  const {
    timestamp,
    limit,
    q,
    username,
    loggedInUser,
    hasMedia,
    following,
    replies,
    rank,
    parent
  } = searchParams;

  // Set search limit.
  let searchLimit = limit !== undefined ? limit : 25;
  searchLimit = searchLimit > 200 ? 200 : searchLimit;

  const currentTime = parseInt((new Date().getTime() / 1000).toFixed(0));
  let searchTimestamp = timestamp !== undefined ? timestamp : currentTime;

  let showMediaOnly = hasMedia !== undefined ? hasMedia : false;
  let showReplies = replies !== undefined ? replies : true;

  let showFromFollowing = following !== undefined ? following : true;

  const must: any[] = [];
  const must_not: any[] = [];

  // Search for specific terms.
  if (q !== undefined || q) {
    must.push({ match: { content: q } });
  }

  // Search for posts by specific user.
  if (username !== undefined) {
    must.push({ match: { user: username } });
  }

  // Exclude replies.
  if (!showReplies) {
    must_not.push({ match: { type: "reply" } });
  }

  // Specific parent.
  if (parent !== undefined && replies) {
    must.push({ match: { parent } });
  }

  // Show from following
  if (showFromFollowing) {
    if (loggedInUser === undefined)
      return statusError(
        "Unable to make query. Username undefined for following."
      );

    const followingResult = await Message.sendMessage(
      "user_queue",
      "GET_FOLLOWING",
      { username: loggedInUser }
    );

    if (followingResult.status !== "OK")
      return statusError("Unable to retrieve following.");

    const { following } = followingResult.data;

    must.push({
      terms: {
        user: following,
        boost: 1.0
      }
    });
  }

  // Media filter.
  if (showMediaOnly) {
    must.push({ match: { hasMedia: showMediaOnly } });
  }

  // Time filter.
  must.push({ range: { timestamp: { lte: searchTimestamp } } });

  try {
    const { body } = await client.search({
      index: "items",
      body: {
        query: {
          bool: {
            must,
            must_not
          }
        },

        sort: [{ timestamp: { order: "desc" } }]
      },
      size: searchLimit
    });

    // Format results.

    const items: any[] = [];

    body.hits.hits.forEach((itemDoc: any) => {
      const document = itemDoc._source;
      items.push(convertSearchItemDoc(document));
    });

    return statusOk("Retrieved search results.", { items });
  } catch (err) {
    console.log(err);
    return statusOk("Unable to get search results", err);
  }
}

export async function indexItem(doc: any) {
  try {
    await client.index({
      index: "items",
      id: doc.id,
      refresh: "true",
      body: doc
    });

    return statusOk("Item added successfully.");
  } catch (err) {
    console.log(err);
    return statusError("Unable to index item.");
  }
}

export async function deleteItem(itemid: string) {
  client.delete({
    index: "items",
    id: itemid,
    refresh: "true"
  });

  return statusOk(`Successfully deleted item with ID: ${itemid}`);
}

export async function reset() {
  try {
    await client.indices.delete({ index: "items" });
    return statusOk("Successfully deleted all indices.");
  } catch (err) {
    return statusError("Couldn't delete indices.", err);
  }
}

function convertSearchItemDoc(doc: any) {
  return {
    id: doc.id,
    childType: doc.type,
    username: doc.user,
    content: doc.content,
    parent: doc.parent,
    media: doc.media,
    property: {
      likes: doc.likes
    },
    retweeted: doc.retweeted,
    timestamp: doc.timestamp
  };
}
