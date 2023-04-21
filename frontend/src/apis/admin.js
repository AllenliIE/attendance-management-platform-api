import { apiHelper } from "./../utils/helpers";

export default {
  attendance: {
    getAttendance() {
      return apiHelper.get("/admin/attendance");
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
