const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const pageSize = 2;

  try {
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      code: 0,
      message: "Fetch posts successfully.",
      posts,
      totalItems,
      pageSize,
      pageNumber: currentPage,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  // if (!req.file) {
  //   const error = new Error("No image provided.");
  //   error.statusCode = 422;
  //   throw error;
  // }

  // const imageUrl = req.file.path;

  // Create post in db
  const { title, content } = req.body;

  try {
    const post = new Post({
      title,
      content,
      imageUrl: "images/apple-watch-s9.jpg",
      creator: req.userId,
    });

    const result = await post.save();

    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    res.status(201).json({
      code: 0,
      message: "Post created successfully!",
      post: result,
      creator: {
        _id: user.id,
        name: user.name,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    res.status(200).json({
      message: "Post fetched",
      post,
    });
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      code: 0,
      message: "Post fetched",
      post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const { postId } = req.params;

  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  let { title, content, imageUrl } = req.body;

  if (req.file) {
    imageUrl = req.file.path;
  }

  // if (!imageUrl) {
  //   const error = new Error("No file picked.");
  //   error.statusCode = 422;
  //   throw error;
  // }

  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("Couldn't find post.");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    // if (imageUrl !== post.imageUrl) {
    //   clearImage(post.imageUrl);
    // }

    post.title = title;
    post.content = content;
    // post.imageUrl = imageUrl;

    const result = await post.save();

    res.status(200).json({
      message: "Post updated!",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found.");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    res.status(200).json({
      code: 0,
      message: "Deleted Post.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      throw err;
    }
    next(err);
  }
};
