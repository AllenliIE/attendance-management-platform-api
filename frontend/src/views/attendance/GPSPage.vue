<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AsideTabs class="h-100" />
    <div class="col-xl-10 col-md-10 col-10 mt-5 text-center">
      <div
        class="container-field card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
        style="height: 1000px; margin-left: 55px; margin-right: 55px"
      >
        <div
          class="d-flex justify-content-center text-center text-primary mb-4"
        >
          <i class="fa-solid fa-location-dot fa-3x m-3"></i>
          <p class="mb-3 font-weight-normal" style="font-size: 48px">
            <strong> GPS Page </strong>
          </p>
        </div>
        <GPSMap />
      </div>
    </div>
  </div>
</template>

<script>
import AsideTabs from "./../../components/AsideTabs";
import GPSMap from "./../../components/GPSMap";

export default {
  name: "GPSPage",
  components: {
    AsideTabs,
    GPSMap,
  },
};
</script>
