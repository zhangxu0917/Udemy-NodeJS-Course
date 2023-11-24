const { validationResult } = require("express-validator");
const Product = require("../models/product");
const fileHelper = require("../util/file");

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
  const { title, price, description } = req.body;
  const image = req.file;
  console.log(image);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Add Product",
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
    });
  }

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
      imageUrl: image.path,
      // FIXME: Focus there, Your can pass req.session.user directly, mongoose can deal with this, just add user._id
      userId: req.session.user,
    });
    await product.save();
    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    console.log(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const { prodId } = req.params;
  const product = await Product.findById(prodId);

  const error = new Error("Product not exist!");
  error.httpStatusCode = 500;
  next(error);
  if (!product) {
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
  const { prodId, title, price, description } = req.body;
  const image = req.file;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Product",
      editing: true,
      hasError: true,
      product: {
        title,
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
    if (image) {
      fileHelper.deleteFile(product.imageUrl);
      product.imageUrl = image.path;
    }
    product.description = description;
    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect(req.originalUrl);
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  const { prodId } = req.params;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return next(new Error("Product not found."));
    }
    fileHelper.deleteFile(product.imageUrl);

    // FIXME: current version mongoose already change the `findByIdAndRemove` to `findByIdAndDelete`, findByIdAndRemove has deprecated;
    await Product.deleteOne({
      _id: prodId,
      userId: req.user._id,
    });
    res.status(200).json({
      message: "Success.",
      code: 0,
    });
  } catch (err) {
    return res.status(500).json({
      message: "failed.",
      code: 5,
    });
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
