<template>
  <div class="chart-component">
    <div class="question-text">
      <h3>请调控饮水机至下述出水总量、出水温度和出水速度</h3>
      <p>
        出水总量：250-300毫升之间<br />
        出水温度：30度左右<br />
        出水速度：15毫升/s左右
      </p>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="volumeChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="tempChart"></canvas>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="speedChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "ChartComponent",
  props: {
    volume: {
      type: Number,
      required: true,
    },
    temp: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      volumeData: [600],
      volumeOpIdx: [0],
      tempData: [45],
      tempOpIdx: [0],
      speedData: [15],
      speedOpIdx: [0],
      chart: null, // Chart.js实例
    };
  },
  mounted() {
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxVolume = this.$refs.volumeChart.getContext('2d');
      const ctxTemp = this.$refs.tempChart.getContext('2d');
      const ctxSpeed = this.$refs.speedChart.getContext('2d');

      // 初始化两个图表
      this.chart = {
        volume: new Chart(ctxVolume, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '出水总量（毫升）',
              data: this.volumeData,
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
                  text: '出水总量（毫升）',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        temp: new Chart(ctxTemp, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '出水温度（度）',
              data: this.tempData,
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
                  text: '出水温度（度）',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        speed: new Chart(ctxSpeed, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '出水速度（毫升/秒）',
              data: this.speedData,
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
                  text: '出水速度（毫升/秒）',
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
      if (type === 'volume') {
        if (this.volumeData.length >= 6) {
          this.volumeData.shift();
          this.volumeOpIdx.shift();
        }
        this.volumeData.push(value);
        this.volumeOpIdx.push(this.volumeOpIdx[this.volumeOpIdx.length - 1] + 1);
      } else if (type === 'temp') {
        if (this.tempData.length >= 6) {
          this.tempData.shift();
          this.tempOpIdx.shift();
        }
        this.tempData.push(value);
        this.tempOpIdx.push(this.tempOpIdx[this.tempOpIdx.length - 1] + 1);
      } else if (type === 'speed') {
        if (this.speedData.length >= 6) {
          this.speedData.shift();
          this.speedOpIdx.shift();
        }
        this.speedData.push(value);
        this.speedOpIdx.push(this.speedOpIdx[this.speedOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.volume.data.labels = this.volumeOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.volume.data.datasets[0].data = this.volumeData;

      this.chart.temp.data.labels = this.tempOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.temp.data.datasets[0].data = this.tempData;

      this.chart.speed.data.labels = this.speedOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.speed.data.datasets[0].data = this.speedData;

      this.chart.volume.update();
      this.chart.temp.update();
      this.chart.speed.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.volumeData = [600];
      this.volumeOpIdx = [0];
      this.tempData = [45];
      this.tempOpIdx = [0];
      this.speedData = [15];
      this.speedOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.volume.destroy();
        this.chart.temp.destroy();
        this.chart.speed.destroy();
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
