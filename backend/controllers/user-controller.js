const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const userController = {
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body;
      const user = await User.findOne({ where: { account } });

      if (!account || !password)
        return res.json({ status: "error", message: "請確實填寫欄位！" });
      if (!user)
        return res
          .status(401)
          .json({ status: "error", message: "該帳號不存在！" });
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: "error", message: "請輸入正確的帳號密碼！" });
      }
      if (user.wrongTimes >= 5 || user.isLocked) {
        return res.status(401).json({
          status: "error",
          message: "此帳戶已鎖定，請與管理員尋求協助！",
        });
      } else {
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        return res.json({
          status: "success",
          message: "登入成功！",
          token,
          data: {
            id: user.id,
            name: user.name,
            account: user.account,
            role: user.role,
          },
        });
      }
    } catch (err) {
      next(err);
    }
  },
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
  getCurrentUser: (req, res) => {
    const { id, name, email, account, role } = req.user;
    return res.json({
      id,
      name,
      email,
      account,
      password,
      role,
    });
  },
  putProfile: async (req, res, next) => {
    const { name, email, account, password, passwordCheck } = req.body;
    if (Number(req.params.id) !== Number(req.user.id))
      return res.status(401).json({ status: "error", message: "存取錯誤！" });

    try {
      const user = await User.findByPk(req.params.id);
      const hash = await bcrypt.hash(password, 10);
      if (password !== passwordCheck)
        return res
          .status(401)
          .json({ status: "error", message: "請重複輸入正確的密碼！" });

      await user.update({
        name,
        email,
        account,
        password: hash,
      });
      return res.json({ status: "success", message: "個人資料變更成功！" });
    } catch (err) {
      next(err);
    }
  },
};
module.exports = userController;
