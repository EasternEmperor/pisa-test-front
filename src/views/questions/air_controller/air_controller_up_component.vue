<template>
    <div class="air-controller-up">
      <div class="left-section">
        <h2>CLIMATE CONTROL</h2>
        <p>
          You have no instructions for your new air conditioner. You need to work out how to use it.<br/>
          You can change the top, central and bottom controls on the left by using the sliders (---).
          The initial setting for each control is indicated by ▲.<br/>
          By clicking APPLY, you will see any changes in the temperature and humidity of the room in the temperature and humidity graphs.
          The box to the left of each graph shows the current level of temperature or humidity.
        </p>
      </div>
      <div class="right-section">
        <controller-component
          :top-control="topControl"
          :central-control="centralControl"
          :bottom-control="bottomControl"
          @update:top-control="topControl = $event"
          @update:central-control="centralControl = $event"
          @update:bottom-control="bottomControl = $event"
        />
        <chart-component
          :temperature="temperature"
          :humidity="humidity"
        />
        <button-component
          @apply="applyChanges"
          @reset="resetChanges"
        />
      </div>
    </div>
  </template>
  
  <script>
  import ControllerComponent from './components/ControllerComponent.vue';
  import ChartComponent from './components/ChartComponent.vue';
  import ButtonComponent from './components/ButtonComponent.vue';
  
  export default {
    name: 'AirControllerUpComponent',
    components: {
      ControllerComponent,
      ChartComponent,
      ButtonComponent
    },
    data() {
      return {
        // 控制器值
        topControl: 0,
        centralControl: 0,
        bottomControl: 0,
        // 温度和湿度值
        temperature: 25,
        humidity: 25
      };
    },
    methods: {
      applyChanges() {
        // 更新温度
        const newTemperature = this.temperature + this.topControl;
        this.temperature = Math.min(30, Math.max(0, newTemperature));
  
        // 更新湿度
        const newHumidity = this.humidity + this.centralControl + this.bottomControl;
        this.humidity = Math.min(30, Math.max(0, newHumidity));
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.temperature = 25;
        this.humidity = 25;
      }
    }
  };
  </script>
  
  <style scoped>
  .air-controller-up {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .left-section {
    width: 45%;
    padding-right: 20px;
    line-height: 1.6;
  }
  
  .right-section {
    width: 55%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .right-section > * {
    margin-bottom: 20px;
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
  }
  
  p {
    font-size: 16px;
  }
  </style>
  