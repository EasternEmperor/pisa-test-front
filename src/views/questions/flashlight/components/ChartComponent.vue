<template>
  <div class="chart-component">
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="distanceChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="brightnessChart"></canvas>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="areaChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js';

export default {
  name: 'ChartComponent',
  props: {
    distance: {
      type: Number,
      required: true
    },
    brightness: {
      type: Number,
      required: true
    },
    area: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      distanceData: [30],
      distanceOpIdx: [0],
      brightnessData: [20],
      brightnessOpIdx: [0],
      areaData: [30],
      areaOpIdx: [0],
      chart: null // Chart.js实例
    };
  },
  mounted() {
    // 初始化图表
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxDistance = this.$refs.distanceChart.getContext('2d');
      const ctxBrightness = this.$refs.brightnessChart.getContext('2d');
      const ctxArea = this.$refs.areaChart.getContext('2d');

      // 初始化三个图表
      this.chart = {
        distance: new Chart(ctxDistance, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '照射距离（米）',
              data: this.distanceData,
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
                  text: '照射距离（米）',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        brightness: new Chart(ctxBrightness, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '亮度',
              data: this.brightnessData,
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
                  text: '亮度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        area: new Chart(ctxArea, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '照射范围',
              data: this.areaData,
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
                  text: '照射范围',
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
      if (type === 'distance') {
        if (this.distanceData.length >= 6) {
          this.distanceData.shift();
          this.distanceOpIdx.shift();
        }
        this.distanceData.push(value);
        this.distanceOpIdx.push(this.distanceOpIdx[this.distanceOpIdx.length - 1] + 1);
      } else if (type === 'brightness') {
        if (this.brightnessData.length >= 6) {
          this.brightnessData.shift();
          this.brightnessOpIdx.shift();
        }
        this.brightnessData.push(value);
        this.brightnessOpIdx.push(this.brightnessOpIdx[this.brightnessOpIdx.length - 1] + 1);
      } else if (type === 'area') {
        if (this.areaData.length >= 6) {
          this.areaData.shift();
          this.areaOpIdx.shift();
        }
        this.areaData.push(value);
        this.areaOpIdx.push(this.areaOpIdx[this.areaOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.distance.data.labels = this.distanceOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.distance.data.datasets[0].data = this.distanceData;

      this.chart.brightness.data.labels = this.brightnessOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.brightness.data.datasets[0].data = this.brightnessData;

      this.chart.area.data.labels = this.areaOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.area.data.datasets[0].data = this.areaData;

      this.chart.distance.update();
      this.chart.brightness.update();
      this.chart.area.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.distanceData = [30];
      this.distanceOpIdx = [0];
      this.brightnessData = [20];
      this.brightnessOpIdx = [0];
      this.areaData = [30];
      this.areaOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.distance.destroy();
        this.chart.brightness.destroy();
        this.chart.area.destroy();
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
