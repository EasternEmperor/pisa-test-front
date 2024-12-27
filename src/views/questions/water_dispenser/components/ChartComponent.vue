<template>
  <div class="chart-component">
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
import { Chart } from 'chart.js';

export default {
  name: 'ChartComponent',
  props: {
    volume: {
      type: Number,
      required: true
    },
    temp: {
      type: Number,
      required: true
    },
    speed: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      volumeData: [150],
      volumeOpIdx: [0],
      tempData: [13],
      tempOpIdx: [0],
      speedData: [10],
      speedOpIdx: [0],
      chart: null // Chart.js实例
    };
  },
  mounted() {
    // 初始化图表
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxVolume = this.$refs.volumeChart.getContext('2d');
      const ctxTemp = this.$refs.tempChart.getContext('2d');
      const ctxSpeed = this.$refs.speedChart.getContext('2d');

      // 初始化三个图表
      this.chart = {
        volume: new Chart(ctxVolume, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '出水总量(ml)',
              data: this.volumeData,
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
                  text: '出水总量(ml)',
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
              label: '出水温度',
              data: this.tempData,
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
                  text: '出水温度',
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
              label: '出水速度(ml/s)',
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
                  text: '出水速度(ml/s)',
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
      this.volumeData = [150];
      this.volumeOpIdx = [0];
      this.tempData = [13];
      this.tempOpIdx = [0];
      this.speedData = [10];
      this.speedOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.volume.destroy();
        this.chart.temp.destroy();
        this.chart.speed.destroy();
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
