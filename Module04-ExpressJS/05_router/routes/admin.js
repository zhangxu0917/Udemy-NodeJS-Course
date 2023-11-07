const express = require("express");
const router = express.Router();
const path = require("path");

const rootDir = require("../util/path");

router.get("/add-product", (req, res) => {
  //   res.send(`
  //     <h1>Create Product</h1>
  //     <form action="/admin/add-product" method="post">
  //         <input type="text" name="title"/>
  //         <button type="submit">Submit</button>
  //     </form>
  // `);

  res.sendFile(path.join(rootDir, "views/add-product.html"));
});

router.post("/add-product", (req, res) => {
  console.log("req.body", req.body);
  res.redirect("/");
});

module.exports = router;
