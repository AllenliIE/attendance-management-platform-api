import { apiHelper } from "./../utils/helpers";

export default {
  getManagement() {
    return apiHelper.get("/admin/management");
  },
};
