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

  try {
    const product = await Product.create({
      title,
      imageUrl,
      price,
      description,
    });

    await product.setUser(req.user);
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
  const product = await Product.findByPk(prodId);

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
    await Product.update(
      {
        title,
        price,
        imageUrl,
        description,
      },
      {
        where: {
          id: prodId,
        },
      }
    );
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};

module.exports.postDeleteProduct = async (req, res, next) => {
  const { prodId } = req.body;

  try {
    await Product.destory({
      where: {
        id: prodId,
      },
    });
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};

module.exports.getProducts = async (req, res, next) => {
  const products = await Product.findAll({
    where: {
      userId: req.user.id,
    },
  });

  res.render("admin/product-list", {
    pageTitle: "Admin Products",
    products,
    productCount: products.length,
    path: "/admin/products",
  });
};
