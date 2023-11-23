const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

module.exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/product-list", {
      pageTitle: "All Products",
      products,
      path: "/product-list",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.getIndex = async (req, res, next) => {
  const products = await Product.find();
  res.render("shop/index", {
    pageTitle: "Shop",
    products,
    path: "/",
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports.getCart = async (req, res, next) => {
  try {
    // FIXME:
    const user = await req.user.populate("cart.items.productId");

    console.log(user.cart.items);

    const products = user.cart.items.map((item) => {
      return {
        quantity: item.quantity,
        price: item.productId.price,
        title: item.productId.title,
        description: item.productId.description,
        imageUrl: item.productId.imageUrl,
        _id: item.productId._id,
        isAuthenticated: req.session.isLoggedIn,
      };
    });

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);
    console.log(product);
    await req.user.addToCart(product);
    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.prodId;

  try {
    await req.user.removeFromCart(prodId);
    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      "user.userId": req.session.user._id,
    });

    console.log("orders", orders);

    res.render("shop/order", {
      pageTitle: "Your Orders",
      path: "/orders",
      orders,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
        email: req.user.email,
        userId: req.user,
      },
      products,
    });

    await order.save();
    await user.clearCart();
    res.redirect("/orders");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId).then((order) => {
    if (!order) {
      return next(new Error("No order found!"));
    }

    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized"));
    }

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join("data", "invoices", invoiceName);

    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text("Invoice", {
      underline: true,
    });
    pdfDoc.fontSize(14).text("------------------------------");

    let totalPrice = 0;
    order.products.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          `${prod.product.title} - ${prod.quantity} x ${prod.product.price}`
        );
    });

    pdfDoc.text("---------------");
    pdfDoc.fontSize(20).text(`Total price: ${totalPrice}`);
    pdfDoc.end();

    // FIXME: use common readFile method to read pdf file
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader(
    //     "Content-Disposition",
    //     "inline; filename='" + invoicePath + '"'
    //   );
    //   return res.send(data);
    // });

    // FIXME: use stream to read pdf file
    const file = fs.createReadStream(invoicePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename='" + invoicePath + '"'
    );
    file.pipe(res);
  });
};

module.exports.getProduct = async (req, res, next) => {
  const prodId = req.params.prodId;

  try {
    const product = await Product.findById(prodId);
    res.render("shop/product-detail", {
      pageTitle: `Product Details - ${product.title}`,
      path: "/orders",
      product,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
