const Product = require("../models/product");

module.exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/product-list", {
      pageTitle: "All Products",
      products,
      path: "/product-list",
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports.getIndex = async (req, res, next) => {
  const products = await Product.find();
  res.render("shop/index", {
    pageTitle: "Shop",
    products,
    path: "/",
  });
};

module.exports.getCart = async (req, res, next) => {
  try {
    const cartProducts = await req.user.getCart();

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: cartProducts,
    });
  } catch (er) {
    console.error(err);
  }
};

module.exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);
    await req.user.addToCart(product);
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }
};

module.exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.prodId;

  try {
    await req.user.deleteItemFromCart(prodId);
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }
};

module.exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders();

    res.render("shop/order", {
      pageTitle: "Your Orders",
      path: "/orders",
      orders,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports.postOrder = async (req, res, next) => {
  try {
    await req.user.addOrder();
    res.redirect("/orders");
  } catch (error) {
    console.error(error);
  }
};

module.exports.getProduct = async (req, res, next) => {
  const prodId = req.params.prodId;

  try {
    const product = await Product.findById(prodId);
    res.render("shop/product-detail", {
      pageTitle: `Product Details - ${product.title}`,
      path: "/orders",
      product,
    });
  } catch (error) {
    console.error(error);
  }
};
