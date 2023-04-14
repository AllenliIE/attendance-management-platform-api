<template>
  <div class="container qrcode-reader" style="width: 500px; height: 500px">
    <br />
    <p>請開啟攝像頭！</p>
    <p>{{ errorText }}</p>
    <qrcode-stream @init="onInit" @decode="onDecode" />
  </div>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import attendanceAPI from "./../apis/attendance";
import { ref, reactive } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";
import { useStore } from "vuex";
import { Toast, storeCheck } from "./../utils/helpers";
dayjs.extend(utc, timezone);

export default {
  components: {
    QrcodeStream,
  },
  setup() {
    const store = useStore();
    const clockedInValue = localStorage.getItem("clockedIn");
    const clockInTimeValue = localStorage.getItem("clockInTime");
    const clockOutTimeValue = localStorage.getItem("clockOutTime");
    const dayChangeTimeValue = localStorage.getItem("dayChangeTime");

    const clockedInCheck = storeCheck(clockedInValue, store.state.clockedIn);
    const clockedIn = ref(clockedInCheck);
    const clockInTime = ref(clockInTimeValue);
    const clockOutTime = ref(clockOutTimeValue);
    const dayChangeTime = ref(dayChangeTimeValue);
    let errorText = ref("");

    const state = reactive({ data: null, hasScanned: false });
    const UserId = store.getters.userId;

    const handleAttendance = async (object) => {
      try {
        const clockIn = dayjs.utc().local().format("YYYY-MM-DD HH:mm:ss");
        const clockOut = dayjs.utc().local().format("YYYY-MM-DD HH:mm:ss");
        const date = object.date;
        dayChangeTime.value = dayjs(date)
          .add(1, "day")
          .format("YYYY-MM-DD 05:00:00");

        if (!state.hasScanned && !clockedIn.value) {
          store.commit("setClockedIn", true);
          localStorage.setItem("clockedIn", true);
          const { data } = await attendanceAPI.postAttendance({
            UserId,
            date,
            clockIn,
          });
          Toast.fire({
            icon: "success",
            title: data.message,
          });
          clockInTime.value = clockIn;
          localStorage.setItem("clockInTime", clockIn);
          localStorage.setItem("dayChangeTime", dayChangeTime);
          state.hasScanned = true;
        } else {
          clockOutTime.value = clockOut;

          if (!clockOutTime.value || dayjs.utc().local() > clockOutTime.value) {
            clockOutTime.value = dayjs.utc().local();
            clockedIn.value = true;
            store.commit("setClockedIn", true);
            localStorage.setItem("clockedIn", true);
          }
          const { data } = await attendanceAPI.updateAttendance({
            date,
            UserId,
            clockOut,
          });
          Toast.fire({
            icon: "success",
            title: data.message,
          });
          store.commit("setClockOutTime", clockOutTime.value);
          localStorage.setItem("clockOutTime", clockOutTime.value);
        }
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: error.message,
        });
      }
    };

    const onDecode = (data) => {
      state.data = data;
      const object = JSON.parse(atob(decodeURIComponent(data)));

      if (!state.hasScanned && !clockedIn.value) {
        handleAttendance(object);
      } else {
        handleAttendance(object);
      }
    };

    const onInit = async (promise) => {
      try {
        const { capabilities } = await promise;
        console.log(capabilities);
        // successfully initialized
      } catch (error) {
        let errorText = ref("");
        switch (error.name) {
          case "NotAllowedError":
            errorText.value = "請允許使用攝影機功能！";
            break;
          case "NotFoundError":
            errorText.value = "沒有安裝合適的攝像頭設備！";
            break;
          case "NotSupportedError":
            errorText.value = "瀏覽器尚未通過 HTTPS(或本地主機)！";
            break;
          case "NotReadableError":
            errorText.value = "請確認相機是否正在使用中！";
            break;
          case "OverconstrainedError":
            errorText.value = "請確認是否有前置攝像頭！";
            break;
          case "StreamApiNotSupportedError":
            errorText.value = "瀏覽器似乎缺少功能！";
            break;
        }
      } finally {
        // hide loading indicator
      }
    };

    return { onDecode, onInit, errorText };
  },
};
</script>
