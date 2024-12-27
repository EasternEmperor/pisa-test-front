<template>
  <div class="chart-component">
    <div class="chart-row">
      <div class="chart-item">
        <canvas ref="definitionChart"></canvas>
      </div>
      <div class="chart-item">
        <canvas ref="projectionChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js';

export default {
  name: 'ChartComponent',
  props: {
    definition: {
      type: Number,
      required: true
    },
    projection: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      definitionData: [0],
      definitionOpIdx: [0],
      projectionData: [0],
      projectionOpIdx: [0],
      chart: null // Chart.js实例
    };
  },
  mounted() {
    // 初始化图表
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      const ctxDefinition = this.$refs.definitionChart.getContext('2d');
      const ctxProjection = this.$refs.projectionChart.getContext('2d');

      // 初始化两个图表
      this.chart = {
        definition: new Chart(ctxDefinition, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '清晰度(K)',
              data: this.definitionData,
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
                  text: '清晰度(K)',
                  font: { size: 14, weight: 'bold' }
                }
              }
            }
          }
        }),
        projection: new Chart(ctxProjection, {
          type: 'line',
          data: {
            labels: ['初始值'],
            datasets: [{
              label: '画片大小',
              data: this.projectionData,
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
                  text: '画片大小',
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
      if (this.definitionData.length >= 6) {
        this.definitionData.shift();
        this.definitionOpIdx.shift();
      }
      if (this.projectionData.length >= 6) {
        this.projectionData.shift();
        this.projectionOpIdx.shift();
      }

      if (type === 'definition') {
        this.definitionData.push(value);
        this.definitionOpIdx.push(this.definitionOpIdx[this.definitionOpIdx.length - 1] + 1);
      } else if (type === 'projection') {
        this.projectionData.push(value);
        this.projectionOpIdx.push(this.projectionOpIdx[this.projectionOpIdx.length - 1] + 1);
      }

      // 更新图表
      this.updateChart();
    },
    updateChart() {
      this.chart.definition.data.labels = this.definitionOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.definition.data.datasets[0].data = this.definitionData;
      this.chart.projection.data.labels = this.projectionOpIdx.map(i => i === 0 ? '初始值' : `调控: ${i}`);
      this.chart.projection.data.datasets[0].data = this.projectionData;

      this.chart.definition.update();
      this.chart.projection.update();
    },
    resetChart() {
      // 清空数据并重置图表
      this.definitionData = [0];
      this.definitionOpIdx = [0];
      this.projectionData = [0];
      this.projectionOpIdx = [0];

      this.updateChart();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.definition.destroy();
        this.chart.projection.destroy();
      }
    },
  }
};
</script>

<style scoped>
.chart-component {
  width: 100%;
  display: flex;
  justify-content: center;
}

.chart-row {
  display: flex;
  flex-direction: row;
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
