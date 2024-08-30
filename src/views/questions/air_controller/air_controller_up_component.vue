<template>
    <div class="air-controller-up">
      <h2>一、空调控制</h2>
      <p>
        你的新空调没有说明书，需要你通过探索如何使用它。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心和底部控件。每个控件的初始设置在▲的位置。<br/>
        点击"APLLY"键，你将在温度计和湿度计中看到房间温度和湿度的任何变化。<br/>
        点击"RESET"键，你可以将所有控件重置到初始设置，温度计和湿度计数字也将变回初始值。<br/>
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

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.temperature = 25;
        this.humidity = 25;

        this.$emit('resetChanges');
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
  