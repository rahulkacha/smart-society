module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ msg: "you are not authorized to view this page." });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.admin.admin) {
    next();
  } else {
    res.status(401).json({
      msg: "you are not authorized to view this page because you are not an admin.",
    });
  }
};

module.exports.isMaster = (req, res, next) => {
  if (req.isAuthenticated() && req.masterAdmin.master) {
    next();
  } else {
    res.status(401).json({
      msg: "you are not authorized to view this page because you are not a master-admin.",
    });
  }
};
