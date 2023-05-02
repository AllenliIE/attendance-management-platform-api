const { Attendance } = require("../models");

const attendanceController = {
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
