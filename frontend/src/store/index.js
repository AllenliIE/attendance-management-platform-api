import { createStore } from "vuex";
import usersAPI from "../apis/users.js";

export default createStore({
  state: {
    currentUser: {
      id: -1,
      name: "",
      email: "",
      account: "",
      role: "",
    },
    isAuthenticated: false,
    token: "",
    date: "",
    clockInTime: "",
    clockOutTime: "",
    clockedIn: false,
  },
  getters: {
    userId: (state) => state.currentUser.id,
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        ...currentUser,
      };

      state.token = localStorage.getItem("token");
      state.isAuthenticated = true;
    },
    revokeAuthentication(state) {
      state.currentUser = {};
      state.isAuthenticated = false;

      state.token = "";
      localStorage.removeItem("token");
    },
    setClockedIn(state, value) {
      state.clockedIn = value;
    },
    setClockInTime(state, value) {
      state.clockInTime = value;
    },
    setClockOutTime(state, value) {
      state.clockOutTime = value;
    },
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const { data } = await usersAPI.getCurrentUser();

        const { id, name, email, account, role } = data;

        commit("setCurrentUser", {
          id,
          name,
          email,
          account,
          role,
        });
        return true;
      } catch (error) {
        console.error("can not fetch user information");
        commit("revokeAuthentication");
        return false;
      }
    },
  },
  modules: {},
});
