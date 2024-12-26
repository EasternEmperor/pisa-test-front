<template>
    <div class="big-air-controller-up">
      <h2>七、大空调遥控器</h2>
      <p>
        你新买的大空调没有说明书，需要你通过探索来学习如何使用它。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心和底部控制器。每个控制器的初始设置在▲的位置，<b>控制器只能逐步一格一格调整。</b><br/>
        控制器能够控制大空调的温度、湿度和风量，但三个控制器对温度、湿度和风量大小的具体影响需要你自己探索。<br/>
        由于基础设定，在控制器归零时（即▲位置）进行调控，大空调也会调整某些参数。<br/>
        当你设置好控制器后，点击"调控"键，你将在温度、湿度和风量曲线图中看到大空调的任何变化。鼠标置于曲线图的点上能查看该点的具体值。
      </p>
      <div class="control-and-chart">
        <div class="flex-container">
          <controller-component
            :top-control="topControl"
            :central-control="centralControl"
            :bottom-control="bottomControl"
            @update:top-control="handleTop"
            @update:central-control="handleCentral"
            @update:bottom-control="handleBottom"
          />
          <chart-component
            ref="chartComponent"
            :temp="temp"
            :humid="humid"
            :wind="wind"
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
  import ControllerComponent from './componentsT2/ControllerComponentT2.vue';
  import ChartComponent from './componentsT2/ChartComponentT2.vue';
  import ButtonComponent from './componentsT2/ButtonComponentT2.vue';
  
  export default {
    name: 'BigAirControllerUpComponent',
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
        // 温度、湿度和风量
        temp: 20,
        humid: 0,
        wind: 0,
      };
    },
    methods: {
      applyChanges() {
        this.applyTimes++;
        // 更新温度
        const newTemp = this.temp + 2 * this.topControl + 0.5 * this.bottomControl;
        this.temp = Math.max(0, newTemp.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('temp', this.temp);

        // 更新湿度
        const newHumid = this.humid + 15 * this.bottomControl;
        this.humid = Math.max(0, newHumid.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('humid', this.humid);

        // 更新风量
        const newWind = this.wind + 2.5 * this.centralControl + 0.25;
        this.wind = Math.max(0, newWind.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('wind', this.wind);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.temp = 20;
        this.humid = 0;
        this.wind = 0;

        // 调用 ChartComponent 的 resetChart 方法
        this.$refs.chartComponent.resetChart();

        this.$emit('resetChanges');
      },
      handleTop(value) {
        this.topControl = value;
        this.$emit('control');
      },
      handleCentral(value) {
        this.centralControl = value;
        this.$emit('control');
      },
      handleBottom(value) {
        this.bottomControl = value;
        this.$emit('control');
      }
    }
  };
  </script>
  
  <style scoped>
  .big-air-controller-up {
    display: flex;
    flex-direction: column;
    width: 100%; /* 占据整个页面宽度 */
    padding: 0 20px; /* 减少左右内边距 */
    box-sizing: border-box;
  }
  
  .flex-container {
    display: flex;
    flex-direction: row; /* 子组件按列排列 */
    justify-content: center; /* 垂直居中 */
    align-items: center; /* 水平居中 */
  }
  h2 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 20px;
    line-height: 1.6;
  }
  </style>
  