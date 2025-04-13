<template>
  <div class="chart-component">
    <div class="question-text">
      <h3>请调控阳光至下述照射面积、照射时间和照射强度</h3>
      <p>
        照射面积：15平方米左右<br />
        照射时间：45分钟左右<br />
        照射强度：13
      </p>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="areaChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="timeChart"></canvas>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="strengthChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "ChartComponent",
  props: {
    area: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    strength: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      areaData: [9],
      areaOpIdx: [0],
      timeData: [60],
      timeOpIdx: [0],
      strengthData: [10],
      strengthOpIdx: [0],
      chart: null // Chart.js实例
    };
  },
  mounted() {
    // 初始化图表
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxArea = this.$refs.areaChart.getContext('2d');
      const ctxTime = this.$refs.timeChart.getContext('2d');
      const ctxStrength = this.$refs.strengthChart.getContext('2d');

      // 初始化三个图表
      this.chart = {
        area: new Chart(ctxArea, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '照射面积（平方米）',
              data: this.areaData,
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
                  text: '照射面积（平方米）',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        time: new Chart(ctxTime, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '照射时间（分钟）',
              data: this.timeData,
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
                  text: '照射时间（分钟）',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        strength: new Chart(ctxStrength, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '照射强度',
              data: this.strengthData,
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
                  text: '照射强度',
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
      if (type === 'area') {
        if (this.areaData.length >= 6) {
          this.areaData.shift();
          this.areaOpIdx.shift();
        }
        this.areaData.push(value);
        this.areaOpIdx.push(this.areaOpIdx[this.areaOpIdx.length - 1] + 1);
      } else if (type === 'time') {
        if (this.timeData.length >= 6) {
          this.timeData.shift();
          this.timeOpIdx.shift();
        }
        this.timeData.push(value);
        this.timeOpIdx.push(this.timeOpIdx[this.timeOpIdx.length - 1] + 1);
      } else if (type === 'strength') {
        if (this.strengthData.length >= 6) {
          this.strengthData.shift();
          this.strengthOpIdx.shift();
        }
        this.strengthData.push(value);
        this.strengthOpIdx.push(this.strengthOpIdx[this.strengthOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.area.data.labels = this.areaOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.area.data.datasets[0].data = this.areaData;

      this.chart.time.data.labels = this.timeOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.time.data.datasets[0].data = this.timeData;

      this.chart.strength.data.labels = this.strengthOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.strength.data.datasets[0].data = this.strengthData;

      this.chart.area.update();
      this.chart.time.update();
      this.chart.strength.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.areaData = [9];
      this.areaOpIdx = [0];
      this.timeData = [60];
      this.timeOpIdx = [0];
      this.strengthData = [10];
      this.strengthOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.area.destroy();
        this.chart.time.destroy();
        this.chart.strength.destroy();
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
