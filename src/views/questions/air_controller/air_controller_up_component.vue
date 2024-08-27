<template>
    <div class="air-controller-up">
      <h2>CLIMATE CONTROL</h2>
      <p>
        You have no instructions for your new air conditioner. You need to work out how to use it.<br/>
        You can change the top, central and bottom controls on the left by using the sliders (-o-).
        The initial setting for each control is indicated by ▲.<br/>
        By clicking APPLY, you will see any changes in the temperature and humidity of the room in the temperature and humidity graphs.
        The box to the left of each graph shows the current level of temperature or humidity.
      </p>
      <div class="control-and-chart">
        <div class="flex-container">
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
        </div>
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
    flex-direction: column;
    width: 100%; /* 占据整个页面宽度 */
    padding: 0 20px; /* 减少左右内边距 */
    box-sizing: border-box;
  }
  
  .flex-container {
    display: flex;
    /* 可选: 如果需要间距，可以添加 gap 属性 */
    gap: 10px; /* 用于控制组件间的间距 */
  }
  h2 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 20px;
    line-height: 1.6;
  }
  </style>
  