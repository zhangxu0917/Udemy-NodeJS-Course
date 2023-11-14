const express = require("express");

const router = express.Router();
const adminController = require("../controllers/admin");

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.get("/edit-product/:prodId", adminController.getEditProduct);

router.post("/edit-product/:prodId", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

router.get("/products", adminController.getProducts);

router.get("/", adminController.getProducts);

module.exports = router;
