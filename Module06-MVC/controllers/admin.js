const Product = require("../models/product");

module.exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    path: "/admin/add-product",
  });
};

module.exports.postAddProduct = (req, res, next) => {
  console.log("req.body", req.body);

  const product = new Product(req.body.title);
  product.save();

  res.redirect("/");
};

module.exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render("admin/product-list", {
    pageTitle: "Admin Products",
    products,
    path: "/admin/product-list",
  });
};
