<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AsideTabs class="h-100" />
    <div class="col-xl-10 mt-5 text-center">
      <div
        class="container card d-flex justify-content-center shadow p-3 mb-5 bg-body rounded"
        style="height: 800px"
      >
        <AppSpinner v-if="isLoading" />
        <template v-else>
          <h1>Clocking Page</h1>
          <h3 class="my-3">現在時間：{{ currentTime }}</h3>
          <div class="my-3">
            <button
              v-if="!clockedIn"
              :disabled="isProcessing"
              @click="clockIn"
              class="btn btn-danger btn-circle"
            >
              <p class="mb-0">打卡上班</p>
            </button>
            <button
              v-else
              :disabled="isProcessing"
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
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Toast, storeCheck } from "./../../utils/helpers";
import { useStore } from "vuex";
import AsideTabs from "./../../components/AsideTabs";
import AppSpinner from "./../../components/AppSpinner";
import attendanceAPI from "./../../apis/attendance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc, timezone);

export default {
  components: {
    AsideTabs,
    AppSpinner,
  },
  setup() {
    const store = useStore();

    const currentTime = ref("");
    const date = ref(dayjs().format("YYYY-MM-DD"));
    const dayChangeTime = ref("");
    const clockedInValue = localStorage.getItem("clockedIn");
    const clockInTimeValue = localStorage.getItem("clockInTime");
    const clockOutTimeValue = localStorage.getItem("clockOutTime");

    const clockedInCheck = storeCheck(clockedInValue, store.state.clockedIn);
    const clockInTime = ref(clockInTimeValue);
    const clockOutTime = ref(clockOutTimeValue);

    const isLoading = ref(false);
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
        isProcessing.value = false;
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: `無法打卡 - ${error.message}`,
        });
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
        isLoading.value = false;
        isProcessing.value = false;
      } catch (error) {
        isLoading.value = false;
        Toast.fire({
          icon: "warning",
          title: `無法打卡 - ${error.message}`,
        });
      } finally {
        isLoading.value = false;
        isProcessing.value = false;
      }
    }

    setInterval(() => {
      currentTime.value = dayjs.utc().local().format("YYYY-MM-DD HH:mm:ss");
      isLoading.value = false;
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
      isLoading,
      isProcessing,
    };
  },
};
</script>
