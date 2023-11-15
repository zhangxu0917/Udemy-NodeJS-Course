const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorContainer = require("./controllers/error");
const mongoose = require("mongoose");
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

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("6554b72dc6c5b5f307a72e3d");

    console.log("user", user);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use("/", errorContainer.get404);

const server = http.createServer(app);

mongoose
  // FIXME: this url host must use 127.0.0.1, else it will not connect successfully.
  .connect("mongodb://127.0.0.1:27017/shop")
  .then(() => {
    console.log("Connected to MongoDB!");

    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "max@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    server.listen(3000);
  })
  .catch((err) => console.error(err));
