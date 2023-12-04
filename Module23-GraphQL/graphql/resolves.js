const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Post = require("../models/post");

const { clearImage } = require("../util/file");

module.exports = {
  async createUser({ userInput }, req) {
    const { email, name, password } = userInput;

    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({
        message: "Email is invalid.",
      });
    }

    if (
      !validator.isEmpty(password) ||
      !validator.isLength(password, {
        min: 6,
        max: 12,
      })
    ) {
      errors.push({
        message: "Password is invalid.",
      });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
    };
  },

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }
    const isEqual = bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("email or password is incorrect.");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "SomeSuperSecret",
      {
        expiresIn: "3h",
      }
    );
    return { token, userId: user._id.toString() };
  },

  async createPost({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const errors = [];
    const { title, content, imageUrl } = postInput;

    if (
      validator.isEmpty(title) ||
      !validator.isLength(title, {
        min: 5,
      })
    ) {
      errors.push({
        message: "Title is invalid.",
      });
    }

    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, {
        min: 5,
      })
    ) {
      errors.push({
        message: "Content is invalid.",
      });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid user.");
      error.data = errors;
      error.code = 401;
      throw error;
    }

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: user,
    });

    const createdPost = await post.save();
    // Add post to users' posts;
    user.posts.push(createdPost);
    await user.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toLocaleString(),
      updatedAt: createdPost.updatedAt.toLocaleString(),
    };
  },

  async posts({ page }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const totalPosts = await Post.find().countDocuments();

    if (!page) {
      page = 1;
    }

    const perPage = 2;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");

    return {
      posts: posts.map((p) => ({
        ...p._doc,
        _id: p._id.toString(),
        createdAt: p.createdAt.toLocaleString(),
        updatedAt: p.updatedAt.toLocaleString(),
      })),
      totalPosts,
    };
  },

  async post({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id).populate("creator");

    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
      throw error;
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toLocaleString(),
      updatedAt: post.updatedAt.toLocaleString(),
    };
  },

  async updatePost({ id, postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id).populate("creator");

    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Not authenticated!");
      error.code = 403;
      throw error;
    }

    const { title, content, imageUrl } = postInput;

    const errors = [];

    if (
      validator.isEmpty(title) ||
      !validator.isLength(title, {
        min: 5,
      })
    ) {
      errors.push({
        message: "Title is invalid.",
      });
    }

    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, {
        min: 5,
      })
    ) {
      errors.push({
        message: "Content is invalid.",
      });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    post.title = title;
    post.content = content;
    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = imageUrl;
    }
    const updatedPost = await post.save();

    return {
      ...updatedPost._doc,
      _id: updatedPost._id,
      createdAt: updatedPost.createdAt.toLocaleString(),
      updatedAt: updatedPost.updatedAt.toLocaleString(),
    };
  },

  async deletePost({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id);

    if (!post) {
      const error = new Error("No post found!");
      error.code = 404;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Not Authorized!");
      error.code = 403;
      throw error;
    }

    await Post.findByIdAndRemove(id);
    clearImage(post.imageUrl);

    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();
    return true;
  },

  async user(args, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No User found!");
      error.code = 404;
      throw error;
    }

    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },

  async updateStatus({ status }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No User found!");
      error.code = 404;
      throw error;
    }

    user.status = status;
    await user.save();

    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },
};
