import express from "express";
import authValidation from "../middlewares/authValidation.middleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostByUserId,
  updatePost,
} from "../controllers/post.controller.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { postSchema } from "../utils/validation.js";

const router = express.Router();

router.post("/create", authValidation, validateSchema(postSchema), createPost);
router.patch(
  "/update/:postId",
  authValidation,
  validateSchema(postSchema),
  updatePost
);
router.delete("/delete/:postId", authValidation, deletePost);
router.get("/all", getAllPosts);
router.get("/get/:postId", getPostById);
router.get("/user-posts/:userId", getPostByUserId);

export default router;
