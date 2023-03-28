<template>
  <div id="attendance-management-platform-api">
    <AppNavbar />
    <main role="main">
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
