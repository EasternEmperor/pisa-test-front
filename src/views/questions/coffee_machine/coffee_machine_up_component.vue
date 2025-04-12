<template>
    <div class="coffee-machine-up">
      <h2>十一、二手咖啡机</h2>
      <p>
        你新买了一个没有说明书的二手咖啡机，需要你通过探索来学习如何调控咖啡机制作美味的咖啡。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心、底部和横条控制器。每个控制器的初始设置在▲的位置，<b>控制器只能逐步一格一格调整。</b><br/>
        控制器能够控制咖啡机制作咖啡的容量、酸涩度、甜度和浓稠度，但四个控制器对咖啡容量、酸涩度、甜度和浓稠度大小的具体影响需要你自己探索。<br/>
        当你设置好控制器后，点击"调控"键，你将在咖啡容量、酸涩度、甜度和浓稠度曲线图中看到咖啡机的任何变化。鼠标置于曲线图的点上能查看该点的具体值。<br/>
        点击"重置"键，你可以将所有控制器重置到初始设置，容量、酸涩度、甜度和浓稠度数字也将变回初始值。
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
          :bitterness="bitterness"
          :sweetness="sweetness"
          :consistence="consistence"
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
    name: 'CoffeeMachineUpComponent',
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
        // 咖啡容量、酸涩度、甜度和浓稠度
        capacity: 800,
        bitterness: 10,
        sweetness: 10,
        consistence: 15
      };
    },
    methods: {
      applyChanges() {
        // 更新容量
        const newCapacity = this.capacity + 150 * this.topControl;
        this.capacity = Math.max(0, newCapacity.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('capacity', this.capacity);

        // 更新酸涩度
        const newBitterness = this.bitterness + 2 * this.centralControl + 0.5 * this.lastControl;
        this.bitterness = Math.max(0, newBitterness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('bitterness', this.bitterness);

        // 更新甜度
        const newSweetness = this.sweetness - this.centralControl + 3 * this.bottomControl;
        this.sweetness = Math.max(0, newSweetness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('sweetness', this.sweetness);

        // 更新浓稠度
        const newConsistence = this.consistence + 2.5 * this.lastControl;
        this.consistence = Math.max(0, newConsistence.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('consistence', this.consistence);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.lastControl = 0;
        this.capacity = 800;
        this.bitterness = 10;
        this.sweetness = 10;
        this.consistence = 15;

        // 调用 ChartComponent 的 resetChart 方法
        this.$refs.chartComponent.resetChart();

        this.$emit('resetChanges');
      },
      handleTop(value) {
        this.topControl = value;
        this.$emit('control', value);
      },
      handleCentral(value) {
        this.centralControl = value;
        this.$emit('control', value);
      },
      handleBottom(value) {
        this.bottomControl = value;
        this.$emit('control', value);
      },
      handleLast(value) {
        this.lastControl = value;
        this.$emit('control', value);
      }
    }
  };
  </script>
  
  <style scoped>
  .coffee-machine-up {
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
  