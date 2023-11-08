const express = require("express");
const router = express.Router();

const products = [{ title: "abc" }];
// const products = [];

router.get("/add-product", (req, res) => {
  // // FIXME: pug template
  //   res.render("add-product", {
  //     pageTitle: "Add Product",
  //     path: "/admin/add-product",
  //   });

  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true,
  });
});

router.post("/add-product", (req, res) => {
  console.log("req.body", req.body);
  res.redirect("/");
});

module.exports.router = router;
module.exports.products = products;
