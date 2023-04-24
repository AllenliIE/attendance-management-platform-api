<template>
  <AppSpinner v-if="isLoading" />
  <div v-else class="container d-flex justify-content-around mb-3">
    <div class="col-md-6">
      <h2 class="text-center mb-3">Attendance Trend 2023</h2>
      <canvas
        ref="barChart"
        style="margin-top: 100px; transform: scale(1.5)"
      ></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import adminAPI from "./../apis/admin";
import AppSpinner from "./../components/AppSpinner";

import { ref, onMounted } from "vue";
import { Toast } from "./../utils/helpers";

export default {
  name: "AdminDashboard",
  components: {
    AppSpinner,
  },
  setup() {
    const barChart = ref(null);
    const attendances = ref([]);
    const absences = ref([]);
    const isLoading = ref(true);

    async function updateChartData() {
      try {
        const { data } = await adminAPI.attendance.getDashboard();
        attendances.value = data.attendances;
        absences.value = data.absences;
        isLoading.value = false;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得打卡趨勢圖！",
        });
        isLoading.value = false;
      }
    }

    onMounted(async () => {
      await updateChartData();

      const barCtx = barChart.value.getContext("2d");
      new Chart(barCtx, {
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          datasets: [
            {
              type: "bar",
              label: "Attendances",
              stack: "Stack 1",
              data: attendances.value,
              backgroundColor: ["rgba(54, 162, 235, 0.2)"],
              borderColor: ["rgb(54, 162, 235)"],
              borderWidth: 1,
            },
            {
              type: "bar",
              label: "Absences",
              stack: "Stack 1",
              data: absences.value,
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              borderColor: ["rgb(255, 99, 132)"],
              borderWidth: 1,
            },
          ],
        },
        options: {},
      });
    });
    return { barChart, isLoading };
  },
};
</script>
