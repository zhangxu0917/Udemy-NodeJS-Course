const express = require("express");
const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res) => {
  res.render("shop", {
    docTitle: "Shop",
    products: adminData.products,
  });
});

module.exports = router;
