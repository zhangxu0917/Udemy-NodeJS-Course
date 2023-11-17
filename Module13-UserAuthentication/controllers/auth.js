const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findById("6554b72dc6c5b5f307a72e3d");
    req.session.user = user;
    req.session.isLoggedIn = true;
    await req.session.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = async (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const userDoc = await User.findOne({
      email,
    });

    if (userDoc) {
      return res.redirect("/signup");
    }

    const user = new User({
      email,
      password,
      cart: { item: [] },
    });

    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.error(error);
  }
};
