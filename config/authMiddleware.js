module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("401", {
      error: "you are not logged in.",
      href: "/login"
    })
  }
};
//
module.exports.isNotAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/home");
  }
};
//
module.exports.isAdmin = (req, res, next) => {
  if (req.user.admin && req.user.isAccepted) {
    next();
  } else {
    res.render("401", {
      error: "you are not authorized.",
      href: "/"
    })
  }
};
//
module.exports.isMasterAdmin = (req, res, next) => {
  if (req.user.master) {
    next();
  } else {
    res.render("401", {
      error: "you are not authorized.",
      href: "/"
    })
  }
};
