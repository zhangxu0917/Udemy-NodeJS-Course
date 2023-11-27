const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

// put /auth/signup
router.put(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists!");
          }
        });
      }),
    body("name").trim().isString().not().isEmpty(),
    body("password").trim().isString().isLength({
      min: 6,
      max: 16,
    }),
  ],
  authController.signup
);

// post /auth/login
router.post("/login", authController.login);

// get /auth/status
router.get("/status", isAuth, authController.getUserStatus);

// patch /auth/status
router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  authController.updateUserStatus
);

module.exports = router;
