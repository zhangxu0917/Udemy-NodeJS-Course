const { validationResult } = require("express-validator");
const Product = require("../models/product");

module.exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
    editing: false,
    hasError: false,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
    validationErrors: [],
  });
};

module.exports.postAddProduct = async (req, res, next) => {
  console.log("postAddProduct");
  const { title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);
  console.log("errors", errors);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Add Product",
      editing: false,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    const product = new Product({
      title,
      price,
      description,
      imageUrl,
      // FIXME: Focus there, Your can pass req.session.user directly, mongoose can deal with this, just add user._id
      userId: req.session.user,
    });
    await product.save();
    res.redirect("/");
  } catch (error) {
    req.flash("error", error.message);
    console.error(error);
  }
};

module.exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const { prodId } = req.params;
  const product = await Product.findById(prodId);

  if (!product) {
    return res.redirect("/");
  }

  res.render("admin/edit-product", {
    path: "/admin/edit-product",
    pageTitle: "Edit Product",
    editing: editMode,
    hasError: false,
    product,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
    validationErrors: [],
  });
};

module.exports.postEditProduct = async (req, res, next) => {
  const { prodId, title, price, imageUrl, description } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Product",
      editing: true,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
        prodId,
      },
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    let product = await Product.findById(prodId);

    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }

    product.title = title;
    product.price = price;
    product.imageUrl = imageUrl;
    product.description = description;
    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect(req.originalUrl);
  }
};

module.exports.postDeleteProduct = async (req, res, next) => {
  const { prodId } = req.body;

  try {
    // FIXME: current version mongoose already change the `findByIdAndRemove` to `findByIdAndDelete`, findByIdAndRemove has deprecated;
    await Product.deleteOne({
      _id: prodId,
      userId: req.user._id,
    });
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};

module.exports.getProducts = async (req, res, next) => {
  const products = await Product.find({
    userId: req.user._id,
  }).populate("userId");

  res.render("admin/product-list", {
    pageTitle: "Admin Products",
    products,
    productCount: products.length,
    path: "/admin/products",
    isAuthenticated: req.session.isLoggedIn,
  });
};
