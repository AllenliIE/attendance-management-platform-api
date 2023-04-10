<template>
  <div class="row vh-100" style="margin-top: 110px">
    <AsideTabs class="h-100" />
    <div class="col-xl-10 mt-5">
      <h1>Clocking Page</h1>
      <form @submit.prevent="submitAttendance">
        <label for="date">日期：</label>
        <input type="date" id="date" v-model="date" required />
        <br /><br />
        <label for="clockIn">上班時間：</label>
        <input type="time" id="clockIn" v-model="clockIn" required />
        <br /><br />
        <button type="submit">打卡上班</button>
      </form>
      <div v-if="message">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Toast } from "./../../utils/helpers";
import { useStore } from "vuex";
import AsideTabs from "./../../components/AsideTabs";
import attendanceAPI from "./../../apis/attendance";

export default {
  components: {
    AsideTabs,
  },
  setup() {
    const store = useStore();
    const date = ref("");
    const clockIn = ref("");
    const message = ref("");

    async function submitAttendance() {
      try {
        const formattedDate = new Date(date.value + " " + clockIn.value);

        const response = await attendanceAPI.postAttendance({
          date: date.value,
          clockIn: formattedDate,
          UserId: store.getters.userId,
        });
        console.log(response);
        if (response.data.status === "error") {
          Toast.fire({
            icon: "warning",
            title: `無法打卡 - ${response.data.message}`,
          });
        } else if (response.data.status === "success") {
          Toast.fire({
            icon: "success",
            title: `打卡成功 - ${response.data.message}`,
          });
        }
      } catch (error) {
        Toast.fire({
          icon: "warning",
          title: `無法打卡 - ${error.message}`,
        });
      }
    }

    return {
      date,
      clockIn,
      message,
      submitAttendance,
    };
  },
};
</script>
