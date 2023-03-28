import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap";  //default dist/js/bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");
