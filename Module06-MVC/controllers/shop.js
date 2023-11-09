const Product = require("../models/product");

module.exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render("shop/product-list", {
    pageTitle: "All Products",
    products,
    path: "/product-list",
  });
};

module.exports.getIndex = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render("shop/index", {
    pageTitle: "Shop",
    products,
    path: "/",
  });
};

module.exports.getCart = async (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
  });
};

module.exports.getCheckout = async (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Your Checkout",
    path: "/checkout",
  });
};

module.exports.getOrders = async (req, res, next) => {
  res.render("shop/order", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};
