<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
    <div class="container-fluid">
      <router-link
        class="navbar-brand m-3 text-primary"
        style="font-size: 36px"
        to="/"
      >
        <i class="fa-solid fa-industry fa-xl mr-2"></i>
        <strong> Attendance Management Platform </strong>
      </router-link>
      <template v-if="isAuthenticated">
        <!-- .navbar-toggler 漢堡式選單按鈕 -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <!-- .navbar-toggler-icon 漢堡式選單Icon -->
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- 選單項目&漢堡式折疊選單 -->
        <div
          id="navbarSupportedContent"
          class="collapse navbar-collapse d-lg-flex justify-content-end align-items-center ml-auto"
        >
          <div class="navbar-nav ml-auto">
            <!-- is user is admin -->
            <router-link
              v-if="currentUser.role === 'admin'"
              to="/admin"
              class="nav-item active text-muted m-3 text-decoration-none"
            >
              <i class="fa-solid fa-screwdriver-wrench fa-bounce fa-2xl"></i>
            </router-link>

            <!-- is user is login -->
            <router-link
              to=""
              class="nav-item active text-primary text-center m-3 text-decoration-none"
              style="font-size: 24px"
            >
              <strong> Hello, {{ currentUser.name || "User" }} </strong>
            </router-link>
            <button
              type="button"
              class="btn nav-item m-3 my-sm-0"
              @click="logout"
            >
              <i class="fa-solid fa-right-from-bracket fa-2xl text-muted"></i>
            </button>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<script>
import { useStore, mapState } from "vuex";
import { useRouter } from "vue-router";

export default {
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    function logout() {
      store.commit("revokeAuthentication");
      // Clean up localStorage
      localStorage.removeItem("clockedIn");
      localStorage.removeItem("clockInTime");
      localStorage.removeItem("clockOutTime");
      localStorage.removeItem("dayChangeTime");
      localStorage.removeItem("date");
      router.push("/signin");
    }
    return { logout };
  },
};
</script>
