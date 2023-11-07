const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded());

app.use("/add-product", (req, res) => {
  res.send(`
        <h1>Create Product</h1>
        <form action="/product" method="post">
            <input type="text" name="title"/>
            <button type="submit">Submit</button>
        </form>
    `);
});

app.post("/product", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

app.use("/", (req, res) => {
  res.send("<h1>Hello from Express!</h1>");
});

app.listen(3000);
