const bcrypt = require("bcryptjs");
const db = require("../models");
const { User } = db;

const userController = {
  signUp: (req, res) => {
    const { name, email, account, password, errorPasswordTimes, role } =
      req.body;
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) =>
        User.create({
          name,
          email,
          account,
          password: hash,
          errorPasswordTimes,
          role: "user",
        })
      )
      .then(() => {
        res.redirect("/signin");
      });
  },
};
module.exports = userController;
