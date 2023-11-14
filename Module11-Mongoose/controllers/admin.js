const Product = require("../models/product");

module.exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
    editing: false,
    hasError: false,
    errorMsg: "",
  });
};

module.exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  try {
    const product = new Product({ title, price, description, imageUrl });
    await product.save();
    res.redirect("/");
  } catch (error) {
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
    product,
  });
};

module.exports.postEditProduct = async (req, res, next) => {
  const { prodId, title, price, imageUrl, description } = req.body;

  try {
    let product = await Product.findById(prodId);
    product.title = title;
    product.price = price;
    product.imageUrl = imageUrl;
    product.description = description;
    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};

module.exports.postDeleteProduct = async (req, res, next) => {
  const { prodId } = req.body;

  try {
    // FIXME: current version mongoose already change the `findByIdAndRemove` to `findByIdAndDelete`, findByIdAndRemove has deprecated;
    await Product.findByIdAndDelete(prodId);
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};

module.exports.getProducts = async (req, res, next) => {
  const products = await Product.find();

  res.render("admin/product-list", {
    pageTitle: "Admin Products",
    products,
    productCount: products.length,
    path: "/admin/products",
  });
};
