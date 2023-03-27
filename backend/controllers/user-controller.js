const bcrypt = require("bcryptjs");
const { User } = require("../models");

const userController = {
  signUp: async (req, res, next) => {
    const { name, email, account, password, passwordCheck } = req.body;
    const emailRule =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

    if (!name || !email || !account || !password || !passwordCheck)
      return res.json({ status: "error", message: "請確實填寫欄位！" });
    if (password !== passwordCheck)
      return res.json({ status: "error", message: "密碼與驗證密碼不相符！" });
    if ((account.length || name.length) > 15)
      return res.json({
        status: "error",
        message: "字數上限為 15 個字！",
      });
    if (email.search(emailRule) === -1)
      return res.json({
        status: "error",
        message: "請確認信箱的格式！",
      });

    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } }),
    ])
      .then(([account, email]) => {
        if (email)
          return res
            .status(401)
            .json({ status: "error", message: "此信箱已存在！" });
        if (account)
          return res
            .status(401)
            .json({ status: "error", message: "此帳號已存在！" });
        return bcrypt.hash(password, 10);
      })
      .then((hash) => {
        User.create({
          name,
          email,
          account,
          password: hash,
          wrongTimes: 0,
          isLocked: false,
          role: "user",
        });
      })
      .then((user) => {
        res.json({ status: "success", message: "帳號密碼註冊成功！" });
      })
      .catch((err) => next(err));
  },
};
module.exports = userController;
