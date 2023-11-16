const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorContainer = require("./controllers/error");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const User = require("./models/user");

// FIXME: this url host must use 127.0.0.1, else it will not connect successfully.
const MONGODB_URI = "mongodb://127.0.0.1:27017/shop";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "pug");
app.set("views", "views");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "My secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
  }
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use("/", errorContainer.get404);

const server = http.createServer(app);

mongoose
  .connect(MONGODB_URI)
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
