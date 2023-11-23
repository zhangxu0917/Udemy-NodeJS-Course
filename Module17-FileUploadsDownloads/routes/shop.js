const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");
const isAuth = require("../middlewares/is-auth");

router.get("/products/:prodId", shopController.getProduct);

router.get("/products", shopController.getProducts);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/delete-cart", isAuth, shopController.postCartDeleteProduct);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/", shopController.getIndex);

module.exports = router;
