<template>
  <div class="chart-component">
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="tempChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="humidChart"></canvas>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="windChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js';

export default {
  name: 'ChartComponent',
  props: {
    temp: {
      type: Number,
      required: true
    },
    humid: {
      type: Number,
      required: true
    },
    wind: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tempData: [20],
      tempOpIdx: [0],
      humidData: [0],
      humidOpIdx: [0],
      windData: [0],
      windOpIdx: [0],
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
      const ctxHumid = this.$refs.humidChart.getContext('2d');
      const ctxWind = this.$refs.windChart.getContext('2d');

      // 初始化三个图表
      this.chart = {
        temp: new Chart(ctxTemp, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '温度',
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
                  text: '温度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        humid: new Chart(ctxHumid, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '湿度',
              data: this.humidData,
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
                  text: '湿度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        wind: new Chart(ctxWind, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '风量',
              data: this.windData,
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
                  text: '风量',
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
      } else if (type === 'humid') {
        if (this.humidData.length >= 6) {
          this.humidData.shift();
          this.humidOpIdx.shift();
        }
        this.humidData.push(value);
        this.humidOpIdx.push(this.humidOpIdx[this.humidOpIdx.length - 1] + 1);
      } else if (type === 'wind') {
        if (this.windData.length >= 6) {
          this.windData.shift();
          this.windOpIdx.shift();
        }
        this.windData.push(value);
        this.windOpIdx.push(this.windOpIdx[this.windOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.temp.data.labels = this.tempOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.temp.data.datasets[0].data = this.tempData;

      this.chart.humid.data.labels = this.humidOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.humid.data.datasets[0].data = this.humidData;

      this.chart.wind.data.labels = this.windOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.wind.data.datasets[0].data = this.windData;

      this.chart.temp.update();
      this.chart.humid.update();
      this.chart.wind.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.tempData = [20];
      this.tempOpIdx = [0];
      this.humidData = [0];
      this.humidOpIdx = [0];
      this.windData = [0];
      this.windOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.temp.destroy();
        this.chart.humid.destroy();
        this.chart.wind.destroy();
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
