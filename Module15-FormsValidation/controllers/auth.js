const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { smtpTransport } = require("../util/mail");

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

    smtpTransport.sendMail(
      {
        from: "david@virgos.top	", // 发件人邮箱账号
        to: email, // 收件人邮箱账号
        subject: "Signup Succeeded!", // 邮件主题
        html: `
          <h1>Your successfully signed up!</h1>
        `, // 邮件HTML内容
      },
      (error, response) => {
        if (error) {
          console.log(error);
          req.flash("error", error.message);
          return res.redirect("/login");
        } else {
          res.redirect("/login");
          console.log("发送成功"); // 打印成功信息
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
};

exports.getReset = (req, res, next) => {
  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    isAuthenticated: false,
    errorMessage,
  });
};

exports.postReset = async (req, res, next) => {
  let user;

  try {
    user = await User.findOne({
      email: req.body.email,
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/reset");
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");

    if (!user) {
      req.flash("error", "No account with that email found.");
      return res.redirect("/reset");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 360000;
    user.save().then((result) => {
      res.redirect("/");
      smtpTransport.sendMail(
        {
          from: "david@virgos.top	", // 发件人邮箱账号
          to: user.email, // 收件人邮箱账号
          subject: "Password Reset", // 邮件主题
          html: `
            <p>You requested a password reset.</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `, // 邮件HTML内容
        },
        (error, response) => {
          if (error) {
            req.flash("error", error.message);
            return res.redirect("/reset");
          } else {
            console.log("发送成功"); // 打印成功信息
          }
        }
      );
    });
  });
};

exports.getNewPassword = async (req, res, next) => {
  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  const token = req.params.token;
  let user;
  try {
    user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: {
        $gt: Date.now(),
      },
    });

    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      isAuthenticated: false,
      errorMessage,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (error) {
    console.log("error");
  }
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  const user = await User.findOne({
    resetToken: passwordToken,
    _id: userId,
    resetTokenExpiration: {
      $gt: Date.now(),
    },
  });

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();
  res.redirect("/login");
};
