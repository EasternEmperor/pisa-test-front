<template>
    <div class="water-dispenser-up">
      <h2>五、饮水机</h2>
      <p>
        你新买的饮水机没有说明书，需要你通过探索来学习如何使用它。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心和底部控制器。每个控制器的初始设置在▲的位置，<b>控制器一次只能调整一格。</b><br/>
        控制器能够控制饮水机的出水总量、出水温度和出水速度，但三个控制器的对出水总量、出水温度和出水速度大小的具体影响需要你自己探索。<br/>
        在控制器归零时（即▲位置），由于基础设定，饮水机也可能改变出水条件。<br/>
        当你设置好控制器后，点击"调控"键，你将在出水总量、出水温度和出水速度曲线图中看到饮水机的任何变化。
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
            :volume="volume"
            :temp="temp"
            :speed="speed"
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
    name: 'WaterDispenserUpComponent',
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
        // 出水总量、出水温度和出水速度大小
        volume: 150,
        temp: 13,
        speed: 10
      };
    },
    methods: {
      applyChanges() {
        this.applyTimes++;
        // 更新出水总量
        const newVolume = this.volume + 1.5 * this.centralControl;
        this.volume = Math.max(0, newVolume.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('volume', this.volume);

        // 更新出水温度
        const newTemp = this.temp + 15 * this.bottomControl + 2;
        this.temp = Math.max(0, newTemp.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('temp', this.temp);

        // 更新出水速度
        const newSpeed = this.speed + 20 * this.topControl + 5 * this.centralControl - 0.5;
        this.speed = Math.max(0, newSpeed.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('speed', this.speed);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.volume = 150;
        this.temp = 13;
        this.speed = 10;

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
  .water-dispenser-up {
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
  