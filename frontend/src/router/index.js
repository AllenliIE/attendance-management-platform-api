import { createRouter, createWebHashHistory } from "vue-router";
import NotFound from "../views/NotFound";
import SignIn from "../views/SignIn";

const routes = [
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
  // {
  //   path: "/",
  //   name: "Home",
  //   component: HomePage,
  // },
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

export default router;
