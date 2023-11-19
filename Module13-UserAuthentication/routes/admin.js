const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middlewares/is-auth");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:prodId", isAuth, adminController.getEditProduct);

router.post("/edit-product/:prodId", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

router.get("/products", isAuth, adminController.getProducts);

router.get("/", isAuth, adminController.getProducts);

module.exports = router;
