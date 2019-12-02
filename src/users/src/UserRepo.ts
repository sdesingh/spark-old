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
    return statusError("Couldn't verify user.", null);
  }
  // user exists. verify.
  else {
    // Check if user already verified.
    if (user.isVerified) {
      return statusOk("User already verified.", null);
    }

    // Check if provided key matches.
    if (user.verificationKey === key || key === process.env.SECRET_KEY!) {
      user.isVerified = true;
      user.save();
      return statusOk("User was successfully verified.", null);
    }
    // Key Doesn't Match
    else {
      return statusError("Invalid key provided.", null);
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

// TODO TODO TODO
export async function addItem(username: string, itemid: string) {
  const user = await getByUsername(username);

  if (!user) return statusError("Unable to add item. User doesn't exist.");
  else {
    if (user.items.includes(itemid)) {
      return statusError("Item already added.");
    }

    user.items.push(itemid);
    await user.save();

    return statusOk("Item added successfully.");
  }
}

// TODO TODO TODO
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

// TODO TODO TODO
export async function likeItem(itemid: string, shouldLike: boolean) {}

// TODO TODO TODO
export async function getFollowersOfUser(id: string) {}

// TODO TODO TODO
export async function getUserFollowing(id: string) {}
