<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AsideTabs class="h-100" />
    <div class="col-xl-10 col-md-10 col-10 mt-5 p-0">
      <div
        class="container card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
        style="height: 1000px"
      >
        <ProfileTable />
      </div>
    </div>
  </div>
</template>

<script>
import AsideTabs from "./../../components/AsideTabs";
import ProfileTable from "./../../components/ProfileTable";

export default {
  name: "ProfilePage",
  components: {
    AsideTabs,
    ProfileTable,
  },
};
</script>
