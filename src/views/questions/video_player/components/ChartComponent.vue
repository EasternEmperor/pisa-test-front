<template>
  <div class="chart-component">
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
import { Chart } from 'chart.js';

export default {
  name: 'ChartComponent',
  props: {
    speed: {
      type: Number,
      required: true
    },
    volume: {
      type: Number,
      required: true
    },
    quality: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      speedData: [1, 1],
      speedOpIdx: [0, 0],
      volumeData: [20, 20],
      volumeOpIdx: [0, 0],
      qualityData: [0.4, 0.4],
      qualityOpIdx: [0, 0],
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
            labels: ['调控: 0', '调控: 0'],
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
            labels: ['调控: 0', '调控: 0'],
            datasets: [{
              label: '音量(dB)',
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
                  text: '音量(dB)',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        quality: new Chart(ctxQuality, {
          type: 'line',
          data: {
            labels: ['调控: 0', '调控: 0'],
            datasets: [{
              label: '画质(K)',
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
                  text: '画质(K)',
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
      this.chart.speed.data.labels = this.speedOpIdx.map(i => `调控: ${i}`);
      this.chart.speed.data.datasets[0].data = this.speedData;

      this.chart.volume.data.labels = this.volumeOpIdx.map(i => `调控: ${i}`);
      this.chart.volume.data.datasets[0].data = this.volumeData;

      this.chart.quality.data.labels = this.qualityOpIdx.map(i => `调控: ${i}`);
      this.chart.quality.data.datasets[0].data = this.qualityData;

      this.chart.speed.update();
      this.chart.volume.update();
      this.chart.quality.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.speedData = [1, 1];
      this.speedOpIdx = [0, 0];
      this.volumeData = [20, 20];
      this.volumeOpIdx = [0, 0];
      this.qualityData = [0.4, 0.4];
      this.qualityOpIdx = [0, 0];

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
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chart-row {
  display: flex;
  flex-direction: row;
  gap: 10px; /* 控制图表之间的间距 */
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
