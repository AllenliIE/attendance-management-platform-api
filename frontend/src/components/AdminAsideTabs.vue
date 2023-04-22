<template>
  <aside
    class="col-xl-2 col-md-2 col-2 text-center"
    style="background-color: #14597f"
  >
    <ul class="navbar-nav p-0">
      <li
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-item text-white m-4"
        style="text-decoration: none"
      >
        <router-link
          :to="tab.path"
          class="nav-link d-flex justify-content-between"
        >
          <div class="title">
            <i :class="tab.fontawesome" style="width: 100px"></i>
          </div>
          <div class="fontawesome text-center m-auto" style="width: 150px">
            <strong class="fs-4 m-1">
              {{ tab.title }}
            </strong>
          </div>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { reactive } from "vue";

export default {
  setup() {
    const tabs = reactive([
      {
        id: uuidv4(),
        title: "Administration",
        path: "/admin/attendance/dashboard",
        fontawesome: "fa-solid fa-address-book fa-3x",
      },
      {
        id: uuidv4(),
        title: "UsersList",
        path: "/admin/attendance/users",
        fontawesome: "fa-solid fa-users fa-3x",
      },
      {
        id: uuidv4(),
        title: "AbsentList",
        path: "/admin/attendance/absent",
        fontawesome: "fa-solid fa-list-check fa-3x",
      },
    ]);

    return {
      tabs,
    };
  },
};
</script>
