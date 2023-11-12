const Product = require("../models/product");
const Cart = require("../models/cart");

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
  const product = new Product(undefined, title, imageUrl, description, price);

  try {
    await product.save();
    res.redirect("/");
  } catch (error) {
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      hasError: true,
      errorMsg: error.message,
    });
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

  const updateProduct = new Product(
    prodId,
    title,
    imageUrl,
    description,
    price
  );

  try {
    await updateProduct.save();
    res.redirect("/admin/products");
  } catch (error) {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      hasError: true,
      errorMsg: error.message,
    });
  }
};

module.exports.postDeleteProduct = async (req, res, next) => {
  const { prodId } = req.body;

  try {
    const products = await Product.fetchAll();
    const product = products.find((item) => item.id === prodId);

    await Cart.deleteProduct(prodId, product.price);
    await Product.deleteProductById(prodId);

    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};

module.exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render("admin/product-list", {
    pageTitle: "Admin Products",
    products,
    productCount: products.length,
    path: "/admin/products",
  });
};
