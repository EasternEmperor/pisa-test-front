<template>
    <div class="fruit-tea-up">
      <h2>十二、果茶制作机</h2>
      <p>
        你新买的果茶制作机没有说明书，需要你通过探索来学习如何调控它制作美味的果茶。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心、底部和横条控制器。每个控制器的初始设置在▲的位置，<b>控制器一次只能调整一格。</b><br/>
        控制器能够控制果茶制作机制作果茶的容量、温度、甜度和果肉数量，但四个控制器对果茶容量、温度、甜度和果肉数量大小的具体影响需要你自己探索。<br/>
        当你设置好控制器后，点击"调控"键，你将在果茶容量、温度、甜度和果肉数量曲线图中看到果茶制作机的任何变化。
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
            :capacity="capacity"
            :temp="temp"
            :sweetness="sweetness"
            :pulp="pulp"
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
    name: 'FruitTeaUpComponent',
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
        // 果茶容量、温度、甜度和果肉数量
        capacity: 0,
        temp: 0,
        sweetness: 0,
        pulp: 0,
      };
    },
    methods: {
      applyChanges() {
        this.applyTimes++;
        // 更新容量
        const newCapacity = this.capacity + 200 * this.centralControl + 120 * this.lastControl;
        this.capacity = Math.max(0, newCapacity.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('capacity', this.capacity);

        // 更新温度
        const newTemp = this.temp + 5 * this.topControl;
        this.temp = Math.max(0, newTemp.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('temp', this.temp);

        // 更新甜度
        const newSweetness = this.sweetness + 2 * this.bottomControl + 0.85 * this.lastControl;
        this.sweetness = Math.max(0, newSweetness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('sweetness', this.sweetness);

        // 更新果肉数量
        const newPulp = this.pulp + 1.5 * this.bottomControl;
        this.pulp = Math.max(0, newPulp.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('pulp', this.pulp);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.lastControl = 0;
        this.capacity = 0;
        this.temp = 0;
        this.sweetness = 0;
        this.pulp = 0;

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
  .fruit-tea-up {
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
  