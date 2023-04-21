<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AdminAsideTabs class="h-100" />
    <div class="col-xl-10 col-md-10 col-10 mt-5 text-center">
      <div
        class="container card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
        style="height: 1000px"
      >
        <AppSpinner v-if="isLoading" />
        <template v-else>
          <h1>Admin Page</h1>
          <AdminTable />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import AdminAsideTabs from "./../../components/AdminAsideTabs";
import AdminTable from "./../../components/AdminTable";
import AppSpinner from "./../../components/AppSpinner";

export default {
  components: {
    AdminAsideTabs,
    AdminTable,
    AppSpinner,
  },
};
</script>
