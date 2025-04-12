<template>
  <div class="chart-component">
    <div class="question-text">
      <h3>请调控咖啡机制作一杯容量、酸涩度、甜度和浓稠度符合下述要求的咖啡：</h3>
      <p>
        容量：350毫升左右<br />
        酸涩度：5左右<br />
        甜度：5左右<br />
        浓稠度：10
      </p>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="capacityChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="bitternessChart"></canvas>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="sweetnessChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="consistenceChart"></canvas>
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
    bitterness: {
      type: Number,
      required: true,
    },
    sweetness: {
      type: Number,
      required: true
    },
    consistence: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      capacityData: [800],
      capacityOpIdx: [0],
      bitternessData: [10],
      bitternessOpIdx: [0],
      sweetnessData: [10],
      sweetnessOpIdx: [0],
      consistenceData: [15],
      consistenceOpIdx: [0],
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
      const ctxBitterness = this.$refs.bitternessChart.getContext('2d');
      const ctxSweetness = this.$refs.sweetnessChart.getContext('2d');
      const ctxConsistence = this.$refs.consistenceChart.getContext('2d');

      // 初始化三个图表
      this.chart = {
        capacity: new Chart(ctxCapacity, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '容量（毫升）',
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
                  text: '容量（毫升）',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        bitterness: new Chart(ctxBitterness, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '酸涩度',
              data: this.bitternessData,
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
                  text: '酸涩度',
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
        consistence: new Chart(ctxConsistence, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '甜度',
              data: this.consistenceData,
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
                  text: '甜度',
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
      } else if (type === 'bitterness') {
        if (this.bitternessData.length >= 6) {
          this.bitternessData.shift();
          this.bitternessOpIdx.shift();
        }
        this.bitternessData.push(value);
        this.bitternessOpIdx.push(this.bitternessOpIdx[this.bitternessOpIdx.length - 1] + 1);
      } else if (type === 'sweetness') {
        if (this.sweetnessData.length >= 6) {
          this.sweetnessData.shift();
          this.sweetnessOpIdx.shift();
        }
        this.sweetnessData.push(value);
        this.sweetnessOpIdx.push(this.sweetnessOpIdx[this.sweetnessOpIdx.length - 1] + 1);
      } else if (type === 'consistence') {
        if (this.consistenceData.length >= 6) {
          this.consistenceData.shift();
          this.consistenceOpIdx.shift();
        }
        this.consistenceData.push(value);
        this.consistenceOpIdx.push(this.consistenceOpIdx[this.consistenceOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.capacity.data.labels = this.capacityOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.capacity.data.datasets[0].data = this.capacityData;

      this.chart.bitterness.data.labels = this.bitternessOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.bitterness.data.datasets[0].data = this.bitternessData;

      this.chart.sweetness.data.labels = this.sweetnessOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.sweetness.data.datasets[0].data = this.sweetnessData;

      this.chart.consistence.data.labels = this.consistenceOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.consistence.data.datasets[0].data = this.consistenceData;

      this.chart.capacity.update();
      this.chart.bitterness.update();
      this.chart.sweetness.update();
      this.chart.consistence.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.capacityData = [800];
      this.capacityOpIdx = [0];
      this.bitternessData = [10];
      this.bitternessOpIdx = [0];
      this.sweetnessData = [10];
      this.sweetnessOpIdx = [0];
      this.consistenceData = [15];
      this.consistenceOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.capacity.destroy();
        this.chart.bitterness.destroy();
        this.chart.sweetness.destroy();
        this.chart.consistence.destroy();
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
