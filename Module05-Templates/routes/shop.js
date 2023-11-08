const express = require("express");
const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res) => {
  res.render("shop", {
    pageTitle: "Shop",
    products: adminData.products,
    path: "/",
  });
});

module.exports = router;
