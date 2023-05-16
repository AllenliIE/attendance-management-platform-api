const { Attendance } = require("../models");
const { Op } = require("sequelize");

const attendanceController = {
  getAttendance: async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      const data = await Attendance.findOne({
        where: {
          date: {
            [Op.between]: [today, tomorrow],
          },
          UserId: req.user.id,
        },
      });

      if (!data)
        return res.json({ status: "error", message: "今日尚未執行考勤作業！" });

      const formatDateTime = (dateTime) => {
        const year = dateTime.getFullYear();
        const month = String(dateTime.getMonth() + 1).padStart(2, "0");
        const day = String(dateTime.getDate()).padStart(2, "0");
        const hours = String(dateTime.getHours()).padStart(2, "0");
        const minutes = String(dateTime.getMinutes()).padStart(2, "0");
        const seconds = String(dateTime.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      const formattedClockIn = formatDateTime(data.clockIn);
      const formattedClockOut = formatDateTime(data.clockOut);

      return res.json({
        status: "success",
        message: "歡迎來到考勤管理系統！",
        data: {
          clockIn: formattedClockIn,
          clockOut: formattedClockOut,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  postAttendance: async (req, res, next) => {
    const { date, clockIn } = req.body;
    if (!date || !clockIn)
      return res.json({ status: "error", message: "出勤時間不存在！" });

    try {
      const now = new Date();
      const inputDate = new Date(date);
      if (
        inputDate.getFullYear() !== now.getFullYear() ||
        inputDate.getMonth() !== now.getMonth() ||
        inputDate.getDate() !== now.getDate()
      ) {
        return res.json({ status: "error", message: "出勤日期不正確！" });
      }
      const data = await Attendance.findOne({
        where: { date: date, UserId: req.body.UserId },
      });
      if (data)
        return res.json({ status: "error", message: "今天已經打卡上班了！" });

      await Attendance.create({
        UserId: req.body.UserId,
        date: date,
        clockIn: clockIn,
        elapsedTime: 0,
        absent: true,
      });
      return res.json({
        status: "success",
        message: "打卡上班成功！",
      });
    } catch (err) {
      next(err);
    }
  },
  updateAttendance: async (req, res, next) => {
    const { date, clockOut } = req.body;
    if (!date || !clockOut)
      return res.json({ status: "error", message: "下班時間不存在！" });

    try {
      const now = new Date();
      const inputDate = new Date(date);
      if (
        inputDate.getFullYear() !== now.getFullYear() ||
        inputDate.getMonth() !== now.getMonth() ||
        inputDate.getDate() !== now.getDate()
      ) {
        return res.json({ status: "error", message: "下班日期不正確！" });
      }
      const data = await Attendance.findOne({
        where: { date: date, UserId: req.body.UserId },
      });
      if (!data)
        return res.json({ status: "error", message: "今天還未打卡上班！" });

      const clockIn = new Date(data.clockIn);
      const elapsedTime = Math.floor(now - clockIn);
      await Attendance.update(
        {
          clockOut: clockOut,
          elapsedTime: elapsedTime,
          absent: false,
        },
        {
          where: { date: date, UserId: req.body.UserId },
        }
      );
      if (data.clockOut)
        return res.json({ status: "success", message: "今天已經打卡下班了！" });

      return res.json({
        status: "success",
        message: "打卡下班成功！",
      });
    } catch (err) {
      next(err);
    }
  },
};
module.exports = attendanceController;
