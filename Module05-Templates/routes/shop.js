const express = require("express");
const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res) => {
  // FIXME: pub template
  // res.render("shop", {
  //   pageTitle: "Shop",
  //   products: adminData.products,
  //   path: "/",
  // });

  // FIXNE: hbs template
  res.render("shop", {
    pageTitle: "Shop",
    products: adminData.products,
    path: "/",
    hasProduct: true,
  });
});

module.exports = router;
