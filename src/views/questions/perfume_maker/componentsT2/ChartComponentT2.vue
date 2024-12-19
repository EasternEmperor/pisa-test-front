<template>
  <div class="chart-component">
    <div class="question-text">
      <h3>请调控香水制作机制作一份满足下述浓度和香味留存时间要求的香水：</h3>
      <p>
        浓度：3.5<br />
        香味留存时间：4-5h<br />
      </p>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="concentrationChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="lastTimeChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "ChartComponent",
  props: {
    concentration: {
      type: Number,
      required: true,
    },
    lastTime: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      concentrationData: [0, 0],
      concentrationOpIdx: [0, 0],
      lastTimeData: [0, 0],
      lastTimeOpIdx: [0, 0],
      chart: null, // Chart.js实例
    };
  },
  mounted() {
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxConcentration = this.$refs.concentrationChart.getContext('2d');
      const ctxLastTime = this.$refs.lastTimeChart.getContext('2d');

      // 初始化两个图表
      this.chart = {
        concentration: new Chart(ctxConcentration, {
          type: 'line',
          data: {
            labels: ['调控: 0', '调控: 0'],
            datasets: [{
              label: '浓度',
              data: this.concentrationData,
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
                  text: '浓度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        lastTime: new Chart(ctxLastTime, {
          type: 'line',
          data: {
            labels: ['调控: 0', '调控: 0'],
            datasets: [{
              label: '留存时间(h)',
              data: this.lastTimeData,
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
                  text: '留存时间(h)',
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
      if (this.concentrationData.length >= 6) {
        this.concentrationData.shift();
        this.concentrationOpIdx.shift();
      }
      if (this.lastTimeData.length >= 6) {
        this.lastTimeData.shift();
        this.lastTimeOpIdx.shift();
      }

      if (type === 'concentration') {
        this.concentrationData.push(value);
        this.concentrationOpIdx.push(this.concentrationOpIdx[this.concentrationOpIdx.length - 1] + 1);
      } else if (type === 'lastTime') {
        this.lastTimeData.push(value);
        this.lastTimeOpIdx.push(this.lastTimeOpIdx[this.lastTimeOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.concentration.data.labels = this.concentrationOpIdx.map(i => `调控: ${i}`);
      this.chart.concentration.data.datasets[0].data = this.concentrationData;
      this.chart.lastTime.data.labels = this.lastTimeOpIdx.map(i => `调控: ${i}`);
      this.chart.lastTime.data.datasets[0].data = this.lastTimeData;

      this.chart.concentration.update();
      this.chart.lastTime.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.concentrationData = [0, 0];
      this.concentrationOpIdx = [0, 0];
      this.lastTimeData = [0, 0];
      this.lastTimeOpIdx = [0, 0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.concentration.destroy();
        this.chart.lastTime.destroy();
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
