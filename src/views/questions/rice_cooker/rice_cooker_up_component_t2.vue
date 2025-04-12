<template>
    <div class="rice-cooker-up">
      <h2>十、二手电饭煲</h2>
      <p>
        你新买了一个没有说明书的二手电饭煲，需要你通过探索来学习如何调控电饭煲煮出美味的米饭。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心、底部和横条控制器。每个控制器的初始设置在▲的位置，<b>控制器只能逐步一格一格调整。</b><br/>
        控制器能够控制电饭煲煮出米饭的硬度、香甜度和煮饭时间，但四个控制器对米饭硬度、香甜度和煮饭时间大小的具体影响需要你自己探索。<br/>
        当你设置好控制器后，点击"调控"键，你将在米饭硬度、香甜度和煮饭时间曲线图中看到电饭煲的任何变化。鼠标置于曲线图的点上能查看该点的具体值。
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
            :hardness="hardness"
            :sweetness="sweetness"
            :cookTime="cookTime"
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
    name: 'RiceCookerUpComponent',
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
        // 米饭硬度、香甜度和煮饭时间
        hardness: 10,
        sweetness: 10,
        cookTime: 100,
      };
    },
    methods: {
      applyChanges() {
        this.applyTimes++;
        // 更新硬度
        const newHardness = this.hardness + 0.5 * this.topControl + this.bottomControl;
        this.hardness = Math.max(0, newHardness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('hardness', this.hardness);

        // 更新香甜度
        const newSweetness = this.sweetness + 1.5 * this.centralControl + 0.5 * this.lastControl;
        this.sweetness = Math.max(0, newSweetness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('sweetness', this.sweetness);

        // 更新煮饭时间
        const newCookTime = this.cookTime + 20 * this.topControl;
        this.cookTime = Math.max(0, newCookTime.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('cookTime', this.cookTime);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.lastControl = 0;
        this.hardness = 10;
        this.sweetness = 10;
        this.cookTime = 100;

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
  .rice-cooker-up {
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
  