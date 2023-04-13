<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AsideTabs class="h-100" />
    <div class="col-xl-10 mt-5 text-center">
      <div
        class="container card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
        style="height: 800px"
      >
        <AppSpinner v-if="isLoading" />
        <template v-else>
          <h1>QRCode Page</h1>
          <a href="#/clocking/qrcode/generator">QR Generator</a> |
          <a href="#/clocking/qrcode/read">QR Reader</a> |
          <component :is="currentView" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import AsideTabs from "./../../components/AsideTabs";
import AppSpinner from "./../../components/AppSpinner";
import QRGenerator from "./../../components/QRGenerator.vue";
import QRReader from "./../../components/QRReader.vue";

export default {
  components: {
    AsideTabs,
    AppSpinner,
  },
  setup() {
    const isLoading = ref(false);

    isLoading.value = true;
    const routes = {
      "/clocking/qrcode/generator": QRGenerator,
      "/clocking/qrcode/read": QRReader,
    };

    const currentPath = ref(window.location.hash);

    window.addEventListener("hashchange", () => {
      currentPath.value = window.location.hash;
    });

    const currentView = computed(() => {
      return routes[currentPath.value.slice(1) || "/"] || "NotFound";
    });

    isLoading.value = false;

    return { currentView, isLoading };
  },
};
</script>
