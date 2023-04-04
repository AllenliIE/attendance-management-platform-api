<template>
  <div id="attendance-management-platform-api" class="h-100">
    <AppNavbar />
    <main role="main" class="h-100">
      <router-view />
    </main>
  </div>
</template>

<script>
import AppNavbar from "./components/AppNavbar";

/* eslint-disable */
export default {
  name: "attendance-management-platform-api",
  components: {
    AppNavbar,
  },
};
</script>
