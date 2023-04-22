<template>
  <div class="container d-flex justify-content-around mb-3">
    <div class="col-md-6">
      <h2 class="text-center mb-3">Attendance Trend 2023</h2>
      <canvas ref="barChart"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "AdminDashboard",
  setup() {
    const barChart = ref(null);

    onMounted(() => {
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
              data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
              backgroundColor: ["rgba(54, 162, 235, 0.2)"],
              borderColor: ["rgb(54, 162, 235)"],
              borderWidth: 1,
            },
            {
              type: "bar",
              label: "Absences",
              stack: "Stack 1",
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              borderColor: ["rgb(255, 99, 132)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    });
    return { barChart };
  },
};
</script>
