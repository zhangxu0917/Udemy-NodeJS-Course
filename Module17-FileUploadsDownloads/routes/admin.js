const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const adminController = require("../controllers/admin");
const isAuth = require("../middlewares/is-auth");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .isLength({
        min: 3,
      })
      .trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:prodId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product/:prodId",
  [
    body("title")
      .isString()
      .isLength({
        min: 3,
      })
      .trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

router.get("/products", isAuth, adminController.getProducts);

router.get("/", isAuth, adminController.getProducts);

module.exports = router;
