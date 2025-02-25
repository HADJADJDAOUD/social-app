import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controllers/postController.js";

const router = express.Router();
/* READ */
router.get("/", getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
export default router;
