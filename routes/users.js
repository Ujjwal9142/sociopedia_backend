import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getPopularUsers,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/is-auth.js";

const router = express.Router();

router.get("/popular", verifyToken, getPopularUsers);
router.get("/:userId", verifyToken, getUser);
router.get("/:userId/friends", verifyToken, getUserFriends);
router.put("/:userId/:friendId", verifyToken, addRemoveFriend);

export default router;
