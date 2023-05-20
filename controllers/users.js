import User from "../models/user.js";

export const getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 404;
    }
    next(err);
  }
};

export const getUserFriends = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
    }
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ firstName, lastName, _id, occupation, location, picturePath }) => {
        return {
          firstName,
          lastName,
          _id,
          occupation,
          location,
          picturePath,
        };
      }
    );
    res.status(200).json({ friends: formattedFriends });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 404;
    }
    next(err);
  }
};

export const addRemoveFriend = async (req, res, next) => {
  const { userId, friendId } = req.params;
  try {
    if (userId.toString() === friendId.toString()) {
      const error = new Error("Cannot send friend requset to yourself.");
      error.statusCode = 403;
      throw error;
    }
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== userId);
    } else {
      user.friends.push(friendId);
      friend.friends.push(userId);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ firstName, lastName, _id, occupation, location, picturePath }) => {
        return {
          firstName,
          lastName,
          _id,
          occupation,
          location,
          picturePath,
        };
      }
    );

    res.status(200).json({ friends: formattedFriends });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 404;
    }
    next(err);
  }
};
