module.exports.get404 = (req, res, next) => {
  res.render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports.get500 = (req, res, next) => {
  res.render("500", {
    pageTitle: "Some Errors Occurred!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
