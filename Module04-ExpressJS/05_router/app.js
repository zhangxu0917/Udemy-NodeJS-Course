const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminnRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminnRouter);
app.use(shopRouter);

app.use((req, res) => {
  //   res.status(404).send("<h1>Page not found!</h1>");

  res.status(404).sendFile(path.join(__dirname, "./views/404.html"));
});

app.listen(3000);
