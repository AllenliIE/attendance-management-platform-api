const passport = require("../config/passport");
const authenticated = passport.authenticate("jwt", { session: false });

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ status: "error", message: "無此權限！" });
};

module.exports = {
  authenticated,
  authenticatedAdmin,
};
