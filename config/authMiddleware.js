module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ msg: "you are not authorized to view this page." });
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
    res.status(401).json({
      msg: "you are not authorized to view this page because you are not an admin.",
    });
  }
};
//
module.exports.isMasterAdmin = (req, res, next) => {
  if (req.user.master) {
    next();
  } else {
    res.status(401).json({
      msg: "you are not authorized to view this page because you are not a master-admin.",
    });
  }
};
