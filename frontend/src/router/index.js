import { createRouter, createWebHashHistory } from "vue-router";
import store from "./../store";
import NotFound from "../views/NotFound";
import SignIn from "../views/SignIn.vue";
import ClockPage from "./../views/attendance/ClockPage.vue";
import QRCodePage from "../views/attendance/QRCodePage.vue";
import GPSPage from "./../views/attendance/GPSPage.vue";
import ProfilePage from "./../views/attendance/ProfilePage.vue";
import AdminPage from "./../views/admin/AdminPage.vue";
import UsersPage from "./../views/admin/UsersPage.vue";
import AbsentPage from "./../views/admin/AbsentPage.vue";

const authorizeIsAdmin = (to, from, next) => {
  const currentUser = store.state.currentUser;
  if (currentUser && currentUser.role !== "admin") {
    next("/not-found");
    return;
  }

  next();
};

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
    path: "/clocking/qrcode/generator",
    name: "clocking-generator",
    component: QRCodePage,
  },
  {
    path: "/clocking/qrcode/read",
    name: "clocking-read",
    component: QRCodePage,
  },
  {
    path: "/clocking/gps",
    name: "clocking-gps",
    component: GPSPage,
  },
  {
    path: "/clocking/user/:id/edit",
    name: "clocking-profile",
    component: ProfilePage,
  },
  {
    path: "/clocking/user/:id",
    name: "clocking-profile",
    component: ProfilePage,
  },
  {
    path: "/admin",
    exact: true,
    redirect: "/admin/attendance/dashboard",
  },
  {
    path: "/admin/attendance/dashboard",
    name: "admin-attendance",
    component: AdminPage,
    beforeEnter: authorizeIsAdmin,
  },
  {
    path: "/admin/attendance/users",
    name: "admin-users",
    component: UsersPage,
    beforeEnter: authorizeIsAdmin,
  },
  {
    path: "/admin/attendance/absent",
    name: "admin-absent",
    component: AbsentPage,
    beforeEnter: authorizeIsAdmin,
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
