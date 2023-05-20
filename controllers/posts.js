import Post from "../models/posts.js";
import User from "../models/user.js";

export const createPost = async (req, res, next) => {
  const { userId, description, picturePath } = req.body;
  try {
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(201).json({ message: "Post created.", posts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 409;
    }
    next(err);
  }
};

export const getFeedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ posts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 404;
    }
    next(err);
  }
};

export const getUserPosts = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const userPosts = await Post.find({ userId: userId });
    res.status(200).json({ posts: userPosts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 404;
    }
    next(err);
  }
};

export const likePost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(postId);
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json({ updatedPost: updatedPost });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
