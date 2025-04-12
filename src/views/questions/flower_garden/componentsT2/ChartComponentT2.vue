<template>
  <div class="chart-component">
    <div class="question-text">
      <h3>请调控养花小棚至下述温度、水分和养料</h3>
      <p>
        温度：25度左右<br />
        水分：20左右<br />
        养料：20左右
      </p>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="tempChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="waterChart"></canvas>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="fertilizerChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "ChartComponent",
  props: {
    temp: {
      type: Number,
      required: true,
    },
    water: {
      type: Number,
      required: true,
    },
    fertilizer: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tempData: [20],
      tempOpIdx: [0],
      waterData: [25],
      waterOpIdx: [0],
      fertilizerData: [15],
      fertilizerOpIdx: [0],
      chart: null // Chart.js实例
    };
  },
  mounted() {
    // 初始化图表
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxTemp = this.$refs.tempChart.getContext('2d');
      const ctxWater = this.$refs.waterChart.getContext('2d');
      const ctxFertilizer = this.$refs.fertilizerChart.getContext('2d');

      // 初始化三个图表
      this.chart = {
        temp: new Chart(ctxTemp, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '温度（度）',
              data: this.tempData,
              borderColor: 'red',
              borderWidth: 2,
              fill: false,
              tension: 0 // 禁用平滑曲线
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
                  text: '温度（度）',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        water: new Chart(ctxWater, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '水分',
              data: this.waterData,
              borderColor: 'blue',
              borderWidth: 2,
              fill: false,
              tension: 0 // 禁用平滑曲线
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
                  text: '水分',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        fertilizer: new Chart(ctxFertilizer, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '养料',
              data: this.fertilizerData,
              borderColor: 'green',
              borderWidth: 2,
              fill: false,
              tension: 0 // 禁用平滑曲线
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
                  text: '养料',
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
      if (type === 'temp') {
        if (this.tempData.length >= 6) {
          this.tempData.shift();
          this.tempOpIdx.shift();
        }
        this.tempData.push(value);
        this.tempOpIdx.push(this.tempOpIdx[this.tempOpIdx.length - 1] + 1);
      } else if (type === 'water') {
        if (this.waterData.length >= 6) {
          this.waterData.shift();
          this.waterOpIdx.shift();
        }
        this.waterData.push(value);
        this.waterOpIdx.push(this.waterOpIdx[this.waterOpIdx.length - 1] + 1);
      } else if (type === 'fertilizer') {
        if (this.fertilizerData.length >= 6) {
          this.fertilizerData.shift();
          this.fertilizerOpIdx.shift();
        }
        this.fertilizerData.push(value);
        this.fertilizerOpIdx.push(this.fertilizerOpIdx[this.fertilizerOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.temp.data.labels = this.tempOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.temp.data.datasets[0].data = this.tempData;

      this.chart.water.data.labels = this.waterOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.water.data.datasets[0].data = this.waterData;

      this.chart.fertilizer.data.labels = this.fertilizerOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.fertilizer.data.datasets[0].data = this.fertilizerData;

      this.chart.temp.update();
      this.chart.water.update();
      this.chart.fertilizer.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.tempData = [20];
      this.tempOpIdx = [0];
      this.waterData = [25];
      this.waterOpIdx = [0];
      this.fertilizerData = [15];
      this.fertilizerOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.temp.destroy();
        this.chart.water.destroy();
        this.chart.fertilizer.destroy();
      }
    }
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
