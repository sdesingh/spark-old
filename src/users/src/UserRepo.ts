import { User, IUserModel } from "./model/UserSchema";
var random = require("randomatic");
import { logger } from "./services/logging";
import { statusError, statusOk } from "./services/response";

/** USER ACCOUNT */

// CREATE NEW USER.
export async function createUser(
  username: string,
  password: string,
  email: string
) {
  let verificationKey = random("A0", 5);

  let userDoc = {
    username,
    password,
    email,
    verificationKey
  };

  try {
    let user = await User.create(userDoc);

    return statusOk("Successfully created user", { user });
  } catch (err) {
    logger.error({
      message: "Unable to create user",
      error: err.error,
      userdata: {
        username,
        password,
        email
      }
    });
    return {
      status: "error",
      message: "Unable to create user."
    };
  }
}

export async function verifyUser(email: string, key: string) {
  const user = await getByEmail(email);

  if (!user) {
    return statusError(`User with email ${email} doesn't exist.`);
  }
  // user exists. verify.
  else {
    // Check if user already verified.
    if (user.isVerified) {
      return statusOk(`User ${user.username} is already verified.`);
    }

    // Check if provided key matches.
    if (user.verificationKey === key || key === process.env.SECRET_KEY!) {
      user.isVerified = true;
      user.save();
      return statusOk(`User ${user.username} was successfully verified.`);
    }
    // Key Doesn't Match
    else {
      return statusError("Invalid key provided.");
    }
  }
}

export async function getByEmail(email: string): Promise<IUserModel | null> {
  try {
    return await User.findOne({ email });
  } catch (err) {
    // Error occurred while retrieving user.
    logger.error({
      message: "Error occured while retrieving user.",
      error: err
    });
    return null;
  }
}

export async function getByUsername(
  username: string
): Promise<IUserModel | null> {
  try {
    return await User.findOne({ username });
  } catch (err) {
    // Error occurred while retrieving user.
    logger.error({
      message: "Error occured while retrieving user.",
      error: err
    });
    return null;
  }
}

export async function getUserById(id: string): Promise<IUserModel | null> {
  try {
    return await User.findById(id);
  } catch (err) {
    logger.error({
      message: "Error occured while retrieving user.",
      error: err
    });
    return null;
  }
}

export function deleteUserById(id: string) {}

/** USER ACTIONS */

export async function loginUser(username: string, password: string) {
  const user = await getByUsername(username);

  // User doesn't exist.
  if (!user) {
    return statusError("User not found.", null);
  }

  // Check if password is correct.
  if (user.password === password) {
    if (!user.isVerified) return statusError("You must verify this account.");

    return statusOk("Successfully logged in.", { user });
  } else {
    return statusError("Invalid credentials.", null);
  }
}

export async function followUser(
  username: string,
  usernameToFollow: string,
  followUser: boolean
) {
  let user = await getByUsername(username);
  let userToFollow = await getByUsername(usernameToFollow);

  if (!user || !userToFollow) {
    return statusError("User doesn't exist.", null);
  }

  // Follow this user.
  if (followUser) {
    // Check if already followed user.
    if (user.following.includes(userToFollow._id)) {
      return statusOk("Already following this user.", null);
    } else {
      // Add users to each other.
      user.following.push(userToFollow._id);
      userToFollow!.followers!.push(user._id);

      // Save changes.
      await Promise.all([userToFollow.save(), user.save()]);

      return statusOk("Successfully followed user.", null);
    }
  }
  // Unfollow this user.
  else {
    // Check if already unfollowed.

    if (!user.following.includes(userToFollow._id)) {
      return statusOk("Already unfollowed this user.", null);
    }
    // Unfollow user.
    else {
      // Remove users from each other.
      user.following.splice(user.following.indexOf(userToFollow._id), 1);
      userToFollow.followers.splice(
        userToFollow.followers.indexOf(user._id),
        1
      );

      // Save changes.
      await Promise.all([userToFollow.save(), user.save()]);
      return statusOk("Successfully unfollowed user.", null);
    }
  }
}

/** ITEM ACTIONS */
export async function addItem(username: string, itemid: string) {
  const user = await getByUsername(username);

  if (!user) return statusError("Unable to add item. User doesn't exist.");
  else {
    if (user.items.includes(itemid)) {
      return statusError("Item already added.");
    }

    user.items.push(itemid);
    user.save();

    return statusOk("Item added successfully.");
  }
}

export async function deleteItem(username: string, itemid: string) {
  const user = await getByUsername(username);

  if (!user) return statusError("Unable to delete item. User doesn't exist");
  else {
    if (user.items.includes(itemid)) {
      let itemIndex = user.items.indexOf(itemid);
      user.items.splice(itemIndex, 1);
      await user.save();
      return statusOk(`Successfully deleted item with ID: ${itemid}`);
    } else {
      return statusOk("Item doesn't exist.");
    }
  }
}

export async function likeItem(
  username: string,
  itemid: string,
  shouldLike: boolean
) {
  const user = await getByUsername(username);

  if (!user) return statusError(`User [${username}] doesn't exist.`);
  else {
    // Add item to likes.
    if (shouldLike) {
      // Check if already liked.
      if (user.likedItems.includes(itemid)) {
        return statusOk(`${username} already liked item with ID: ${itemid}`);
      } else {
        user.likedItems.push(itemid);
        await user.save();
        return statusOk(`${username} liked item with ID: ${itemid}`);
      }
    } else {
      if (!user.likedItems.includes(itemid)) {
        return statusOk(`${username} already unliked item with ID: ${itemid}`);
      } else {
        const itemIndex = user.likedItems.indexOf(itemid);
        user.likedItems.splice(itemIndex, 1);
        await user.save();
        return statusOk(`${username} unliked item with ID: ${itemid}`);
      }
    }
  }
}

export async function getUserFollowers(username: string, limit?: number) {
  const user = await getByUsername(username);

  if (!user) return statusError(`User ${username} doesn't exist.`);
  else {
    const userFollowers = user.followers;

    let itemLimit = limit === undefined ? 50 : limit;
    itemLimit = itemLimit > 200 ? 200 : itemLimit;

    const followerIds = userFollowers.slice(0, itemLimit);
    let followerUsers: any[] = [];
    const followers: any[] = [];

    followerIds.forEach((id: any) => followerUsers.push(getUserById(id)));

    followerUsers = await Promise.all(followerUsers);

    followerUsers.forEach((user: IUserModel) => followers.push(user.username));

    return statusOk(`Successfully retrieved ${username} followers.`, {
      followers
    });
  }
}

export async function getUserFollowing(username: string, limit?: number) {
  const user = await getByUsername(username);

  if (!user) return statusError(`User ${username} doesn't exist.`);
  else {
    const userFollowing = user.following;

    let itemLimit = limit === undefined ? 50 : limit;
    itemLimit = itemLimit > 200 ? 200 : itemLimit;

    const followingIds = userFollowing.slice(0, itemLimit);
    let followingUsers: any[] = [];
    const following: any[] = [];

    followingIds.forEach((id: any) => followingUsers.push(getUserById(id)));

    followingUsers = await Promise.all(followingUsers);

    followingUsers.forEach((user: IUserModel) => following.push(user.username));

    return statusOk(`Successfully retrieved ${username} following.`, {
      following
    });
  }
}

export async function reset() {
  await User.deleteMany({});
  return statusOk("Successfully deleted all users.");
}
