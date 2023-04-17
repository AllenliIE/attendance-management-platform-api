<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AsideTabs class="h-100" />
    <div class="col-xl-10 mt-5 text-center">
      <div
        class="container card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
        style="height: 800px"
      >
        <AppSpinner v-if="isLoading" />
        <h1>GPS Page</h1>
        <GPSMap />
      </div>
    </div>
  </div>
</template>

<script>
import AsideTabs from "./../../components/AsideTabs";
import GPSMap from "./../../components/GPSMap";

export default {
  components: {
    AsideTabs,
    GPSMap,
  },
};
</script>
