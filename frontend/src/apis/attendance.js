import { apiHelper } from "./../utils/helpers";
const getToken = () => localStorage.getItem("token");

export default {
  postAttendance({ UserId, date, clockIn }) {
    return apiHelper.post(
      "/attendance",
      { UserId, date, clockIn },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
  },
  updateAttendance({ UserId, date, clockOut }) {
    return apiHelper.put(
      `/attendance/${UserId}`,
      { UserId, date, clockOut },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
  },
};
