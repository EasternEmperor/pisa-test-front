<template>
  <div class="chart-component">
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="hardnessChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="sweetnessChart"></canvas>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="cookTimeChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js';

export default {
  name: 'ChartComponent',
  props: {
    hardness: {
      type: Number,
      required: true
    },
    sweetness: {
      type: Number,
      required: true
    },
    cookTime: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      hardnessData: [0],
      hardnessOpIdx: [0],
      sweetnessData: [0],
      sweetnessOpIdx: [0],
      cookTimeData: [0],
      cookTimeOpIdx: [0],
      chart: null // Chart.js实例
    };
  },
  mounted() {
    // 初始化图表
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxHardness = this.$refs.hardnessChart.getContext('2d');
      const ctxSweetness = this.$refs.sweetnessChart.getContext('2d');
      const ctxCookTime = this.$refs.cookTimeChart.getContext('2d');

      // 初始化三个图表
      this.chart = {
        hardness: new Chart(ctxHardness, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '硬度',
              data: this.hardnessData,
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
                  text: '硬度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        sweetness: new Chart(ctxSweetness, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '香甜度',
              data: this.sweetnessData,
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
                  text: '香甜度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        cookTime: new Chart(ctxCookTime, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '煮饭时间（分钟）',
              data: this.cookTimeData,
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
                  text: '煮饭时间（分钟）',
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
      if (type === 'hardness') {
        if (this.hardnessData.length >= 6) {
          this.hardnessData.shift();
          this.hardnessOpIdx.shift();
        }
        this.hardnessData.push(value);
        this.hardnessOpIdx.push(this.hardnessOpIdx[this.hardnessOpIdx.length - 1] + 1);
      } else if (type === 'sweetness') {
        if (this.sweetnessData.length >= 6) {
          this.sweetnessData.shift();
          this.sweetnessOpIdx.shift();
        }
        this.sweetnessData.push(value);
        this.sweetnessOpIdx.push(this.sweetnessOpIdx[this.sweetnessOpIdx.length - 1] + 1);
      } else if (type === 'cookTime') {
        if (this.cookTimeData.length >= 6) {
          this.cookTimeData.shift();
          this.cookTimeOpIdx.shift();
        }
        this.cookTimeData.push(value);
        this.cookTimeOpIdx.push(this.cookTimeOpIdx[this.cookTimeOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.hardness.data.labels = this.hardnessOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.hardness.data.datasets[0].data = this.hardnessData;

      this.chart.sweetness.data.labels = this.sweetnessOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.sweetness.data.datasets[0].data = this.sweetnessData;

      this.chart.cookTime.data.labels = this.cookTimeOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.cookTime.data.datasets[0].data = this.cookTimeData;

      this.chart.hardness.update();
      this.chart.sweetness.update();
      this.chart.cookTime.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.hardnessData = [0];
      this.hardnessOpIdx = [0];
      this.sweetnessData = [0];
      this.sweetnessOpIdx = [0];
      this.cookTimeData = [0];
      this.cookTimeOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.hardness.destroy();
        this.chart.sweetness.destroy();
        this.chart.cookTime.destroy();
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
