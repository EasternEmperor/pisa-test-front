<template>
    <div class="chart-component">
      <div class="chart-row">
        <div class="chart-item">
          <canvas ref="temperatureChart"></canvas>
        </div>
        <div class="chart-item">
          <canvas ref="humidityChart"></canvas>
        </div>
      </div>
      <div class="question-text">
        <h3>请调整空调至下述温度和湿度</h3>
        <p>
          温度：{{ randomTemperature }}<br/>
          湿度：{{ randomHumidity }}<br/>
        </p>
      </div>
    </div>
  </template>
  
<script>
import { Chart } from 'chart.js';

  export default {
    name: 'ChartComponent',
    props: {
      temperature: {
        type: Number,
        required: true
      },
      humidity: {
        type: Number,
        required: true
      }
    },
    data() {
        return {
            randomTemperature: 18,
            randomHumidity: 33,
            temperatureData: [25, 25],
            humidityData: [25, 25],
            chart: null // Chart.js实例
        };
    },
    mounted() {
      // 初始化图表
      this.initializeChart();
    },
    methods: {
      initializeChart() {
        const ctxTemperature = this.$refs.temperatureChart.getContext('2d');
        const ctxHumidity = this.$refs.humidityChart.getContext('2d');

        // 初始化两个图表
        this.chart = {
          temperature: new Chart(ctxTemperature, {
            type: 'line',
            data: {
              labels: [],
              datasets: [{
                label: '温度',
                data: this.temperatureData,
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
                  display: false,  // 隐藏横坐标刻度
                  ticks: { beginAtZero: true },
                  grid: { lineWidth: 2 },
                  title: {
                    display: true,
                    text: '操作次数',
                    font: { size: 14, weight: 'bold' }
                  }
                },
                y: {
                  ticks: { beginAtZero: true },
                  grid: { lineWidth: 2 },
                  title: {
                    display: true,
                    text: '温度值',
                    font: { size: 14, weight: 'bold' }
                  }
                }
              }
            }
          }),
          humidity: new Chart(ctxHumidity, {
            type: 'line',
            data: {
              labels: [],
              datasets: [{
                label: '湿度',
                data: this.humidityData,
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
                  display: false,  // 隐藏横坐标刻度
                  ticks: { beginAtZero: true },
                  grid: { lineWidth: 2 },
                  title: {
                    display: true,
                    text: '操作次数',
                    font: { size: 14, weight: 'bold' }
                  }
                },
                y: {
                  ticks: { beginAtZero: true },
                  grid: { lineWidth: 2 },
                  title: {
                    display: true,
                    text: '湿度值',
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
        if (this.temperatureData.length >= 6) {
          this.temperatureData.shift();
        }
        if (this.humidityData.length >= 6) {
          this.humidityData.shift();
        }

        if (type === 'temperature') {
          this.temperatureData.push(value);
        } else if (type === 'humidity') {
          this.humidityData.push(value);
        }

        // 更新图表
        this.updateChart();
      },
      updateChart() {
        this.chart.temperature.data.labels = Array.from({ length: this.temperatureData.length }, (_, i) => i);
        this.chart.temperature.data.datasets[0].data = this.temperatureData;
        this.chart.humidity.data.labels = Array.from({ length: this.humidityData.length }, (_, i) => i);
        this.chart.humidity.data.datasets[0].data = this.humidityData;

        this.chart.temperature.update();
        this.chart.humidity.update();
      },
      resetChart() {
        // 清空数据并重置图表
        this.temperatureData = [25, 25];
        this.humidityData = [25, 25];

        this.updateChart();
      }
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
  