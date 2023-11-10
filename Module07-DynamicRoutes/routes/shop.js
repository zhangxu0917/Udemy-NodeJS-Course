const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/products/:prodId", shopController.getProduct);
router.get("/products", shopController.getProducts);
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
router.post("/delete-cart", shopController.deleteCart);
router.get("/checkout", shopController.getCheckout);
router.get("/orders", shopController.getOrders);
router.get("/", shopController.getIndex);

module.exports = router;
