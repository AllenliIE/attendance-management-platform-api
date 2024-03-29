const { User, Attendance, sequelize } = require("../models");
const { Op } = require("sequelize");

const adminController = {
  getDashboard: async (req, res, next) => {
    try {
      const attendances = new Array(12).fill(0);
      const absences = new Array(12).fill(0);

      const results = await Attendance.findAll({
        attributes: [
          [sequelize.literal("MONTH(`date`)"), "month"],
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
          [sequelize.fn("SUM", sequelize.col("absent")), "absences"],
        ],
        where: {
          absent: {
            [Op.in]: [0, 1],
          },
        },
        group: [sequelize.literal("MONTH(`date`)")],
      });

      results.forEach((result) => {
        const month = result.dataValues.month - 1;
        attendances[month] =
          parseInt(result.dataValues.count) -
          parseInt(result.dataValues.absences);
        absences[month] = parseInt(result.dataValues.absences);
      });

      return res.json({ attendances, absences });
    } catch (err) {
      next(err);
    }
  },
  getAttendance: async (req, res, next) => {
    try {
      const attendance = await Attendance.findAll({
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
        order: [
          ["date", "DESC"],
          ["clock_in", "DESC"],
          [User, "id", "ASC"],
        ],
      });
      res.json(attendance);
    } catch (err) {
      next(err);
    }
  },
  putAbsent: async (req, res, next) => {
    if (Number(req.params.id) !== Number(req.body.attendanceId)) {
      return res.status(401).json({ status: "error", message: "拒絕存取！" });
    }
    try {
      const attendance = await Attendance.findByPk(req.params.id);
      if (attendance.absent === false) {
        return res
          .status(401)
          .json({ status: "error", message: "該紀錄尚未缺勤！" });
      }
      await attendance.update({ absent: false });
      return res.json({ status: "success", message: "修改缺勤成功！" });
    } catch (err) {
      next(err);
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role", "isLocked"],
        where: {
          id: {
            [Op.not]: 1,
          },
        },
      });

      res.json(users);
    } catch (err) {
      next(err);
    }
  },
  unlockUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user.isLocked === false) {
        return res
          .status(401)
          .json({ status: "error", message: "該使用者並未上鎖！" });
      }
      await user.update({ isLocked: false, wrongTimes: 0 });
      return res.json({ status: "success", message: "使用者解鎖成功！" });
    } catch (err) {
      next(err);
    }
  },
};
module.exports = adminController;
