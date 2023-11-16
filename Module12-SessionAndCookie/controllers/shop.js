const Product = require("../models/product");
const Order = require("../models/order");

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
    // FIXME:
    const user = await req.user.populate("cart.items.productId");

    const products = user.cart.items.map((item) => {
      return {
        quantity: item.quantity,
        price: item.productId.price,
        title: item.productId.title,
        description: item.productId.description,
        imageUrl: item.productId.imageUrl,
        _id: item.productId._id,
      };
    });

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products,
    });
  } catch (err) {
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
    await req.user.removeFromCart(prodId);
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }
};

module.exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      "user.userId": req.user._id,
    });

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
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map((item) => {
      return {
        quantity: item.quantity,
        // FIXME: _doc, can access the real data
        product: { ...item.productId._doc },
      };
    });
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products,
    });

    await order.save();
    await user.clearCart();
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