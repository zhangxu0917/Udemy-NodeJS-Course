const Product = require("../models/product");
const Cart = require("../models/cart");

module.exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        userId: req.user.id,
      },
    });
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
  const products = await Product.findAll({
    where: {
      userId: req.user.id,
    },
  });

  res.render("shop/index", {
    pageTitle: "Shop",
    products,
    path: "/",
  });
};

module.exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProduct();

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);
    Cart.addProduct(prodId, product.price);
  } catch (error) {
    console.error(error);
  }

  res.redirect("/cart");
};

module.exports.deleteCart = async (req, res, next) => {
  const prodId = req.body.prodId;

  try {
    const product = await Product.findById(prodId);
    Cart.deleteProduct(prodId, product.price);
  } catch (error) {
    console.error(error);
  }

  res.redirect("/cart");
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

module.exports.getProduct = async (req, res, next) => {
  const prodId = req.params.prodId;

  try {
    const product = await Product.findByPk(prodId);
    console.log(product);
    res.render("shop/product-detail", {
      pageTitle: `Product Details - ${product.title}`,
      path: "/orders",
      product,
    });
  } catch (error) {
    console.error(error);
  }
};
