<template>
  <aside class="col-xl-2 text-center" style="background-color: #14597f">
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
        title: "Clocking",
        path: "/clocking",
        fontawesome: "fa-solid fa-user-clock fa-3x",
      },
      {
        id: uuidv4(),
        title: "QRCode",
        path: "/clocking/qrcode/generator",
        fontawesome: "fa-solid fa-qrcode fa-3x",
      },
      {
        id: uuidv4(),
        title: "GPS",
        path: "/clocking/gps",
        fontawesome: "fa-solid fa-location-dot fa-3x",
      },
      {
        id: uuidv4(),
        title: "Profile",
        path: "/clocking/profile",
        fontawesome: "fa-solid fa-address-card fa-3x",
      },
    ]);

    return {
      tabs,
    };
  },
};
</script>
