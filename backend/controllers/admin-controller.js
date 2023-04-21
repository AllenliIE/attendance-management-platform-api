const { User, Attendance } = require("../models");

const adminController = {
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
};
module.exports = adminController;
