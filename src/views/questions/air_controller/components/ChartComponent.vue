<template>
    <div class="chart-component">
      <div class="chart-item">
        <div class="chart-label">
          <span>Temperature:</span>
          <span class="chart-value">{{ temperature }}</span>
        </div>
        <div class="chart-bar">
          <div
            class="bar temperature-bar"
            :style="{ width: temperaturePercentage + '%' }"
          ></div>
        </div>
      </div>
      <div class="chart-item">
        <div class="chart-label">
          <span>Humidity:</span>
          <span class="chart-value">{{ humidity }}</span>
        </div>
        <div class="chart-bar">
          <div
            class="bar humidity-bar"
            :style="{ width: humidityPercentage + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
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
    computed: {
      temperaturePercentage() {
        return (this.temperature / 30) * 100;
      },
      humidityPercentage() {
        return (this.humidity / 30) * 100;
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-component {
    width: 45%;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .chart-item {
    margin-bottom: 30px;
  }
  
  .chart-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  .chart-bar {
    width: 100%;
    height: 20px;
    background-color: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .bar {
    height: 100%;
    border-radius: 10px;
  }
  
  .temperature-bar {
    background-color: #ff4d4f;
  }
  
  .humidity-bar {
    background-color: #40a9ff;
  }
  </style>
  