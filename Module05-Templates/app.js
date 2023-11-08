const http = require("http");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

const adminData = require("./routes/admin");
const shopRouter = require("./routes/shop");

app.set("view engine", "pug");
app.set("views", "views");

app.use("/admin", adminData.router);
app.use(shopRouter);

app.use((req, res) => {
  res.render("404", {
    pageTitle: "404 Page Not Found",
  });
});

const server = http.createServer(app);

server.listen(3000);
