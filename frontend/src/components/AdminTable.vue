<template>
  <table class="table table-hover table-bordered text-center">
    <thead class="table-light">
      <tr class="table-primary">
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">Date</th>
        <th scope="col">ClockInTime</th>
        <th scope="col">ClockOutTime</th>
        <th scope="col">Absent</th>
        <th scope="col">Button</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="attendance in attendances" :key="attendance.id">
        <th scope="row">
          {{ attendance.id }}
        </th>
        <td>
          {{ attendance.User.name }}
        </td>
        <td>
          {{ attendance.date }}
        </td>
        <td>
          {{ attendance.clockIn }}
        </td>
        <td>
          {{ attendance.clockOut }}
        </td>
        <td>
          {{ attendance.absent ? "Yes" : "No" }}
        </td>
        <td>
          <button
            v-if="attendance.absent"
            class="btn btn-danger btn-sm"
            @click="putAbsent(attendance)"
            :disabled="isProcessing"
          >
            None Absence
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import adminAPI from "./../apis/admin";
import { ref } from "vue";
import { Toast } from "./../utils/helpers";
import { useRouter } from "vue-router";

dayjs.extend(utc, timezone);

export default {
  setup() {
    const router = useRouter();
    const isProcessing = ref(false);
    const attendances = ref([]);

    async function fetchAttendances() {
      try {
        const { data } = await adminAPI.attendance.getAttendance();
        if (data.status === "error") {
          throw new Error(data.message);
        }
        for (let i = 0; i < data.length; i++) {
          data[i].date = dayjs(data[i].date).format("YYYY-MM-DD");
          data[i].clockIn = dayjs(data[i].clockIn).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          data[i].clockOut = dayjs(data[i].clockOut).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          if (data[i].clockOut === "Invalid Date") {
            data[i].clockOut = "-";
          }
        }

        attendances.value = data;
        isProcessing.value = false;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得打卡清單！",
        });
        isProcessing.value = false;
      }
    }
    function formattedClockIn(clockIn) {
      return dayjs.tz(clockIn, "Asia/Taipei").format("YYYY-MM-DD HH:mm:ss");
    }
    function formattedClockOut(clockOut) {
      return dayjs.tz(clockOut, "Asia/Taipei").format("YYYY-MM-DD HH:mm:ss");
    }
    async function putAbsent(attendance) {
      try {
        isProcessing.value = true;
        const { data } = await adminAPI.absent.putAbsent(attendance.id);
        if (data.status === "error") {
          throw new Error(data.message);
        } else if (data.status === "success") {
          Toast.fire({
            icon: "success",
            title: data.message,
          });
        }
        router.push("/admin").then(() => {
          isProcessing.value = false;
          location.reload();
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
        isProcessing.value = false;
      }
    }
    fetchAttendances();
    return {
      attendances,
      formattedClockIn,
      formattedClockOut,
      putAbsent,
      isProcessing,
    };
  },
};
</script>
