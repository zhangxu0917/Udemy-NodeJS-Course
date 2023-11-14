const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorContainer = require("./controllers/error");
const { mongoConnect } = require("./util/database");
const User = require("./models/user");

const app = express();

app.set("view engine", "pug");
app.set("views", "views");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("65532e22c45f810f4692ca81").then((user) => {
    req.user = new User(user.name, user.email, user.cart, user._id);
    next();
  });
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use((req, res, next) => {
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use("/", errorContainer.get404);

const server = http.createServer(app);

mongoConnect(() => {
  server.listen(3000);
});
