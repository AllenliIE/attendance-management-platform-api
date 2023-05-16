<template>
  <div>
    <AppSpinner v-if="isLoading">允許取得位置後，才能進行GPS打卡！</AppSpinner>
    <div v-else class="my-3 d-grid gap-2 col-4 mx-auto">
      <button
        v-if="!clockedIn"
        :disabled="!withinRange"
        @click="clockIn"
        class="btn btn-danger btn-circle"
      >
        <h3 class="mb-0">打卡上班</h3>
      </button>
      <button
        v-else-if="clockedIn"
        :disabled="!withinRange"
        @click="clockOut"
        class="btn btn-success btn-circle"
      >
        <h3 class="mb-0">打卡下班</h3>
      </button>
      <div
        class="my-3 card d-flex justify-content-between align-items-center"
        style="border: none"
      >
        <h3 class="text-primary">目前距離公司還有{{ distance }}公尺。</h3>
        <h3 v-if="!withinRange" class="text-danger">超出範圍，無法打卡！</h3>
      </div>
    </div>
    <div
      id="map"
      ref="mapContainer"
      class="m-auto"
      style="width: 50vh; height: 50vh"
    ></div>
  </div>
</template>

<script>
import attendanceAPI from "./../apis/attendance";
import AppSpinner from "./../components/AppSpinner";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { Toast, storeCheck } from "./../utils/helpers";

dayjs.extend(utc, timezone);

export default {
  name: "GPSMap",
  components: {
    AppSpinner,
  },
  setup() {
    const mapContainer = ref("map");
    const currentPosition = ref({ lat: "", long: "" });
    const companyPosition = {
      lat: 25.04211400258323,
      long: 121.5329032921531,
    };

    const distance = ref("?");
    const withinRange = ref(false);
    const isLoading = ref(true);

    onMounted(async () => {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            currentPosition.value.lat = position.coords.latitude;
            currentPosition.value.long = position.coords.longitude;
            resolve();
          },
          (error) => {
            console.error(error);
          },
          {
            enableHighAccuracy: true, // 設定高精準度
          }
        );
      });

      const map = L.map(mapContainer.value, {
        center: [currentPosition.value.lat, currentPosition.value.long],
        zoom: 8,
      });

      // show map
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const blueIcon = new L.Icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // company position range
      var circle = L.circle([companyPosition.lat, companyPosition.long], {
        color: "blue",
        fillColor: "#6495ED",
        fillOpacity: 0.5,
        radius: 500,
      }).addTo(map);

      // company position mark
      L.marker([companyPosition.lat, companyPosition.long], {
        icon: blueIcon,
      }).addTo(map);

      // current position mark
      L.marker([currentPosition.value.lat, currentPosition.value.long], {
        icon: blueIcon,
      }).addTo(map);

      let currentPositionPoint = L.latLng(
        currentPosition.value.lat,
        currentPosition.value.long
      );
      let companyPositionPoint = L.latLng(
        companyPosition.lat,
        companyPosition.long
      );

      distance.value = currentPositionPoint
        .distanceTo(companyPositionPoint)
        .toFixed();
      withinRange.value = distance.value < 400;

      isLoading.value = false;
      return {
        currentPosition,
        distance,
        circle,
        isLoading,
      };
    });

    const store = useStore();

    const date = ref(dayjs().format("YYYY-MM-DD"));
    const dayChangeTimeValue = localStorage.getItem("dayChangeTime");
    const clockedInValue = localStorage.getItem("clockedIn");
    const clockInTimeValue = localStorage.getItem("clockInTime");
    const clockOutTimeValue = localStorage.getItem("clockOutTime");

    const clockedInCheck = storeCheck(clockedInValue, store.state.clockedIn);
    const clockInTime = ref(clockInTimeValue);
    const clockOutTime = ref(clockOutTimeValue);
    const dayChangeTime = ref(dayChangeTimeValue);

    const isProcessing = ref(false);
    const clockedIn = ref(clockedInCheck);

    async function clockIn() {
      isLoading.value = true;
      isProcessing.value = true;
      clockedIn.value = true;
      clockInTime.value = dayjs.utc().local().format("YYYY-MM-DD HH:mm:ss");

      store.commit("setClockInTime", clockInTime.value);
      localStorage.setItem("clockInTime", clockInTime.value);

      dayChangeTime.value = dayjs(date.value)
        .add(1, "day")
        .format("YYYY-MM-DD 05:00:00");

      store.commit("setClockedIn", true);
      localStorage.setItem("clockedIn", true);

      try {
        const { data } = await attendanceAPI.postAttendance({
          UserId: store.getters.userId,
          date: date.value,
          clockIn: clockInTime.value,
        });

        await showMessage(data.message, data.status);
        isLoading.value = false;
        isProcessing.value = false;
      } catch (error) {
        isLoading.value = false;
        await showMessage(error.message, "error");
      } finally {
        isLoading.value = false;
        isProcessing.value = false;
      }
    }

    async function clockOut() {
      isLoading.value = true;
      isProcessing.value = true;
      clockedIn.value = true;
      clockOutTime.value = dayjs.utc().local().format("YYYY-MM-DD HH:mm:ss");
      date.value = dayjs().format("YYYY-MM-DD") + " 08:00:00";

      store.commit("setClockOutTime", clockOutTime.value);
      localStorage.setItem("clockOutTime", clockOutTime.value);

      clockedIn.value = true;
      store.commit("setClockedIn", true);
      localStorage.setItem("clockedIn", true);

      try {
        const { data } = await attendanceAPI.updateAttendance({
          UserId: store.getters.userId,
          date: date.value,
          clockOut: clockOutTime.value,
        });

        await showMessage(data.message, data.status);
        isLoading.value = false;
        isProcessing.value = false;
      } catch (error) {
        isLoading.value = false;
        await showMessage(error.message, "error");
      } finally {
        isLoading.value = false;
        isProcessing.value = false;
      }
    }

    async function showMessage(message, status) {
      if (status === "error") {
        Toast.fire({
          icon: "warning",
          title: message,
        });
      } else if (status === "success") {
        Toast.fire({
          icon: "success",
          title: message,
        });
      }
    }
    return {
      distance,
      withinRange,
      isLoading,
      clockIn,
      clockOut,
      clockedIn,
    };
  },
};
</script>
