<template>
  <div class="chart-component">
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="brightnessChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="definitionChart"></canvas>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="virtualizationChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="rangeChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js';

export default {
  name: 'ChartComponent',
  props: {
    brightness: {
      type: Number,
      required: true
    },
    definition: {
      type: Number,
      required: true
    },
    virtualization: {
      type: Number,
      required: true
    },
    range: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      brightnessData: [0],
      brightnessOpIdx: [0],
      definitionData: [0],
      definitionOpIdx: [0],
      virtualizationData: [0],
      virtualizationOpIdx: [0],
      rangeData: [0],
      rangeOpIdx: [0],
      chart: null // Chart.js实例
    };
  },
  mounted() {
    // 初始化图表
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxBrightness = this.$refs.brightnessChart.getContext('2d');
      const ctxDefinition = this.$refs.definitionChart.getContext('2d');
      const ctxVirtualization = this.$refs.virtualizationChart.getContext('2d');
      const ctxRange = this.$refs.rangeChart.getContext('2d');

      // 初始化三个图表
      this.chart = {
        brightness: new Chart(ctxBrightness, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '亮度',
              data: this.brightnessData,
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
                  text: '亮度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        definition: new Chart(ctxDefinition, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '清晰度',
              data: this.definitionData,
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
                  text: '清晰度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        virtualization: new Chart(ctxVirtualization, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '虚化程度',
              data: this.virtualizationData,
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
                  text: '虚化程度',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        range: new Chart(ctxRange, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '取景范围',
              data: this.rangeData,
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
                  text: '取景范围',
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
      if (type === 'brightness') {
        if (this.brightnessData.length >= 6) {
          this.brightnessData.shift();
          this.brightnessOpIdx.shift();
        }
        this.brightnessData.push(value);
        this.brightnessOpIdx.push(this.brightnessOpIdx[this.brightnessOpIdx.length - 1] + 1);
      } else if (type === 'definition') {
        if (this.definitionData.length >= 6) {
          this.definitionData.shift();
          this.definitionOpIdx.shift();
        }
        this.definitionData.push(value);
        this.definitionOpIdx.push(this.definitionOpIdx[this.definitionOpIdx.length - 1] + 1);
      } else if (type === 'virtualization') {
        if (this.virtualizationData.length >= 6) {
          this.virtualizationData.shift();
          this.virtualizationOpIdx.shift();
        }
        this.virtualizationData.push(value);
        this.virtualizationOpIdx.push(this.virtualizationOpIdx[this.virtualizationOpIdx.length - 1] + 1);
      } else if (type === 'range') {
        if (this.rangeData.length >= 6) {
          this.rangeData.shift();
          this.rangeOpIdx.shift();
        }
        this.rangeData.push(value);
        this.rangeOpIdx.push(this.rangeOpIdx[this.rangeOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.brightness.data.labels = this.brightnessOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.brightness.data.datasets[0].data = this.brightnessData;

      this.chart.definition.data.labels = this.definitionOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.definition.data.datasets[0].data = this.definitionData;

      this.chart.virtualization.data.labels = this.virtualizationOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.virtualization.data.datasets[0].data = this.virtualizationData;

      this.chart.range.data.labels = this.rangeOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.range.data.datasets[0].data = this.rangeData;

      this.chart.brightness.update();
      this.chart.definition.update();
      this.chart.virtualization.update();
      this.chart.range.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.brightnessData = [0];
      this.brightnessOpIdx = [0];
      this.definitionData = [0];
      this.definitionOpIdx = [0];
      this.virtualizationData = [0];
      this.virtualizationOpIdx = [0];
      this.rangeData = [0];
      this.rangeOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.brightness.destroy();
        this.chart.definition.destroy();
        this.chart.virtualization.destroy();
        this.chart.range.destroy();
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
