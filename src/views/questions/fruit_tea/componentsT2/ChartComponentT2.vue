<template>
  <div class="chart-component">
    <div class="question-text">
      <h3>请调控自动喂猫机器至下述食物量和出水量</h3>
      <p>
        食物量：35-45之间<br />
        出水量：100-150之间<br />
      </p>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="foodChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="waterChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "ChartComponent",
  props: {
    food: {
      type: Number,
      required: true,
    },
    water: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      foodData: [25, 25],
      foodOpIdx: [0, 0],
      waterData: [25, 25],
      waterOpIdx: [0, 0],
      chart: null, // Chart.js实例
    };
  },
  mounted() {
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxFood = this.$refs.foodChart.getContext('2d');
      const ctxWater = this.$refs.waterChart.getContext('2d');

      // 初始化两个图表
      this.chart = {
        food: new Chart(ctxFood, {
          type: 'line',
          data: {
            labels: ['调控: 0', '调控: 0'],
            datasets: [{
              label: '食物量',
              data: this.foodData,
              borderColor: 'red',
              borderWidth: 2,
              fill: false,
              tension: 0  // 禁用平滑曲线
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              x: {
                ticks: { beginAtZero: true },
                grid: { lineWidth: 2 },
                title: {
                  display: true,
                  text: '调控',
                  font: { size: 14, weight: 'bold' }
                }
              },
              y: {
                ticks: { beginAtZero: true },
                grid: { lineWidth: 2 },
                title: {
                  display: true,
                  text: '食物量',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        water: new Chart(ctxWater, {
          type: 'line',
          data: {
            labels: ['调控: 0', '调控: 0'],
            datasets: [{
              label: '出水量',
              data: this.waterData,
              borderColor: 'blue',
              borderWidth: 2,
              fill: false,
              tension: 0  // 禁用平滑曲线
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              x: {
                ticks: { beginAtZero: true },
                grid: { lineWidth: 2 },
                title: {
                  display: true,
                  text: '调控',
                  font: { size: 14, weight: 'bold' }
                }
              },
              y: {
                ticks: { beginAtZero: true },
                grid: { lineWidth: 2 },
                title: {
                  display: true,
                  text: '出水量',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        })
      };
    },
    addData(type, value) {
      // 限制最多6个数据点
      if (this.foodData.length >= 6) {
        this.foodData.shift();
        this.foodOpIdx.shift();
      }
      if (this.waterData.length >= 6) {
        this.waterData.shift();
        this.waterOpIdx.shift();
      }

      if (type === 'food') {
        this.foodData.push(value);
        this.foodOpIdx.push(this.foodOpIdx[this.foodOpIdx.length - 1] + 1);
      } else if (type === 'water') {
        this.waterData.push(value);
        this.waterOpIdx.push(this.waterOpIdx[this.waterOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.food.data.labels = this.foodOpIdx.map(i => `调控: ${i}`);
      this.chart.food.data.datasets[0].data = this.foodData;
      this.chart.water.data.labels = this.waterOpIdx.map(i => `调控: ${i}`);
      this.chart.water.data.datasets[0].data = this.waterData;

      this.chart.food.update();
      this.chart.water.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.foodData = [25, 25];
      this.foodOpIdx = [0, 0];
      this.waterData = [25, 25];
      this.waterOpIdx = [0, 0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.food.destroy();
        this.chart.water.destroy();
      }
    },
  }
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
