import express from "express";
import { verifyToken } from "../middleware/is-auth.js";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controllers/posts.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);
router.put("/:postId/like", verifyToken, likePost);

export default router;
