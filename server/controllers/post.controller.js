import mongoose from "mongoose";
import Post from "../schemas/post.schema.js";

export const createPost = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { content, title } = req.body;

    if (!_id) {
      throw { status: 401, message: "Unauthorized" };
    }
    if (!content.trim() || !title.trim()) {
      throw { status: 400, message: "Content and title are required" };
    }

    const post = await Post.create({
      content,
      title,
      author: _id,
    });

    if (!post) {
      throw { status: 500, message: "Error creating post" };
    }

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { postId } = req.params;
    const { content, title } = req.body;

    if (!_id) {
      throw { status: 401, message: "Unauthorized" };
    }

    if (!postId || !mongoose.isValidObjectId(postId)) {
      throw { status: 400, message: "Invalid Post ID" };
    }

    if (!content.trim() || !title.trim()) {
      throw { status: 400, message: "Content and title are required" };
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw { status: 404, message: "Post not found" };
    }

    if (post.author.toString() !== _id.toString()) {
      throw { status: 401, message: "Unauthorized" };
    }

    post.content = content;
    post.title = title;
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { postId } = req.params;

    if (!_id) {
      throw { status: 401, message: "Unauthorized" };
    }

    const post = await Post.findById(postId);

    if (post.author.toString() !== _id.toString()) {
      throw { status: 401, message: "Unauthorized" };
    }

    if (!postId || !mongoose.isValidObjectId(postId)) {
      throw { status: 400, message: "Invalid Post ID" };
    }

    await Post.findByIdAndDelete(postId);

    if (!post) {
      throw { status: 404, message: "Post not found" };
    }

    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", ["firstName", "lastName", "profilePic", "userName"])
      .select("-__v");

    if (!posts) {
      throw { status: 404, message: "No posts found" };
    }

    if (!posts.length) {
      return res.status(200).json({ data: [] });
    }

    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!postId || !mongoose.isValidObjectId(postId)) {
      throw { status: 400, message: "Invalid Post ID" };
    }

    const post = await Post.findById(postId)
      .populate("author", ["firstName", "lastName", "profilePic", "userName"])
      .select("-__v");

    if (!post) {
      throw { status: 404, message: "Post not found" };
    }

    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const getPostByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw { status: 400, message: "Invalid User ID" };
    }

    const posts = await Post.find({ author: userId })
      .populate("author", ["firstName", "lastName", "profilePic", "userName"])
      .select("-__v");

    if (!posts) {
      throw { status: 404, message: "No posts found" };
    }

    if (!posts.length) {
      return res.status(200).json({ data: [] });
    }

    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};
