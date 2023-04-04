<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
    <router-link
      class="navbar-brand m-3 text-primary"
      style="font-size: 36px"
      to="/"
    >
      <i class="fa-solid fa-industry fa-xl mr-2"></i>
      <strong> Attendance Management Platform </strong>
    </router-link>

    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div
      id="navbarSupportedContent"
      class="navbar-collapse collapse d-flex justify-content-end"
    >
      <div class="ml-auto d-flex align-items-center">
        <!-- is user is admin -->
        <router-link
          v-if="currentUser.role === 'admin'"
          to="#"
          class="text-muted m-3 text-decoration-none"
        >
          <i class="fa-solid fa-robot fa-bounce fa-2xl"></i>
        </router-link>

        <!-- is user is login -->
        <template v-if="isAuthenticated">
          <router-link
            to="#"
            class="text-primary m-3 text-decoration-none"
            style="font-size: 24px"
          >
            <strong> Hello, {{ currentUser.name || "User" }} </strong>
          </router-link>
          <button type="button" class="btn m-3 my-sm-0" @click="logout">
            <i class="fa-solid fa-right-from-bracket fa-2xl text-muted"></i>
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    function logout() {
      store.commit("revokeAuthentication");
      router.push("/signin");
    }
    return { logout };
  },
};
</script>
