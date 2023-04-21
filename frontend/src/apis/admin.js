import { apiHelper } from "./../utils/helpers";

export default {
  attendance: {
    getAttendance() {
      return apiHelper.get("/admin/attendance");
    },
  },
  users: {
    getUsers() {
      return apiHelper.get("/admin/attendance/users");
    },
    putIsLocked(userId) {
      return apiHelper.put(`/admin/attendance/users/${userId}`, { userId });
    },
  },
  absent: {
    putAbsent(attendanceId) {
      return apiHelper.put(`/admin/attendance/${attendanceId}`, {
        attendanceId,
      });
    },
  },
};
