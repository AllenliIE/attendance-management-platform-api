<template>
  <AppSpinner v-if="isLoading" />
  <div v-else>
    <div class="d-flex justify-content-center text-center text-primary mb-4">
      <i class="fa-solid fa-user-clock fa-3x m-3"></i>
      <p class="mb-3 font-weight-normal" style="font-size: 48px">
        <strong> Clocking Page </strong>
      </p>
    </div>
    <h3 class="my-3">現在時間：{{ currentTime }}</h3>
    <div class="my-3 d-grid gap-2 col-4 mx-auto">
      <button
        v-if="!clockedIn"
        :disabled="isProcessing"
        @click="clockIn"
        class="btn btn-danger btn-circle"
      >
        <h3 class="mb-0">打卡上班</h3>
      </button>
      <button
        v-else
        :disabled="isProcessing"
        @click="clockOut"
        class="btn btn-success btn-circle"
      >
        <h3 class="mb-0">打卡下班</h3>
      </button>
    </div>
    <div
      class="my-3 card d-flex justify-content-between align-items-center"
      style="border: none; font-size: 24px"
    >
      <ul class="list-group">
        <li class="list-group-item">
          上班時間：
          <span v-if="clockInTime" class="badge bg-primary rounded-pill">
            {{ clockInTime }}
          </span>
          <span v-else class="badge bg-secondary rounded-pill">-</span>
        </li>
        <li class="list-group-item">
          下班時間：
          <span v-if="clockOutTime" class="badge bg-primary rounded-pill">
            {{ clockOutTime }}
          </span>
          <span v-else class="badge bg-secondary rounded-pill">-</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AppSpinner from "./../components/AppSpinner";
import attendanceAPI from "./../apis/attendance";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { ref } from "vue";
import { Toast, storeCheck } from "./../utils/helpers";
import { useStore } from "vuex";

dayjs.extend(utc, timezone);

export default {
  components: {
    AppSpinner,
  },
  setup() {
    const store = useStore();

    const currentTime = ref("");
    const date = ref(dayjs().format("YYYY-MM-DD"));
    const dayChangeTimeValue = localStorage.getItem("dayChangeTime");
    const clockedInValue = localStorage.getItem("clockedIn");

    const clockedInCheck = storeCheck(clockedInValue, store.state.clockedIn);
    const clockInTime = ref("");
    const clockOutTime = ref("");
    const dayChangeTime = ref(dayChangeTimeValue);

    const isLoading = ref(false);
    const isProcessing = ref(false);
    const clockedIn = ref(clockedInCheck);

    async function getClocking() {
      try {
        isLoading.value = true;
        isProcessing.value = true;

        const { data } = await attendanceAPI.getAttendance({
          UserId: store.getters.userId,
          date: date.value,
        });

        if (data.data) {
          clockInTime.value = data.data.clockIn;
          clockOutTime.value = data.data.clockOut;
          clockedIn.value = true;
          await showMessage(data.message, data.status);
        } else {
          clockedIn.value = false;
          await showMessage("今日尚未執行考勤作業！", "error");
        }

        isLoading.value = false;
        isProcessing.value = false;
      } catch (error) {
        await showMessage(error.message, "error");
      }
    }
    getClocking();

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
      } catch (error) {
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
      } catch (error) {
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
