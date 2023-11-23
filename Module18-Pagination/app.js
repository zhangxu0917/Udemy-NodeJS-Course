const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorContainer = require("./controllers/error");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const csrfProtection = csrf();
const flash = require("connect-flash");
const multer = require("multer");

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

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    return cb(null, true);
  }
  return cb(null, false);
};

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "My secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrfProtection);
app.use(flash());

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  try {
    const user = await User.findById(req.session.user._id);

    if (!user) {
      const error = new Error("User not found!");
      error.httpStatusCode = 500;
      next(error);
    }

    req.user = user;
    next();
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use("/500", errorContainer.get500);
app.use(errorContainer.get404);
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500");
});

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
