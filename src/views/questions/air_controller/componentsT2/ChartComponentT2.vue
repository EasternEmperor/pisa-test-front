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
  export default {
    name: 'ChartComponent',
    data() {
        return {
            randomTemperature: this.generateRandomNumber(17, 33),
            randomHumidity: this.generateRandomNumber(9, 35),
        };
    },
    methods: {
        generateRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
    },
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
        return (this.temperature / 35) * 100;
      },
      humidityPercentage() {
        return (this.humidity / 35) * 100;
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

  .question-text {
    margin-bottom: 20px;
  }
  </style>
  