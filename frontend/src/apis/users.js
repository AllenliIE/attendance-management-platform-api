import { apiHelper } from "./../utils/helpers";

export default {
  getCurrentUser() {
    return apiHelper.get(`/get_current_user`);
  },
  putProfile({ UserId, formData }) {
    return apiHelper.put(`/clocking/user/${UserId}/edit`, formData);
  },
};
