<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AdminAsideTabs class="h-100" />
    <div class="col-xl-10 col-md-10 col-10 mt-5 text-center">
      <div
        class="container-field card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
        style="height: 1000px; margin-left: 55px; margin-right: 55px"
      >
        <div class="d-flex justify-content-center text-center text-primary">
          <i class="fa-solid fa-chart-column fa-3x m-3"></i>
          <p class="mb-3 font-weight-normal" style="font-size: 48px">
            <strong> Admin Page </strong>
          </p>
        </div>
        <AdminDashboard />
      </div>
    </div>
  </div>
</template>

<script>
import AdminAsideTabs from "./../../components/AdminAsideTabs";
import AdminDashboard from "./../../components/AdminDashboard";

export default {
  components: {
    AdminAsideTabs,
    AdminDashboard,
  },
};
</script>
