<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AsideTabs class="h-100" />
    <div class="col-xl-10 col-md-10 col-10 mt-5 text-center">
      <div
        class="container-field card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
        style="height: 1000px; margin-left: 55px; margin-right: 55px"
      >
        <AppSpinner v-if="isLoading" />
        <template v-else>
          <div
            class="d-flex justify-content-center text-center text-primary mb-4"
          >
            <i class="fa-solid fa-qrcode fa-3x m-3"></i>
            <p class="mb-3 font-weight-normal" style="font-size: 48px">
              <strong> QRCode Page </strong>
            </p>
          </div>
          <div v-if="currentUser.role === 'admin'">
            <a href="#/clocking/qrcode/generator">QR Generator</a> |
            <a href="#/clocking/qrcode/read">QR Reader</a>
          </div>
          <component :is="currentView" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import AsideTabs from "./../../components/AsideTabs";
import AppSpinner from "./../../components/AppSpinner";
import QRGenerator from "./../../components/QRGenerator.vue";
import QRReader from "./../../components/QRReader.vue";

import { computed, ref } from "vue";
import { mapState, useStore } from "vuex";

export default {
  name: "QRCodePage",
  components: {
    AsideTabs,
    AppSpinner,
  },
  setup() {
    const store = useStore();
    const storeState = mapState(["currentUser"]);
    const resultStoreState = {};

    const isLoading = ref(true);

    Object.keys(storeState).map((item) => {
      const resFuc = storeState[item];
      resultStoreState[item] = computed(resFuc.bind({ $store: store }));
    });

    const { currentUser } = { ...resultStoreState };

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

    return { currentView, isLoading, currentUser };
  },
};
</script>
