<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AdminAsideTabs class="h-100" />
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
            <i class="fa-solid fa-users fa-3x m-3"></i>
            <p class="mb-3 font-weight-normal" style="font-size: 48px">
              <strong> Users Page </strong>
            </p>
          </div>
          <AdminUserTable />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import AdminAsideTabs from "./../../components/AdminAsideTabs";
import AdminUserTable from "./../../components/AdminUserTable";
import AppSpinner from "./../../components/AppSpinner";

export default {
  components: {
    AdminAsideTabs,
    AdminUserTable,
    AppSpinner,
  },
};
</script>
