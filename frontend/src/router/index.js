import { createRouter, createWebHashHistory } from "vue-router";
import store from "./../store";
import NotFound from "../views/NotFound";
import SignIn from "../views/SignIn.vue";
import ClockPage from "./../views/attendance/ClockPage.vue";
import QRCodePage from "./../views/attendance/QRCodePage.vue";
import GPSPage from "./../views/attendance/GPSPage.vue";
import ProfilePage from "./../views/attendance/ProfilePage.vue";

const routes = [
  {
    path: "/",
    name: "root",
    component: ClockPage,
  },
  {
    path: "/signin",
    name: "sign-in",
    component: SignIn,
  },
  {
    path: "/signup",
    name: "sign-up",
    component: () => import("../views/SignUp.vue"),
  },
  {
    path: "/clocking",
    name: "clocking",
    component: ClockPage,
  },
  {
    path: "/clocking/qrcode",
    name: "clocking-qrcodle",
    component: QRCodePage,
  },
  {
    path: "/clocking/gps",
    name: "clocking-gps",
    component: GPSPage,
  },
  {
    path: "/clocking/profile",
    name: "clocking-profile",
    component: ProfilePage,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const tokenInLocalStorage = localStorage.getItem("token");
  const tokenInStore = store.state.token;
  let isAuthenticated = store.state.isAuthenticated;
  if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
    isAuthenticated = await store.dispatch("fetchCurrentUser");
  }
  const pathsWithoutAuthentication = ["sign-up", "sign-in"];
  if (!isAuthenticated && !pathsWithoutAuthentication.includes(to.name)) {
    next("/signin");
    return;
  }
  if (isAuthenticated && pathsWithoutAuthentication.includes(to.name)) {
    next("/clocking");
    return;
  }
  next();
});

export default router;
