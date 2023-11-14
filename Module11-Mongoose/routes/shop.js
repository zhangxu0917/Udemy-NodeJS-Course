const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/products/:prodId", shopController.getProduct);

router.get("/products", shopController.getProducts);

// router.get("/cart", shopController.getCart);

// router.post("/cart", shopController.postCart);

// router.post("/delete-cart", shopController.postCartDeleteProduct);

// router.get("/orders", shopController.getOrders);

// router.post("/create-order", shopController.postOrder);

router.get("/", shopController.getIndex);

module.exports = router;
