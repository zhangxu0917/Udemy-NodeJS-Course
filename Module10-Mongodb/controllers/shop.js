const Product = require("../models/product");
const Cart = require("../models/cart");

module.exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        userId: req.user.id,
      },
    });
    console.log("123123", products);
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
    const products = await cart.getProducts();
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
    const fetchCart = await req.user.getCart();
    console.log(fetchCart);
    const products = await fetchCart.getProducts({
      where: {
        id: prodId,
      },
    });
    let product;
    if (products.length > 0) {
      product = products[0];
    }
    let newQuantity = 1;
    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    } else {
      product = await Product.findByPk(prodId);
    }

    await fetchCart.addProduct(product, {
      through: { quantity: newQuantity },
    });
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }
};

module.exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.prodId;

  try {
    const fetchCart = await req.user.getCart();
    const products = await fetchCart.getProducts({
      where: {
        id: prodId,
      },
    });
    let targetProduct;
    if (products.length > 0) {
      targetProduct = products[0];
      // FIXME:
      result = await targetProduct.cartItem.destroy();
      res.redirect("/cart");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports.getCheckout = async (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Your Checkout",
    path: "/checkout",
  });
};

module.exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({
      include: ["products"],
    });
    console.log("================================");
    console.log("orders", orders[0].products[0].orderItem);

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
    const fetchCart = await req.user.getCart();
    const products = await fetchCart.getProducts();

    const order = await req.user.createOrder();
    await order.addProduct(
      products.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );

    fetchCart.setProducts(null);

    res.redirect("/orders");
  } catch (error) {
    console.error(error);
  }
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
