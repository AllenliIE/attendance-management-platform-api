import { apiHelper } from "./../utils/helpers";

export default {
  getAttendance() {
    return apiHelper.get("/attendance");
  },
  postAttendance({ UserId, date, clockIn }) {
    return apiHelper.post("/attendance", { UserId, date, clockIn });
  },
  updateAttendance({ UserId, date, clockOut }) {
    return apiHelper.put(`/attendance/${UserId}`, { UserId, date, clockOut });
  },
};
