<template>
  <div class="chart-component">
    <div class="question-text">
      <h3>请调控空调至下述温度和湿度</h3>
      <p>
        温度：{{ randomTemperature }}<br />
        湿度：{{ randomHumidity }}<br />
      </p>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="temperatureChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="humidityChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "ChartComponent",
  props: {
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      randomTemperature: 18,
      randomHumidity: 33,
      temperatureData: [25, 25],
      humidityData: [25, 25],
      chart: null, // Chart.js实例
    };
  },
  mounted() {
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxTemperature = this.$refs.temperatureChart.getContext("2d");
      const ctxHumidity = this.$refs.humidityChart.getContext("2d");

      this.chart = {
        temperature: new Chart(ctxTemperature, {
          type: "line",
          data: {
            labels: [],
            datasets: [
              {
                label: "温度",
                data: this.temperatureData,
                borderColor: "red",
                borderWidth: 2,
                fill: false,
                tension: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              x: {
                display: false,
                ticks: { beginAtZero: true },
                grid: { lineWidth: 2 },
                title: {
                  display: true,
                  text: "操作次数",
                  font: { size: 14, weight: "bold" },
                },
              },
              y: {
                ticks: { beginAtZero: true },
                grid: { lineWidth: 2 },
                title: {
                  display: true,
                  text: "温度值",
                  font: { size: 14, weight: "bold" },
                },
              },
            },
          },
        }),
        humidity: new Chart(ctxHumidity, {
          type: "line",
          data: {
            labels: [],
            datasets: [
              {
                label: "湿度",
                data: this.humidityData,
                borderColor: "blue",
                borderWidth: 2,
                fill: false,
                tension: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              x: {
                display: false,
                ticks: { beginAtZero: true },
                grid: { lineWidth: 2 },
                title: {
                  display: true,
                  text: "操作次数",
                  font: { size: 14, weight: "bold" },
                },
              },
              y: {
                ticks: { beginAtZero: true },
                grid: { lineWidth: 2 },
                title: {
                  display: true,
                  text: "湿度值",
                  font: { size: 14, weight: "bold" },
                },
              },
            },
          },
        }),
      };
    },
  },
};
</script>

<style scoped>
.chart-component {
  width: 100%;
  display: flex;
  flex-direction: column; /* 垂直排列 */
  justify-content: center;
  align-items: center;
}

.question-text {
  text-align: center; /* 文字居中对齐 */
  margin-bottom: 20px; /* 增加文字与图表之间的间距 */
}

.chart-row {
  display: flex;
  flex-direction: row; /* 图表仍然并排显示 */
  gap: 10px; /* 控制两个图表之间的间距 */
  width: 100%;
  justify-content: center;
}

.chart-item {
  flex: 1;
  max-width: 45%; /* 每个图表的最大宽度 */
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  width: 100%;
  height: 200px;
}
</style>
