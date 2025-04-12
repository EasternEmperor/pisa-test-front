<template>
  <div class="chart-component">
    <div class="question-text">
      <h3>请调控视频播放器至下述播放速度、音量和画质</h3>
      <p>
        播放速度：2.0倍左右<br />
        音量：40左右<br />
        画质：1000左右
      </p>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="speedChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="volumeChart"></canvas>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="qualityChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "ChartComponent",
  props: {
    speed: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    quality: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      speedData: [1],
      speedOpIdx: [0],
      volumeData: [50],
      volumeOpIdx: [0],
      qualityData: [1500],
      qualityOpIdx: [0],
      chart: null // Chart.js实例
    };
  },
  mounted() {
    // 初始化图表
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxSpeed = this.$refs.speedChart.getContext('2d');
      const ctxVolume = this.$refs.volumeChart.getContext('2d');
      const ctxQuality = this.$refs.qualityChart.getContext('2d');

      // 初始化三个图表
      this.chart = {
        speed: new Chart(ctxSpeed, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '播放速度（倍）',
              data: this.speedData,
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
                  text: '播放速度（倍）',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        volume: new Chart(ctxVolume, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '音量',
              data: this.volumeData,
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
                  text: '音量',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        quality: new Chart(ctxQuality, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '画质',
              data: this.qualityData,
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
                  text: '画质',
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
      if (type === 'speed') {
        if (this.speedData.length >= 6) {
          this.speedData.shift();
          this.speedOpIdx.shift();
        }
        this.speedData.push(value);
        this.speedOpIdx.push(this.speedOpIdx[this.speedOpIdx.length - 1] + 1);
      } else if (type === 'volume') {
        if (this.volumeData.length >= 6) {
          this.volumeData.shift();
          this.volumeOpIdx.shift();
        }
        this.volumeData.push(value);
        this.volumeOpIdx.push(this.volumeOpIdx[this.volumeOpIdx.length - 1] + 1);
      } else if (type === 'quality') {
        if (this.qualityData.length >= 6) {
          this.qualityData.shift();
          this.qualityOpIdx.shift();
        }
        this.qualityData.push(value);
        this.qualityOpIdx.push(this.qualityOpIdx[this.qualityOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.speed.data.labels = this.speedOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.speed.data.datasets[0].data = this.speedData;

      this.chart.volume.data.labels = this.volumeOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.volume.data.datasets[0].data = this.volumeData;

      this.chart.quality.data.labels = this.qualityOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.quality.data.datasets[0].data = this.qualityData;

      this.chart.speed.update();
      this.chart.volume.update();
      this.chart.quality.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.speedData = [1];
      this.speedOpIdx = [0];
      this.volumeData = [50];
      this.volumeOpIdx = [0];
      this.qualityData = [1500];
      this.qualityOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.speed.destroy();
        this.chart.volume.destroy();
        this.chart.quality.destroy();
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
