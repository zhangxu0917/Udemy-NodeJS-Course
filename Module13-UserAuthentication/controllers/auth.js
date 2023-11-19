const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage,
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    const toMatch = await bcrypt.compare(password, user.password);

    if (toMatch) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      await req.session.save();
      return res.redirect("/");
    }

    req.flash("error", "Invalid email or password");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = async (req, res, next) => {
  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage,
  });
};

exports.postSignup = async (req, res, next) => {
  console.log("postSignup");

  const { email, password, confirmPassword } = req.body;

  try {
    const userDoc = await User.findOne({
      email,
    });

    if (userDoc) {
      req.flash("error", "Email exists already, please pick a different one.");
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      cart: { item: [] },
    });

    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.error(error);
  }
};
