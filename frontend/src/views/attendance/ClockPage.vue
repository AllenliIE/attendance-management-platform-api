<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AsideTabs class="h-100" />
    <div class="col-xl-10 mt-5 text-center">
      <div
        class="container card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
        style="height: 800px"
      >
        <h1>Clocking Page</h1>
        <h3 class="my-3">現在時間：{{ currentTime }}</h3>
        <div class="my-3">
          <button
            :disabled="clockedIn"
            @click="clockIn"
            class="btn btn-danger btn-circle"
          >
            <p class="mb-0">打卡上班</p>
          </button>
          <button
            :disabled="!clockedIn"
            @click="clockOut"
            class="btn btn-success btn-circle"
          >
            <p class="mb-0">打卡下班</p>
          </button>
        </div>
        <div class="my-3">
          <p v-if="clockInTime">上班時間：{{ clockInTime }}</p>
          <p v-if="clockOutTime">下班時間：{{ clockOutTime }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Toast } from "./../../utils/helpers";
import { useStore } from "vuex";
import AsideTabs from "./../../components/AsideTabs";
import attendanceAPI from "./../../apis/attendance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc, timezone);

export default {
  components: {
    AsideTabs,
  },
  setup() {
    const store = useStore();

    const currentTime = ref("");
    const date = ref(dayjs().format("YYYY-MM-DD"));
    const clockInTime = ref("");
    const clockOutTime = ref("");
    const dayChangeTime = ref("");

    const clockedIn = ref(false);

    async function clockIn() {
      clockInTime.value = dayjs.utc().local().format("YYYY-MM-DD HH:mm:ss");
      clockedIn.value = true;

      dayChangeTime.value = dayjs(date.value)
        .add(1, "day")
        .format("YYYY-MM-DD 05:00:00");

      try {
        const { data } = await attendanceAPI.postAttendance({
          UserId: store.getters.userId,
          date: date.value,
          clockIn: clockInTime.value,
        });

        if (data.status === "error") {
          Toast.fire({
            icon: "warning",
            title: `無法打卡 - ${data.message}`,
          });
        } else if (data.status === "success") {
          Toast.fire({
            icon: "success",
            title: `打卡成功 - ${data.message}`,
          });
        }
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: `無法打卡 - ${error.message}`,
        });
      }
    }

    async function clockOut() {
      clockOutTime.value = dayjs.utc().local().format("YYYY-MM-DD HH:mm:ss");
      clockedIn.value = true;
      date.value = dayjs().format("YYYY-MM-DD") + " 08:00:00";

      try {
        const { data } = await attendanceAPI.updateAttendance({
          UserId: store.getters.userId,
          date: date.value,
          clockOut: clockOutTime.value,
        });

        if (data.status === "error") {
          Toast.fire({
            icon: "warning",
            title: `無法打卡 - ${data.message}`,
          });
        } else if (data.status === "success") {
          Toast.fire({
            icon: "success",
            title: `打卡成功 - ${data.message}`,
          });
        }
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: `無法打卡 - ${error.message}`,
        });
      }
    }

    setInterval(() => {
      currentTime.value = dayjs.utc().local().format("YYYY-MM-DD HH:mm:ss");
      if (dayjs(currentTime.value).isAfter(dayChangeTime.value)) {
        clockOutTime.value = "";
        clockedIn.value = false;
        store.commit("setClockedIn", false);
        // Clean up localStorage after dayChangeTime
        localStorage.removeItem("clockedIn");
        localStorage.removeItem("clockInTime");
        localStorage.removeItem("clockOutTime");
        localStorage.removeItem("dayChangeTime");
        localStorage.removeItem("date");
      }
    }, 1000);

    return {
      currentTime,
      dayChangeTime,
      clockInTime,
      clockOutTime,
      clockIn,
      clockOut,
      clockedIn,
    };
  },
};
</script>
