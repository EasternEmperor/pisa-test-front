<template>
  <div class="chart-component">
    <div class="question-text">
      <h3>请调控果茶制作机制作一杯容量、温度、甜度和果肉数量符合下述要求的果茶：</h3>
      <p>
        容量：500ml左右<br />
        温度：10左右<br />
        甜度：5左右<br />
        果肉数量：3左右
      </p>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="capacityChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="tempChart"></canvas>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="sweetnessChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="pulpChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "ChartComponent",
  props: {
    capacity: {
      type: Number,
      required: true,
    },
    temp: {
      type: Number,
      required: true,
    },
    sweetness: {
      type: Number,
      required: true
    },
    pulp: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      capacityData: [0, 0],
      capacityOpIdx: [0, 0],
      tempData: [0, 0],
      tempOpIdx: [0, 0],
      sweetnessData: [0, 0],
      sweetnessOpIdx: [0, 0],
      pulpData: [0, 0],
      pulpOpIdx: [0, 0],
      chart: null // Chart.js实例
    };
  },
  mounted() {
    // 初始化图表
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxCapacity = this.$refs.capacityChart.getContext('2d');
      const ctxTemp = this.$refs.tempChart.getContext('2d');
      const ctxSweetness = this.$refs.sweetnessChart.getContext('2d');
      const ctxPulp = this.$refs.pulpChart.getContext('2d');

      // 初始化三个图表
      this.chart = {
        capacity: new Chart(ctxCapacity, {
          type: 'line',
          data: {
            labels: ['调控: 0', '调控: 0'],
            datasets: [{
              label: '容量(ml)',
              data: this.capacityData,
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
                  text: '容量(ml)',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        temp: new Chart(ctxTemp, {
          type: 'line',
          data: {
            labels: ['调控: 0', '调控: 0'],
            datasets: [{
              label: '温度',
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
                  text: '温度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        sweetness: new Chart(ctxSweetness, {
          type: 'line',
          data: {
            labels: ['调控: 0', '调控: 0'],
            datasets: [{
              label: '甜度',
              data: this.sweetnessData,
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
                  text: '甜度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        pulp: new Chart(ctxPulp, {
          type: 'line',
          data: {
            labels: ['调控: 0', '调控: 0'],
            datasets: [{
              label: '果肉数量',
              data: this.pulpData,
              borderColor: 'purple',
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
                  text: '果肉数量',
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
      if (type === 'capacity') {
        if (this.capacityData.length >= 6) {
          this.capacityData.shift();
          this.capacityOpIdx.shift();
        }
        this.capacityData.push(value);
        this.capacityOpIdx.push(this.capacityOpIdx[this.capacityOpIdx.length - 1] + 1);
      } else if (type === 'temp') {
        if (this.tempData.length >= 6) {
          this.tempData.shift();
          this.tempOpIdx.shift();
        }
        this.tempData.push(value);
        this.tempOpIdx.push(this.tempOpIdx[this.tempOpIdx.length - 1] + 1);
      } else if (type === 'sweetness') {
        if (this.sweetnessData.length >= 6) {
          this.sweetnessData.shift();
          this.sweetnessOpIdx.shift();
        }
        this.sweetnessData.push(value);
        this.sweetnessOpIdx.push(this.sweetnessOpIdx[this.sweetnessOpIdx.length - 1] + 1);
      } else if (type === 'pulp') {
        if (this.pulpData.length >= 6) {
          this.pulpData.shift();
          this.pulpOpIdx.shift();
        }
        this.pulpData.push(value);
        this.pulpOpIdx.push(this.pulpOpIdx[this.pulpOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.capacity.data.labels = this.capacityOpIdx.map(i => `调控: ${i}`);
      this.chart.capacity.data.datasets[0].data = this.capacityData;

      this.chart.temp.data.labels = this.tempOpIdx.map(i => `调控: ${i}`);
      this.chart.temp.data.datasets[0].data = this.tempData;

      this.chart.sweetness.data.labels = this.sweetnessOpIdx.map(i => `调控: ${i}`);
      this.chart.sweetness.data.datasets[0].data = this.sweetnessData;

      this.chart.pulp.data.labels = this.pulpOpIdx.map(i => `调控: ${i}`);
      this.chart.pulp.data.datasets[0].data = this.pulpData;

      this.chart.capacity.update();
      this.chart.temp.update();
      this.chart.sweetness.update();
      this.chart.pulp.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.capacityData = [0, 0];
      this.capacityOpIdx = [0, 0];
      this.tempData = [0, 0];
      this.tempOpIdx = [0, 0];
      this.sweetnessData = [0, 0];
      this.sweetnessOpIdx = [0, 0];
      this.pulpData = [0, 0];
      this.pulpOpIdx = [0, 0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.capacity.destroy();
        this.chart.temp.destroy();
        this.chart.sweetness.destroy();
        this.chart.pulp.destroy();
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
