const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorContainer = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

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

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      console.log("req.user.createProduct", user.createProduct);
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use("/", errorContainer.get404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    console.log(result);
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Max",
        email: "test@test.com",
      });
    }
    return user;
  })
  .then((user) => {
    console.log("=========");
    console.log(user);
    return user.getCart({
      create: true,
      force: false,
    });
  })
  .then((cart) => {
    console.log(cart);
  })
  .catch((err) => {
    console.error(err);
  });

const server = http.createServer(app);
server.listen(3000);
