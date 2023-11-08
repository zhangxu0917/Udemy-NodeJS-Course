const express = require("express");
const router = express.Router();

const products = [{ title: "abc" }];

router.get("/add-product", (req, res) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
});

router.post("/add-product", (req, res) => {
  console.log("req.body", req.body);
  res.redirect("/");
});

module.exports.router = router;
module.exports.products = products;
