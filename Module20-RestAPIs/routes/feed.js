const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middlewares/is-auth");

const feedController = require("../controllers/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isString().isLength({ min: 5 }),
    body("content").trim().isString().isLength({ min: 5 }),
  ],
  feedController.createPost
);

// get /feed/post/:postId
router.get("/post/:postId", isAuth, feedController.getPost);

// put /feed/post/:postId
router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isString().isLength({ min: 5 }),
    body("content").trim().isString().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

// Delete /feed/post/:postId
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
