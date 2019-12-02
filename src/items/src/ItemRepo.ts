import { User, IUserModel } from "./model/UserSchema";
import { Item, IItemModel } from "./model/ItemSchema";
import { logger } from "./services/logging";
import { statusError, statusOk } from "./services/responseObjects";
import { ItemType } from "./model/ItemSchema";
import * as Message from "./services/messaging";

export async function addItem(
  username: string,
  content: string,
  type: ItemType | null,
  parentid: string | null,
  media: string[] | null
) {
  if (type === null) {
    type = ItemType.POST;
  }

  const itemDoc = {
    user: username,
    parent: parentid,
    content,
    type,
    media
  };

  try {
    // Create item.
    const createdItem = await Item.create(itemDoc);

    // Add item to the user.
    const result = await Message.sendMessage("user_queue", "ADD_ITEM", {
      username,
      itemid: createdItem._id
    });

    if (result.status === "OK") {
      return statusOk("Successfully added item", { id: createdItem._id });
    } else {
      Item.findByIdAndDelete(createdItem._id);
      return statusError("Unable to add item.", result.message);
    }
  } catch (err) {
    return statusError("Unable to add item.", err);
  }
}

// TODO TODO TODO
export async function deleteItem(username: string, itemid: string) {
  const item = await getItem(itemid);

  // Check if the item exists.
  if (!item) {
    return statusError(`Item with the ID: ${itemid} doesn't exist.`);
  }
  // Item exists.
  else {
    // Item owned by user. Delete.
    if (item.user === username) {
      // Delete item from user.
      const result = await Message.sendMessage("user_queue", "DELETE_ITEM", {
        username,
        itemid
      });

      if (result.status === "OK") {
        // Delete item from db.
        await Item.findByIdAndDelete(itemid);
        return statusOk(`Item with ID: ${itemid} successfully deleted.`);
      }
      // User was unable to delete the item.
      else {
        return statusError(
          `Unable to delete item with ID: ${itemid}`,
          result.message
        );
      }
    }
    // Item not owned by that username.
    else {
      return statusError(`${username} doesn't own item. Can't delete.`);
    }
  }
}

export async function getItem(itemid: string) {
  try {
    return await Item.findById(itemid);
  } catch (err) {
    logger.warn(`[GET_ITEM] ${err.message}`);
    return null;
  }
}

// TODO TODO TODO
export async function likeItem(
  username: string,
  itemid: string,
  shouldLike: boolean
) {
  const item = await getItem(itemid);

  return statusOk("Liked item", null);

  // if (!item) {
  //   return statusError("Item not found.", null);
  // }
  // else {

  //   if(shouldLike) {
  //     item.likes += 1;
  //   }

  // }
}
