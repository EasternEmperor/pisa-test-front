<template>
    <div class="flower-garden-up">
      <h2>八、自动养花小棚</h2>
      <p>
        你有一个自动养花小棚，能够保持花生长的温度、水分和养料。需要你通过探索来学习如何调控小棚的条件。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心、底部和横条控制器。每个控制器的初始设置在▲的位置，<b>控制器只能逐步一格一格调整。</b><br/>
        控制器能够控制养花小棚的温度、水分和养料，但四个控制器对温度、水分和养料大小的具体影响需要你自己探索。<br/>
        由于基础设定，在控制器归零时（即▲位置）进行调控，养花小棚也会调整某些条件。<br/>
        当你设置好控制器后，点击"调控"键，你将在温度、水分和养料曲线图中看到养花小棚的任何变化。
      </p>
      <div class="control-and-chart">
        <div class="flex-container">
          <controller-component
            :top-control="topControl"
            :central-control="centralControl"
            :bottom-control="bottomControl"
            :last-control="lastControl"
            @update:top-control="handleTop"
            @update:central-control="handleCentral"
            @update:bottom-control="handleBottom"
            @update:last-control="handleLast"
          />
          <chart-component
            ref="chartComponent"
            :temp="temp"
            :water="water"
            :fertilizer="fertilizer"
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
    name: 'FlowerGardenUpComponent',
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
        lastControl: 0,
        // 温度、水分和养料
        temp: 20,
        water: 0,
        fertilizer: 0,
      };
    },
    methods: {
      applyChanges() {
        this.applyTimes++;
        // 更新温度
        const newTemp = this.temp + 2 * this.bottomControl + 0.1;
        this.temp = Math.max(0, newTemp.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('temp', this.temp);

        // 更新水分
        const newWater = this.water + 1.5 * this.centralControl + 0.8 * this.lastControl;
        this.water = Math.max(0, newWater.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('water', this.water);

        // 更新养料
        const newFertilizer = this.fertilizer + 2 * this.topControl + this.lastControl;
        this.fertilizer = Math.max(0, newFertilizer.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('fertilizer', this.fertilizer);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.lastControl = 0;
        this.temp = 20;
        this.water = 0;
        this.fertilizer = 0;

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
      },
      handleLast(value) {
        this.lastControl = value;
        this.$emit('control');
      }
    }
  };
  </script>
  
  <style scoped>
  .flower-garden-up {
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
  